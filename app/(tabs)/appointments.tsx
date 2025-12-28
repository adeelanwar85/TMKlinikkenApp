import { Button } from '@/src/components/Button';
import { GradientHeader } from '@/src/components/GradientHeader';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for appointments
const MOCK_APPOINTMENTS = [
    {
        Id: 1,
        Date: '2023-11-15T10:00:00',
        TreatmentName: 'Rynkebehandling 3 områder',
        Price: 3500,
        Status: 'Bekreftet',
        Duration: '30 min'
    },
    {
        Id: 2,
        Date: '2023-12-01T14:30:00',
        TreatmentName: 'Dermapen Full Ansikt',
        Price: 2200,
        Status: 'Bekreftet',
        Duration: '45 min'
    }
];

export default function AppointmentsScreen() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        // Simonsulate API call
        setTimeout(() => {
            setAppointments(MOCK_APPOINTMENTS);
            setLoading(false);
            setRefreshing(false);
        }, 1000);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.appointmentCard}>
            <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.neutral.charcoal} />
                    <Body style={styles.dateText}>
                        {new Date(item.Date).toLocaleDateString('no-NO', { day: 'numeric', month: 'long' })}
                    </Body>
                    <View style={styles.timeBadge}>
                        <Body style={styles.timeText}>
                            {new Date(item.Date).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                        </Body>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                    <Body style={[styles.statusText, { color: '#2E7D32' }]}>{item.Status}</Body>
                </View>
            </View>

            <View style={styles.treatmentInfo}>
                <H3 style={styles.treatmentName}>{item.TreatmentName}</H3>
                <View style={styles.priceRow}>
                    <Ionicons name="card-outline" size={14} color={Colors.neutral.darkGray} />
                    <Body style={styles.priceText}>{item.Price},-</Body>
                    <Body style={[styles.priceText, { marginLeft: 10 }]}>• {item.Duration}</Body>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelButton}>
                    <Ionicons name="close-circle-outline" size={16} color="#D32F2F" />
                    <Body style={styles.cancelText}>Avbestill</Body>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton}>
                    <Ionicons name="calendar" size={16} color="white" />
                    <Body style={styles.rescheduleText}>Endre time</Body>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <H1 style={styles.pageTitle}>Mine Timer</H1>
            </SafeAreaView>

            <View style={styles.content}>

                {appointments.length > 0 ? (
                    <FlatList
                        data={appointments}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.Id.toString()}
                        contentContainerStyle={styles.listContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAppointments(); }} />}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Image
                            source={require('@/assets/images/tm-logo.png')}
                            style={{ width: 150, height: 40, opacity: 0.5, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                        <H1 style={styles.emptyTitle}>Ingen fremtidige timer</H1>
                        <Body style={styles.emptyText}>Du har ingen bekreftede timer akkurat nå.</Body>
                        <View style={{ height: 30 }} />
                        <Button title="Bestill Ny Time" onPress={() => router.push('/booking')} />
                    </View>
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
    // Main content area
    content: {
        flex: 1,
    },
    // List content styles
    listContent: {
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: Spacing.m,
    },
    // Appointment Item Styles
    appointmentCard: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        marginBottom: Spacing.m,
        padding: Spacing.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary.main,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.m,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F0',
        paddingHorizontal: Spacing.s,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 12,
        color: Colors.neutral.charcoal,
        fontWeight: '600',
        marginLeft: 4,
    },
    timeBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: Spacing.s,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: Spacing.s,
    },
    timeText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: Spacing.s,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    treatmentInfo: {
        marginBottom: Spacing.m,
    },
    treatmentName: {
        fontSize: 18,
        color: Colors.primary.deep,
        fontWeight: '600',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        marginLeft: 4,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: Spacing.s,
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.s,
    },
    cancelText: {
        color: '#D32F2F',
        marginLeft: Spacing.s,
        fontSize: 14,
        fontWeight: '500',
    },
    rescheduleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.s,
        backgroundColor: Colors.primary.main,
        borderRadius: 8,
        marginLeft: Spacing.m,
    },
    rescheduleText: {
        color: 'white',
        marginLeft: Spacing.s,
        fontSize: 14,
        fontWeight: '500',
    },
    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: 20,
        color: Colors.neutral.charcoal,
        marginTop: Spacing.l,
        marginBottom: Spacing.s,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.neutral.darkGray,
        textAlign: 'center',
        maxWidth: 250,
    },
    header: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary.deep,
    },
    // logoContainer: removed
    // logoCard: removed
    // logo: removed
});
