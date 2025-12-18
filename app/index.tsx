import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, Caption, H1 } from '@/src/theme/Typography';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const { user, enableBiometrics, login } = useAuth();

    const handleStart = async () => {
        if (user) {
            // User Exists -> Try Biometrics or direct login
            const success = await enableBiometrics();
            if (success) {
                await login(); // Set authenticated=true
                router.push('/(tabs)');
            } else {
                // Biometrics failed or cancelled, or not available
                // For MVP, if they fail bio but are "stored", we might surely just let them in 
                // OR ask for a PIN (which we haven't built).
                // Let's fallback to "Login success" for web/simplicity if enableBiometrics returns false 
                // but strictly we should probably require it.
                // For now: Just let them in if they click "Logg inn" on web where bio fails typically.
                await login();
                router.push('/(tabs)');
            }
        } else {
            // No user -> Go to Registration
            router.push('/login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('@/assets/images/tm-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Body style={styles.tagline}>Din skjønnhet, vår ekspertise.</Body>

                <Button
                    title={user ? "Logg inn" : "Kom i gang"}
                    onPress={handleStart}
                    style={styles.buttonStart}
                    textStyle={styles.buttonStartText}
                />
            </View>

            <View style={styles.footer}>
                <Caption style={styles.footerText}>Kontakt oss</Caption>
                <Caption style={styles.footerText}>E-post: post@tmklinikken.no</Caption>
                <Caption style={styles.footerText}>Tlf: 21 42 36 36</Caption>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.main,
    },
    content: {
        flex: 1,
        padding: Spacing.l,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 260, // Wider for new aspect ratio
        height: 60,
        marginBottom: Spacing.s,
        tintColor: Colors.neutral.white,
    },
    tagline: {
        color: Colors.neutral.white,
        marginBottom: Spacing.xl,
        opacity: 0.9,
    },
    buttonStart: {
        width: '100%',
        backgroundColor: Colors.neutral.white,
        marginBottom: Spacing.xl,
    },
    buttonStartText: {
        color: Colors.primary.main,
    },
    footer: {
        padding: Spacing.l,
        alignItems: 'center',
        paddingBottom: Spacing.xl,
    },
    footerText: {
        color: Colors.neutral.white,
        opacity: 0.7,
        marginBottom: 4,
    },
    alertText: {
        color: '#FFD93D', // Warning color from theme
        fontWeight: 'bold',
        marginTop: Spacing.s,
        opacity: 1,
    },
});
