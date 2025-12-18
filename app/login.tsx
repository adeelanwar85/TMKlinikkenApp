import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1 } from '@/src/theme/Typography';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const { registerUser, login, isAuthenticated, enableBiometrics, hasBiometrics } = useAuth();

    // State for registration form
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');

    // Check if user is already authenticated (auto-login scenario)
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);

    const formatDate = (dateString: string) => {
        // Remove invalid chars
        let clean = dateString.replace(/[^0-9.]/g, '');

        // Handle dots input (7.8.89)
        if (clean.includes('.')) {
            const parts = clean.split('.');
            if (parts.length === 3) {
                let d = parts[0].padStart(2, '0');
                let m = parts[1].padStart(2, '0');
                let y = parts[2];
                if (y.length === 2) {
                    const yearNum = parseInt(y, 10);
                    // Simple pivot: if > 24, assume 19xx, else 20xx
                    y = yearNum > 24 ? '19' + y : '20' + y;
                }
                clean = `${d}${m}${y}`;
            }
        }

        // Handle generic 6 or 8 digit stream
        if (clean.length === 6 || clean.length === 8) {
            let day = clean.substring(0, 2);
            let month = clean.substring(2, 4);
            let year = clean.substring(4);

            if (year.length === 2) {
                const yearNum = parseInt(year, 10);
                year = yearNum > 24 ? '19' + year : '20' + year;
            }

            return `${day}.${month}.${year}`;
        }

        return dateString;
    };

    const handleDateBlur = () => {
        setBirthdate(formatDate(birthdate));
    };

    const handleRegister = async () => {
        if (!name || !phone || !email || !birthdate) {
            Alert.alert('Mangler info', 'Vennligst fyll ut alle feltene.');
            return;
        }

        // 1. Save User Data
        await registerUser({
            name,
            phone,
            email,
            birthdate
        });

        // 2. Offer Biometrics (if available)
        if (hasBiometrics) {
            Alert.alert(
                'Aktiver FaceID / TouchID',
                'Vil du bruke biometri for raskere innlogging neste gang?',
                [
                    { text: 'Nei takk', style: 'cancel', onPress: completeLogin },
                    {
                        text: 'Ja, gjerne',
                        onPress: async () => {
                            const success = await enableBiometrics();
                            if (success) {
                                Alert.alert('Suksess', 'Biometri er aktivert!');
                            } else {
                                Alert.alert('Feil', 'Kunne ikke aktivere biometri.');
                            }
                            completeLogin();
                        }
                    }
                ]
            );
        } else {
            completeLogin();
        }
    };

    const completeLogin = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Image
                            source={require('@/assets/images/tm-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <H1 style={styles.title}>Velkommen</H1>
                        <Body style={styles.subtitle}>Registrer deg for å komme i gang med TM Legetjenester.</Body>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Fullt navn"
                            placeholder="Ola Nordmann"
                            value={name}
                            onChangeText={setName}
                        />
                        <Input
                            label="Fødselsdato (dd.mm.åååå)"
                            placeholder="12.03.1985"
                            value={birthdate}
                            onChangeText={setBirthdate}
                            keyboardType="numeric"
                            onBlur={handleDateBlur}
                        />
                        <Input
                            label="Telefonnummer"
                            placeholder="123 45 678"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <Input
                            label="E-post"
                            placeholder="ola@eksempel.no"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Start nå"
                            onPress={handleRegister}
                        />
                        <View style={styles.legalContainer}>
                            <Body style={styles.termsText}>Ved å fortsette godtar du våre </Body>
                            <TouchableOpacity onPress={() => router.push({ pathname: '/legal', params: { type: 'terms' } })}>
                                <Body style={[styles.termsText, styles.linkText]}>vilkår</Body>
                            </TouchableOpacity>
                            <Body style={styles.termsText}> og </Body>
                            <TouchableOpacity onPress={() => router.push({ pathname: '/legal', params: { type: 'privacy' } })}>
                                <Body style={[styles.termsText, styles.linkText]}>personvernerklæring</Body>
                            </TouchableOpacity>
                            <Body style={styles.termsText}>.</Body>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.l,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logo: {
        width: 220,
        height: 55,
        marginBottom: Spacing.m,
    },
    title: {
        color: Colors.primary.deep,
        marginBottom: Spacing.s,
    },
    subtitle: {
        textAlign: 'center',
        color: Colors.neutral.darkGray,
    },
    form: {
        marginBottom: Spacing.xl,
    },
    footer: {
        marginTop: 'auto',
    },
    termsText: {
        fontSize: 12,
        color: Colors.neutral.darkGray,
        opacity: 0.6,
    },
    legalContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: Spacing.m,
    },
    linkText: {
        textDecorationLine: 'underline',
        color: Colors.primary.deep,
        opacity: 1, // Ensure link is fully visible
    },
});
