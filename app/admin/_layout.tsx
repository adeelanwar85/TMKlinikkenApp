import { usePathname, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/src/theme/Theme';

const ADMIN_PIN = '1234'; // Simple PIN for now

export default function AdminLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Reset auth if they leave admin section?
    // Ideally we keep state, but let's just use local state for this session.

    const handleLogin = () => {
        if (pin === ADMIN_PIN) {
            setIsAuthenticated(true);
        } else {
            alert('Feil PIN');
            setPin('');
        }
    };



    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Admin Login 🔒</Text>
                    <Text style={styles.text}>Skriv inn PIN-kode for å få tilgang.</Text>
                    <TextInput
                        style={styles.input}
                        value={pin}
                        onChangeText={setPin}
                        placeholder="PIN"
                        placeholderTextColor="#999"
                        secureTextEntry
                        keyboardType="numeric"
                        autoFocus
                        onSubmitEditing={handleLogin}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Logg inn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/')}>
                        <Text style={styles.backLinkText}>Tilbake til hovedsiden</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 300,
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.primary.deep,
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: '#fafafa',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.primary.deep,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backLink: {
        marginTop: 20,
    },
    backLinkText: {
        color: '#999',
        fontSize: 14,
    },
});
