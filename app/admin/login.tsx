import { Colors } from '@/src/theme/Theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthService } from '@/src/services/AuthService';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLoginScreen() {
    const router = useRouter();
    const { login } = useAdminAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Mangler info', 'Vennligst fyll ut både brukernavn og passord.');
            return;
        }

        setLoggingIn(true);
        try {
            const result = await AuthService.login(username, password);
            if (result.success && result.user) {
                await login(result.user);
                // Redirect handled by layout or manually
                router.replace('/admin');
            } else {
                Alert.alert('Feil', result.error || 'Innlogging feilet.');
            }
        } catch (error) {
            Alert.alert('Systemfeil', 'Kunne ikke logge inn.');
        } finally {
            setLoggingIn(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.card}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-closed" size={30} color={Colors.primary.deep} />
                    </View>
                    <Text style={styles.title}>Admin Panel</Text>
                    <Text style={styles.text}>Logg inn med din brukerkonto.</Text>

                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Brukernavn"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Passord"
                        placeholderTextColor="#999"
                        secureTextEntry
                        onSubmitEditing={handleLogin}
                    />

                    <TouchableOpacity
                        style={[styles.button, (!username || !password) && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loggingIn || !username || !password}
                    >
                        {loggingIn ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Logg inn</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotLink} onPress={() => Alert.alert('Glemt passord?', 'Kontakt en administrator for å tilbakestille passordet ditt.')}>
                        <Text style={styles.forgotLinkText}>Glemt passord?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/')}>
                        <Text style={styles.backLinkText}>Tilbake til hovedsiden</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
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
        width: 320,
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        alignItems: 'center',
        elevation: 5,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3E5E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.primary.deep,
    },
    text: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#FCFCFC',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.primary.deep,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#CCC',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotLink: {
        marginTop: 20,
    },
    forgotLinkText: {
        color: Colors.primary.main,
        fontSize: 14,
        fontWeight: '500',
    },
    backLink: {
        marginTop: 20,
    },
    backLinkText: {
        color: '#999',
        fontSize: 14,
    },
});
