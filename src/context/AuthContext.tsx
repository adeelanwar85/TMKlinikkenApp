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
    address?: string; // Optional
    postcode?: string; // Optional
    city?: string; // Optional
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
            setHasBiometrics(false); // Web usually doesn't simulate this well for "Login form", keep simpler
            return;
        }
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setHasBiometrics(compatible && enrolled);
    };

    const checkPinStatus = async () => {
        if (Platform.OS === 'web') return;
        try {
            const pin = await SecureStore.getItemAsync('user_pin');
            if (pin) {
                setHasPin(true);
                // We do NOT lock immediately on simple app open unless we want strict security.
                // For a "Doctors App", maybe yes? 
                // Let's stick to: If previously logged in (user exists) AND PIN exists -> Lock.
                // isLocked default is false. 
                // We'll set isLocked = true inside loadUser if we find a user + pin?
            }
        } catch (e) {
            console.log("SecureStore Error", e);
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

                // Check if we should lock
                let pin;
                if (Platform.OS === 'web') {
                    pin = await AsyncStorage.getItem('user_pin');
                } else {
                    pin = await SecureStore.getItemAsync('user_pin');
                }

                if (pin) {
                    setHasPin(true);
                    setIsLocked(true); // Lock on cold start if PIN exists
                    attemptBiometricUnlock();
                }

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
        if (hasPin) {
            // Lock instead of wiping data
            setIsLocked(true);
            return;
        }

        // Full wipe if no PIN protection
        try {
            await AsyncStorage.removeItem('user_profile');
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
            await AsyncStorage.setItem('user_pin', pin);
        } else {
            await SecureStore.setItemAsync('user_pin', pin);
        }
        setHasPin(true);
    };

    const verifyPin = async (inputPin: string) => {
        let storedPin;
        if (Platform.OS === 'web') {
            storedPin = await AsyncStorage.getItem('user_pin');
        } else {
            storedPin = await SecureStore.getItemAsync('user_pin');
        }
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
