import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
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
    isLocked: boolean;
    hasBiometrics: boolean;
    hasPin: boolean;
    registerUser: (profile: UserProfile) => Promise<void>;
    login: () => Promise<boolean>;
    logout: () => Promise<void>;
    enableBiometrics: () => Promise<boolean>;
    checkBiometricSupport: () => Promise<void>;
    setPin: (pin: string) => Promise<void>;
    verifyPin: (pin: string) => Promise<boolean>;
    unlock: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLocked, setIsLocked] = useState(false); // Controls Lock Screen
    const [hasBiometrics, setHasBiometrics] = useState(false);
    const [hasPin, setHasPin] = useState(false);

    useEffect(() => {
        loadUser();
        checkBiometricSupport();
        checkPinStatus();
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

    const checkPinStatus = async () => {
        if (Platform.OS === 'web') return; // Skip secure store on web for now
        const pin = await SecureStore.getItemAsync('user_pin');
        if (pin) {
            setHasPin(true);
            setIsLocked(true); // Lock immediately if PIN exists
            // Try Biometrics auto-unlock
            attemptBiometricUnlock();
        }
    };

    const attemptBiometricUnlock = async () => {
        const bioEnabled = await AsyncStorage.getItem('biometrics_enabled');
        if (bioEnabled === 'true') {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Logg inn med FaceID/TouchID',
                fallbackLabel: 'Bruk PIN-kode'
            });
            if (result.success) {
                setIsLocked(false);
            }
        }
    }

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user_profile');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                // Only set authenticated if NOT locked? 
                // Currently isAuthenticated just means "Profile Exists". 
                // isLocked prevents access.
                setIsAuthenticated(true);
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
        setIsAuthenticated(true);
        return true;
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user_profile');
            // Optionally clear PIN on logout? Or keep it? keeping it for now.
            setUser(null);
            setIsAuthenticated(false);
            setIsLocked(false);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const enableBiometrics = async () => {
        if (Platform.OS === 'web') return true;

        if (!hasBiometrics) {
            Alert.alert('Beklager', 'Enheten din støtter ikke FaceID/TouchID eller det er ikke satt opp.');
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Bekreft identitet for å aktivere',
        });

        if (result.success) {
            await AsyncStorage.setItem('biometrics_enabled', 'true');
            return true;
        } else {
            return false;
        }
    };

    // PIN Methods
    const setPin = async (pin: string) => {
        if (Platform.OS === 'web') {
            alert("PIN-kode støttes ikke i nettleser ennå.");
            return;
        }
        await SecureStore.setItemAsync('user_pin', pin);
        setHasPin(true);
        // Ask to enable biometrics as well?
    };

    const verifyPin = async (inputPin: string) => {
        if (Platform.OS === 'web') return true;
        const storedPin = await SecureStore.getItemAsync('user_pin');
        return storedPin === inputPin;
    };

    const unlock = async () => {
        setIsLocked(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLocked,
            hasBiometrics,
            hasPin,
            registerUser,
            login,
            logout,
            enableBiometrics,
            checkBiometricSupport,
            setPin,
            verifyPin,
            unlock
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
