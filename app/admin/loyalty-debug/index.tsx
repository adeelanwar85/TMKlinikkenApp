import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { H2, H3, Body, Caption } from '@/src/theme/Typography';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HanoService, { Appointment } from '@/src/services/HanoService';
import { LoyaltyService } from '@/src/services/LoyaltyService';
import { useAuth } from '@/src/context/AuthContext';

export default function LoyaltyDebugScreen() {
    const router = useRouter();
    const { user } = useAuth();

    // State for local Firebase User
    const [firebaseUserId, setFirebaseUserId] = useState<string | null>(null);

    // Default to known ID for quicker testing if available, or empty
    const [targetId, setTargetId] = useState('642');
    const [bookingIdInput, setBookingIdInput] = useState('');
    const [mobileInput, setMobileInput] = useState(''); // New state for mobile search
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // Result Data
    const [bonusBalance, setBonusBalance] = useState<number | null>(null);
    const [history, setHistory] = useState<Appointment[]>([]);
    const [rawProfile, setRawProfile] = useState<any>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const fetchProfileById = async (id: number) => {
        addLog(`Fetching Profile for ID: ${id}...`);
        try {
            const points = await HanoService.getBonusPointsBalance(id);
            setBonusBalance(points);
            addLog(`Bonus Balance Fetched: ${points}`);
        } catch (e) {
            addLog(`Error fetching profile: ${e}`);
        }
    };

    const handleSearchByMobile = async () => {
        if (!mobileInput) {
            Alert.alert("Mangler mobilnummer", "Skriv inn et mobilnummer først");
            return;
        }
        setLoading(true);
        addLog(`Searching for Customer by Mobile: ${mobileInput}...`);
        try {
            const hanoId = await HanoService.findCustomerId(mobileInput);
            if (hanoId) {
                setTargetId(hanoId.toString());
                addLog(`✅ Found Hano ID: ${hanoId}`);

                // Now try to find the linked Firebase User (Local App User)
                // We assume the user has logged in and synced their Hano ID, or at least has the same phone number in profile
                // This requires a query on the users collection. 
                // Since this is admin code, we might not have a direct method exposed in AuthService to "search user by phone".
                // We will implement a quick helper here or just alert the user if we can't find the local account.
                // NOTE: For now, we only support manual overrides on users who have actually logged into the app.

                // Hack: We don't have a "GetUserByPhone" global function. 
                // We will ask the admin to enter the exact User ID (Email or Auth ID) if finding by phone is hard, 
                // OR we just rely on the fact that we can't easily find the Firebase Doc ID without a cloud function or open read access.
                // Let's TRY to just use the mobile number as a loose search if we stored it?
                // Actually, our User Docs are often named by UID.

                addLog("ℹ️ Manual overrides require the user to have an app account.");
                addLog("ℹ️ Ask user for their 'User ID' from Profile > Debug if needed, or implement search.");

            } else {
                addLog("❌ Customer NOT Found in Hano");
                Alert.alert("Ikke funnet", "Fant ingen kunde med dette nummeret via Hano API.");
            }
        } catch (e) {
            addLog(`Error finding customer: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchProfile = () => {
        if (targetId) fetchProfileById(Number(targetId));
    };

    // New: Resolve Firebase User
    // For this MVP, we will allow the admin to manually paste a User ID (from users' profile) 
    // OR we could create a lookup if we had a "phone" field index.
    const [manualUserId, setManualUserId] = useState('');

    const handleAddStamp = async () => {
        if (!manualUserId.trim()) {
            Alert.alert("Mangler User ID", "Du må skrive inn App User ID for å gi stempler manuelt.");
            return;
        }
        setLoading(true);
        try {
            const res = await LoyaltyService.awardManualStamp(manualUserId);
            if (res.success) {
                Alert.alert("Suksess", `Stempel gitt! Totalt nå: ${res.newStamps}`);
                addLog(`✅ Awarded 1 Stamp to ${manualUserId}. New Balance: ${res.newStamps}`);
            }
        } catch (e) {
            Alert.alert("Feil", "Kunne ikke gi stempel. Sjekk ID.");
            addLog(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPoints = async () => {
        if (!manualUserId.trim()) {
            Alert.alert("Mangler User ID", "Du må skrive inn App User ID.");
            return;
        }
        setLoading(true);
        try {
            const res = await LoyaltyService.awardManualPoints(manualUserId, 100);
            if (res.success) {
                Alert.alert("Suksess", `100 Poeng gitt! Totalt nå: ${res.newPoints}`);
                addLog(`✅ Awarded 100 Points to ${manualUserId}. New Balance: ${res.newPoints}`);
            }
        } catch (e) {
            Alert.alert("Feil", "Kunne ikke gi poeng.");
            addLog(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    // ... existing wrapper functions ... 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.neutral.charcoal} />
                </TouchableOpacity>
                <H2>Loyalty Debug Panel</H2>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* SEARCH USER */}
                <View style={styles.card}>
                    <H3 style={styles.cardTitle}>1. Find Hano Customer</H3>
                    <Caption>Search by Mobile to find Hano ID</Caption>
                    <TextInput
                        style={styles.input}
                        value={mobileInput}
                        onChangeText={setMobileInput}
                        keyboardType="phone-pad"
                        placeholder="Mobile Number (e.g. 98697419)"
                    />
                    <ButtonSmall title="Search Hano" onPress={handleSearchByMobile} />
                </View>

                {/* MANUAL ACTIONS */}
                <View style={[styles.card, { borderColor: Colors.primary.deep, borderWidth: 1 }]}>
                    <H3 style={styles.cardTitle}>2. Manual Override (App Cloud)</H3>
                    <Caption>Paste App User ID to manually award items.</Caption>
                    <TextInput
                        style={styles.input}
                        value={manualUserId}
                        onChangeText={setManualUserId}
                        placeholder="App User ID (fra brukers profil)"
                        autoCapitalize='none'
                    />
                    <View style={styles.row}>
                        <ButtonSmall title="+ Give 1 Stamp" onPress={handleAddStamp} />
                        <ButtonSmall title="+ Give 100 Points" onPress={handleAddPoints} />
                    </View>
                </View>

                {/* PROBE ID */}
                <View style={styles.card}>
                    <H3 style={styles.cardTitle}>3. Hano Deep Probe</H3>
                    <Caption>Enter Hano Customer ID (e.g. 642)</Caption>
                    <TextInput
                        style={styles.input}
                        value={targetId}
                        onChangeText={setTargetId}
                        keyboardType="numeric"
                        placeholder="Customer ID"
                    />

                    <View style={styles.row}>
                        <ButtonSmall title="Check Points (Hano)" onPress={handleFetchProfile} />
                        {/* <ButtonSmall title="Check Appointments" onPress={handleFetchHistory} /> */}
                    </View>
                </View>

                {/* TRANSACTION VERIFICATION */
                /* Keeping as is... */}
                {/* 
                <View style={styles.card}>
                    <H3 style={styles.cardTitle}>Transaction Verification</H3>
                    <Caption>Check if a specific Hano Appointment is 'PAID'</Caption>
                    <TextInput
                        style={styles.input}
                        value={bookingIdInput}
                        onChangeText={setBookingIdInput}
                        keyboardType="numeric"
                        placeholder="Booking ID (f.eks 10523)"
                    />
                    <View style={styles.row}>
                        <ButtonSmall title="Check Booking by ID" onPress={handleCheckPaidStatus} />
                    </View>
                </View>
                */}

                {/* Console Log Output */}
                <View style={styles.logContainer}>
                    <H3 style={[styles.cardTitle, { color: 'white' }]}>Live Logs</H3>
                    <ScrollView style={styles.logScroll}>
                        {logs.length === 0 && <Caption style={{ color: '#888' }}>Waiting for action...</Caption>}
                        {logs.map((L, i) => (
                            <Body key={i} style={styles.logText}>{L}</Body>
                        ))}
                    </ScrollView>
                </View>

                {/* Result Display */}
                {bonusBalance !== null && (
                    <View style={[styles.card, { borderColor: Colors.primary.main, borderWidth: 1 }]}>
                        <H2 style={{ color: Colors.primary.main }}>Hano Poeng: {bonusBalance}</H2>
                    </View>
                )}

            </ScrollView>

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                </View>
            )}
        </SafeAreaView>
    );
}

const ButtonSmall = ({ title, onPress }: any) => (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Body style={styles.btnText}>{title}</Body>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.m },
    backButton: { marginRight: Spacing.m },
    content: { padding: Spacing.m },
    card: { backgroundColor: 'white', padding: Spacing.m, borderRadius: 12, marginBottom: Spacing.m, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardTitle: { marginBottom: Spacing.s },
    input: { backgroundColor: '#EEE', padding: 12, borderRadius: 8, fontSize: 16, marginVertical: 10 },
    row: { flexDirection: 'row', gap: 10, marginTop: 5 },
    btn: { backgroundColor: Colors.primary.deep, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
    logContainer: { backgroundColor: '#1E1E1E', padding: Spacing.m, borderRadius: 12, height: 300 },
    logScroll: { flex: 1 },
    logText: { color: '#00FF00', fontFamily: 'Courier', fontSize: 12, marginBottom: 4 },
    loader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' }
});
