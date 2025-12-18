import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

type UserProfile = {
    name: string;
    phone: string;
    email: string;
    birthdate: string;
};

type AuthContextType = {
    user: UserProfile | null;
    isAuthenticated: boolean;
    hasBiometrics: boolean;
    registerUser: (profile: UserProfile) => Promise<void>;
    login: () => Promise<boolean>;
    logout: () => Promise<void>;
    enableBiometrics: () => Promise<boolean>;
    checkBiometricSupport: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasBiometrics, setHasBiometrics] = useState(false);

    useEffect(() => {
        loadUser();
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        if (Platform.OS === 'web') {
            setHasBiometrics(true);
            return;
        }
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setHasBiometrics(compatible && enrolled);
    };

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user_profile');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load user', error);
        }
    };

    const registerUser = async (profile: UserProfile) => {
        try {
            await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
            setUser(profile);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to save user', error);
            Alert.alert('Feil', 'Kunne ikke lagre brukerdata.');
        }
    };

    const login = async () => {
        // Simple login for MVP
        setIsAuthenticated(true);
        return true;
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user_profile');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const enableBiometrics = async () => {
        if (Platform.OS === 'web') {
            return true;
        }

        if (!hasBiometrics) {
            Alert.alert('Beklager', 'Enheten din støtter ikke FaceID/TouchID eller det er ikke satt opp.');
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Bekreft identitet for å aktivere',
        });

        if (result.success) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            hasBiometrics,
            registerUser,
            login,
            logout,
            enableBiometrics,
            checkBiometricSupport
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
