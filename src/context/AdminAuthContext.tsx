import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdminUser, AuthService } from '../services/AuthService';
import { useRouter, useSegments } from 'expo-router';
import { Alert } from 'react-native';

interface AdminAuthContextType {
    user: Omit<AdminUser, 'passwordHash'> | null;
    isLoading: boolean;
    login: (u: Omit<AdminUser, 'passwordHash'>) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isSuperuser: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    user: null,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
    isAuthenticated: false,
    isSuperuser: false
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Omit<AdminUser, 'passwordHash'> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Init: Check persisted session and Seed DB
        const init = async () => {
            // 1. Seed
            await AuthService.seedSuperuserIfNeeded();

            // 2. Load Session
            try {
                const json = await AsyncStorage.getItem('admin_user');
                if (json) {
                    setUser(JSON.parse(json));
                }
            } catch (e) {
                console.error("Auth Load Error", e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Protection Logic (can be here or in layout)
    // Putting it here monitors changes
    useEffect(() => {
        if (isLoading) return;

        const inAdmin = segments[0] === 'admin';

        // If in admin but not Login/Forgot logic
        // We handle "Login Screen" exclusion in _layout usually, but let's check basic protection

    }, [user, isLoading, segments]);

    const login = async (userData: Omit<AdminUser, 'passwordHash'>) => {
        setUser(userData);
        await AsyncStorage.setItem('admin_user', JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('admin_user');
        router.replace('/admin/login');
    };

    return (
        <AdminAuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user,
            isSuperuser: user?.role === 'superuser'
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}
