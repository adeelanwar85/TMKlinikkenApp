import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, Body, H3 } from '@/src/theme/Typography';
import { ContentService } from '@/src/services/ContentService';

export default function SeedScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleBack = () => router.back();

    const handleTestConnection = async () => {
        setLoading(true);
        setStatus('Tester tilkobling...');
        try {
            // Try to write a dummy doc
            const { doc, setDoc, deleteDoc } = require('firebase/firestore');
            const { db } = require('@/src/services/firebaseConfig');

            // Timeout promise
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000));

            const testOp = async () => {
                await setDoc(doc(db, 'test_connection', 'test'), { status: 'ok', time: Date.now() });
                await deleteDoc(doc(db, 'test_connection', 'test'));
                return true;
            };

            await Promise.race([testOp(), timeout]);
            setStatus('Tilkobling OK! ✅ Databasen svarer.');
            Alert.alert("Suksess", "Tilkobling til Firestore fungerer!");
        } catch (error) {
            console.error(error);
            setStatus('Feil: Oppnådde ikke kontakt med databasen (Timeout/Error).');
            Alert.alert("Feil", "Kunne ikke skrive til databasen. Sjekk at Firestore er opprettet i Firebase Console og reglene tillater skriving.");
        } finally {
            setLoading(false);
        }
    };

    const executeSeed = async () => {
        setLoading(true);
        setStatus('Starter opplasting...');
        try {
            // Race between seed and 15s timeout
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Tidsavbrudd (15s)")), 15000));
            await Promise.race([ContentService.seedAllData(), timeout]);

            setStatus('Suksess! Data er lastet opp. ✅');
            Alert.alert("Suksess", "Databasen er nå oppdatert med standardinnholdet.");
        } catch (error: any) {
            console.error(error);
            setStatus(`Feil: ${error.message || 'Ukjent feil'}`);
            Alert.alert("Feil", `Noe gikk galt: ${error.message}. Sjekk om Firestore Database er opprettet i Firebase-konsollen.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = () => {
        if (Platform.OS === 'web') {
            const pin = window.prompt("SIKKERHETSSJEKK: Skriv PIN (1234) for å overskrive databasen.");
            if (pin === "1234") {
                executeSeed();
            } else if (pin !== null) {
                alert("Feil PIN.");
            }
        } else if (Platform.OS === 'ios') {
            Alert.prompt(
                "Sikkerhetssjekk",
                "Skriv inn PIN (1234) for å overskrive databasen.",
                [
                    { text: "Avbryt", style: "cancel" },
                    {
                        text: "Bekreft",
                        onPress: (pin: string | undefined) => {
                            if (pin === "1234") executeSeed();
                            else Alert.alert("Feil PIN");
                        }
                    }
                ],
                "secure-text"
            );
        } else {
            // Android fallback
            Alert.alert(
                "Bekreftelse",
                "Er du sikker på at du vil overskrive databasen?",
                [
                    { text: "Avbryt", style: "cancel" },
                    { text: "Ja, overskriv", onPress: () => executeSeed() }
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Database Verktøy</H2>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <View style={styles.content}>
                <View style={styles.warningBox}>
                    <Ionicons name="warning-outline" size={32} color="#E65100" />
                    <Body style={styles.warningText}>
                        Dette vil overskrive data i Firebase med innholdet fra filene.
                    </Body>
                </View>

                {/* Connection Test Button */}
                <TouchableOpacity
                    style={[styles.seedButton, { backgroundColor: '#455A64', marginBottom: 20 }, loading && { opacity: 0.7 }]}
                    onPress={handleTestConnection}
                    disabled={loading}
                >
                    <H3 style={styles.buttonText}>Test Tilkobling</H3>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.seedButton, loading && { opacity: 0.7 }]}
                    onPress={handleSeed}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <H3 style={styles.buttonText}>Last opp standardinnhold (Seed)</H3>
                    )}
                </TouchableOpacity>

                {status !== '' && (
                    <Body style={styles.statusText}>{status}</Body>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    safeArea: {
        backgroundColor: Colors.background.main,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -Spacing.s,
    },
    pageTitle: {
        fontSize: 20,
        color: Colors.primary.deep,
    },
    content: {
        padding: Spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    warningBox: {
        backgroundColor: '#FFF3E0',
        padding: Spacing.l,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    warningText: {
        textAlign: 'center',
        marginTop: Spacing.m,
        color: '#E65100',
    },
    seedButton: {
        backgroundColor: Colors.primary.deep,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    statusText: {
        marginTop: Spacing.l,
        color: Colors.neutral.darkGray,
        fontWeight: 'bold',
    },
});
