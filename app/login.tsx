import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2 } from '@/src/theme/Typography';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HanoService from '@/src/services/HanoService';

// --- HELPER COMPONENT (Defined outside to prevent re-render focus loss) ---
const LoginInput = ({ label, ...props }: any) => (
    <View style={{ marginBottom: 15 }}>
        <Body style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 5, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Body>
        <Input
            {...props}
            style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'transparent',
                borderWidth: 0,
                color: 'white',
            }}
            placeholderTextColor="rgba(255,255,255,0.4)"
            label="" // We render custom label above
        />
    </View>
);

export default function LoginScreen() {
    const router = useRouter();
    const { registerUser, isAuthenticated, enableBiometrics, setPin } = useAuth();

    // Steps: 'PHONE' | 'OTP' | 'REGISTER' | 'SUCCESS_SPLASH'
    const [step, setStep] = useState<'PHONE' | 'OTP' | 'REGISTER' | 'SUCCESS_SPLASH'>('PHONE');
    const [loading, setLoading] = useState(false);

    // Data
    const [phone, setPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [hanoCustomer, setHanoCustomer] = useState<any>(null);

    // Registration Data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [postcode, setPostcode] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        // Only redirect if authenticated AND NOT in the middle of our success splash
        if (isAuthenticated && step !== 'SUCCESS_SPLASH') {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, step]);

    const handlePhoneSubmit = async () => {
        // Sanitize phone: Remove spaces, +47, etc.
        const cleanPhone = phone.replace(/\s+/g, '').replace(/^(\+47|47|0047)/, '');

        if (cleanPhone.length < 8) {
            Alert.alert("Ugyldig nummer", "Vennligst skriv inn et gyldig mobilnummer.");
            return;
        }
        setLoading(true);
        try {
            console.log("Checking user in Hano via Phone:", cleanPhone);

            // STRATEGY 1: Use the Verified "GetCustomerByMobile" Endpoint (Authorized Key)
            // This is confirmed to return [{ Id: 642, ... }] for existing users.
            let customerData = await HanoService.getCustomerByMobile(cleanPhone);

            let hanoId = customerData?.Id;

            // STRATEGY 2: Fallback to Search if Strategy 1 yields nothing
            if (!hanoId) {
                console.log("Direct lookup empty, trying deep Search...");
                hanoId = await HanoService.findCustomerId(cleanPhone);
            }

            if (hanoId) {
                console.log("Customer Identified:", hanoId);
                setCustomerId(hanoId);
                if (customerData) setHanoCustomer(customerData);

                const sent = await HanoService.sendOTP(hanoId);
                if (sent) {
                    setStep('OTP');
                } else {
                    Alert.alert("Feil", "Kunne ikke sende SMS. Prøv igjen.");
                }
            } else {
                console.log("Customer not found. Redirecting to registration.");
                setStep('REGISTER');
            }
        } catch (error) {
            console.error("Login Error:", error);
            // Default to register if API fails, so user isn't stuck
            setStep('REGISTER');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        if (otpCode.length < 4) return;
        setLoading(true);
        try {
            if (!customerId) return;
            const success = await HanoService.loginWithOTP(customerId, otpCode);
            if (success) {
                const profile = {
                    name: `${hanoCustomer.FirstName} ${hanoCustomer.LastName}`,
                    phone: hanoCustomer.Mobile || phone,
                    email: hanoCustomer.Email || '',
                    birthdate: hanoCustomer.DateOfBirth || '',
                    address: hanoCustomer.Address1,
                    postcode: hanoCustomer.PostalCode,
                    city: hanoCustomer.City
                };

                // Register/Save User -> This persists them in AsyncStorage
                await registerUser(profile);

                setLoading(false);
                setStep('SUCCESS_SPLASH');

                // Wait for splash, then ask for Biometrics/PIN
                setTimeout(() => {
                    askForBiometricsOrPin();
                }, 1500);

            } else {
                Alert.alert("Feil kode", "Koden stemmer ikke. Prøv igjen.");
                setLoading(false);
            }
        } catch (error) {
            Alert.alert("Feil", "Innlogging feilet.");
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !birthdate) return;
        setLoading(true);
        // Save local user
        await registerUser({ name, phone, email, birthdate, address, postcode, city });
        setLoading(false);
        setStep('SUCCESS_SPLASH');
        setTimeout(() => {
            askForBiometricsOrPin();
        }, 1500);
    };

    const handleDateChange = (text: string) => {
        // Remove non-digits
        const cleaned = text.replace(/[^0-9]/g, '');
        let formatted = cleaned;

        // Auto-insert dots for dd.mm
        if (cleaned.length > 2) {
            formatted = cleaned.slice(0, 2) + '.' + cleaned.slice(2);
        }
        if (cleaned.length > 4) {
            formatted = cleaned.slice(0, 2) + '.' + cleaned.slice(2, 4) + '.' + cleaned.slice(4);
        }

        // Smart Year Expansion (YY -> YYYY) on 6 digits
        if (cleaned.length === 6) {
            const day = cleaned.slice(0, 2);
            const month = cleaned.slice(2, 4);
            const yearShort = parseInt(cleaned.slice(4, 6), 10);

            // Heuristic: If year > 30, assume 19xx (e.g. 86 -> 1986). Else 20xx.
            // Adjust threshold as needed. 86 is definitely 1986. 
            const century = yearShort > 30 ? '19' : '20';
            formatted = `${day}.${month}.${century}${yearShort}`;
        }

        // Final length check
        if (formatted.length > 10) formatted = formatted.slice(0, 10);

        setBirthdate(formatted);
    };

    // New Flow: After Splash -> Ask for Bio/PIN -> Then Redirect
    const askForBiometricsOrPin = () => {
        Alert.alert(
            'Raskere innlogging?',
            'Vil du aktivere FaceID / TouchID eller PIN for neste gang?',
            [
                {
                    text: 'Nei, takk',
                    style: 'cancel',
                    onPress: () => router.replace('/(tabs)')
                },
                {
                    text: 'Ja, gjerne',
                    onPress: async () => {
                        const success = await enableBiometrics();
                        if (success) {
                            Alert.alert("Suksess", "Biometri aktivert!", [
                                { text: "OK", onPress: () => router.replace('/(tabs)') }
                            ]);
                        } else {
                            askForPin();
                        }
                    }
                }
            ]
        );
    };

    const askForPin = () => {
        if (Platform.OS === 'web') {
            router.replace('/(tabs)'); // Skip PIN on web for MVP
            return;
        }
        Alert.prompt("Velg PIN-kode", "4 siffer", [
            { text: "Hopp over", style: "cancel", onPress: () => router.replace('/(tabs)') },
            {
                text: "Lagre", onPress: (pin) => {
                    if (pin && pin.length === 4) {
                        setPin(pin);
                        router.replace('/(tabs)');
                    } else {
                        Alert.alert("Ugyldig", "Må være 4 siffer", [{ text: "OK", onPress: () => askForPin() }]);
                    }
                }
            }
        ], "secure-text");
    };


    // --- RENDER HELPERS ---

    const renderPhoneStep = () => (
        <View style={styles.contentParams}>
            <LoginInput
                label="Mobilnummer"
                placeholder="400 00 000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
            />
            <Button
                title={loading ? "Laster..." : "Gå videre"}
                onPress={handlePhoneSubmit}
                disabled={loading}
                style={styles.whiteButton}
                textStyle={styles.whiteButtonText}
            />
        </View>
    );

    const renderOtpStep = () => (
        <View style={styles.contentParams}>
            <Body style={styles.infoText}>Vi har sendt en kode til {phone}</Body>
            <LoginInput
                label="Engangskode"
                placeholder="****"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="numeric"
                autoFocus
            />
            <Button
                title={loading ? "Verifiserer..." : "Logg inn"}
                onPress={handleOtpSubmit}
                disabled={loading}
                style={styles.whiteButton}
                textStyle={styles.whiteButtonText}
            />
            <TouchableOpacity onPress={() => setStep('PHONE')} style={{ marginTop: 20 }}>
                <Body style={styles.linkText}>Endre nummer</Body>
            </TouchableOpacity>
        </View>
    );

    const renderRegisterStep = () => (
        <View style={styles.contentParams}>
            <Body style={styles.infoText}>Ny bruker</Body>
            <LoginInput label="Navn" value={name} onChangeText={setName} placeholder="Navn Navnesen" />
            <LoginInput label="E-post" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="navn@epost.no" />
            <LoginInput
                label="Fødselsdato"
                value={birthdate}
                onChangeText={handleDateChange}
                placeholder="dd.mm.åååå"
                keyboardType="numeric"
                maxLength={10}
            />
            <Button
                title="Fullfør registrering"
                onPress={handleRegister}
                disabled={loading}
                style={styles.whiteButton}
                textStyle={styles.whiteButtonText}
            />
            <TouchableOpacity onPress={() => setStep('PHONE')} style={{ marginTop: 20 }}>
                <Body style={styles.linkText}>Avbryt</Body>
            </TouchableOpacity>
        </View>
    );

    const renderSuccessSplash = () => (
        <View style={styles.splashContainer}>
            <Image
                source={require('@/assets/images/tm-logo.png')}
                style={[styles.logo, { transform: [{ scale: 1.2 }] }]}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
            <H2 style={{ color: 'white', marginTop: 20, opacity: 0.9 }}>Logger inn...</H2>
        </View>
    );

    if (step === 'SUCCESS_SPLASH') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                {renderSuccessSplash()}
            </View>
        );
    }

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
                        <Body style={styles.tagline}>- Hud, laser og legetjenester</Body>
                    </View>

                    <View style={styles.formContainer}>
                        {step === 'PHONE' && renderPhoneStep()}
                        {step === 'OTP' && renderOtpStep()}
                        {step === 'REGISTER' && renderRegisterStep()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.deep, // Red background
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
        width: '100%'
    },
    logo: {
        width: 260, // Match Welcome Screen
        height: 60,
        marginBottom: Spacing.s,
        tintColor: Colors.neutral.white // Restored matching tint
    },
    tagline: {
        color: Colors.neutral.white,
        marginBottom: Spacing.xl,
        opacity: 0.9,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400
    },
    contentParams: {
        width: '100%'
    },
    whiteButton: {
        backgroundColor: 'white',
        borderRadius: 30,
        height: 55,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5
    },
    whiteButtonText: {
        color: Colors.primary.deep,
        fontWeight: 'bold',
        fontSize: 16
    },
    infoText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.8
    },
    linkText: {
        color: 'white',
        textAlign: 'center',
        textDecorationLine: 'underline',
        opacity: 0.7
    },
    splashContainer: {
        alignItems: 'center',
    }
});
