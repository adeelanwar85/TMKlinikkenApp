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

    const handleFetchProfileWrapper = (id: number) => {
        // Wrapper to allow calling with specific ID
        const tempId = targetId;
        // We set state, but it might not update immediately for this run, so we passthrough if needed
        // For simplicity, just let the user click "Check" or re-use existing logic
        // But let's trigger handleFetchProfile logic:
        fetchProfileById(id);
    };

    const handleSearchByMobile = async () => {
        if (!mobileInput) {
            Alert.alert("Mangler mobilnummer", "Skriv inn et mobilnummer først");
            return;
        }
        setLoading(true);
        addLog(`Searching for Customer by Mobile: ${mobileInput}...`);
        try {
            const id = await HanoService.findCustomerId(mobileInput);
            if (id) {
                setTargetId(id.toString());
                addLog(`✅ Found Customer ID: ${id}`);
                // Optional: Auto-fetch profile
                handleFetchProfileWrapper(id);
            } else {
                addLog("❌ Customer NOT Found");
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

    const handleFetchHistory = async () => {
        if (!targetId) return;
        setLoading(true);
        setHistory([]);
        addLog(`Fetching Appointment History (Testing Fix)...`);
        try {
            // Updated to use the FIXED getCustomerAppointments method
            // We need a dummy phone number if we only have ID?
            // HanoService.getCustomerAppointments takes a PHONE NUMBER.
            // But we have ID.
            // Wait, getCustomerAppointments asks for Phone, resolves ID, then gets history.
            // If we already have ID, we technically can't use getCustomerAppointments efficiently without providing phone again.
            // But for Debug Panel, we usually searched by Mobile FIRST.
            // If the user manually entered ID, we can't easily get Phone back unless we read profile (which we can't easily do publicly).

            // Workaround: If we have mobileInput, use it. If not, ask user?
            // Or verifying the FIX specifically requires providing a phone.

            if (mobileInput) {
                const apps = await HanoService.getCustomerAppointments(mobileInput);
                addLog(`Fetched ${apps.length} Appointments.`);
                setHistory(apps);
                if (apps.length > 0) {
                    addLog(`Most recent: ${apps[0].Start} - ${apps[0].Service} (${apps[0].Paid ? 'Paid' : 'Unpaid'})`);
                }
            } else {
                addLog("⚠️ 'Get Appointments' requires Mobile Number (service logic). searching products instead...");
                const products = await HanoService.getCustomerProductHistory(Number(targetId));
                addLog(`Fetched ${products?.length || 0} Products.`);
                setRawProfile({ products });
            }

        } catch (e) {
            addLog(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckPaidStatus = async () => {
        if (!bookingIdInput) {
            Alert.alert("Mangler ID", "Skriv inn en Booking ID først");
            return;
        }

        setLoading(true);
        addLog(`Probing Booking ID: ${bookingIdInput} ...`);
        try {
            const booking = await HanoService.getAppointment(bookingIdInput);
            if (booking) {
                addLog(`FOUND! Service: ${booking.Service}`);
                addLog(`Status: ${booking.Status}`);
                addLog(`PAID: ${booking.Paid ? 'YES ✅' : 'NO ❌'}`);
                addLog(`Raw: ${JSON.stringify(booking)}`);
            } else {
                addLog("Booking not found or access denied.");
            }
        } catch (e) {
            addLog(`Error: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStamp = async () => {
        if (!user || !user.email) {
            Alert.alert("Du må være logget inn i appen først.");
            return;
        }
        addLog("Adding 1 Stamp (Local Test)...");
        Alert.alert("Info", "For å teste stempler, fullfør en booking-simulering eller rediger i Firebase.");
    };

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
                    <H3 style={styles.cardTitle}>Find Customer</H3>
                    <Caption>Search by Mobile (Hano)</Caption>
                    <TextInput
                        style={styles.input}
                        value={mobileInput}
                        onChangeText={setMobileInput}
                        keyboardType="phone-pad"
                        placeholder="Mobile Number (e.g. 98697419)"
                    />
                    <ButtonSmall title="Search & Fill ID" onPress={handleSearchByMobile} />
                </View>

                {/* PROBE ID */}
                <View style={styles.card}>
                    <H3 style={styles.cardTitle}>Hano Customer Probe</H3>
                    <Caption>Enter Hano Customer ID (e.g. 642)</Caption>
                    <TextInput
                        style={styles.input}
                        value={targetId}
                        onChangeText={setTargetId}
                        keyboardType="numeric"
                        placeholder="Customer ID"
                    />

                    <View style={styles.row}>
                        <ButtonSmall title="Check Points" onPress={handleFetchProfile} />
                        <ButtonSmall title="Check Appointments" onPress={handleFetchHistory} />
                    </View>
                </View>

                {/* TRANSACTION VERIFICATION */
                /* Keeping as is... */}
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
