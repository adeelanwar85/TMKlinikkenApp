import { Button } from '@/src/components/Button';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H3 } from '@/src/theme/Typography';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getUserAppointments, cancelAppointment, Appointment } from '@/src/api/hanoClient';

export default function AppointmentsScreen() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const data = await getUserAppointments();
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadAppointments();
        }, [])
    );

    const handleReschedule = (id: number) => {
        Alert.alert(
            'Flytte time?',
            'Du vil bli sendt til booking for å finne en ny tid. Den gamle timen slettes først når du bekrefter den nye.',
            [
                { text: 'Avbryt', style: 'cancel' },
                {
                    text: 'Finn ny tid',
                    onPress: () => {
                        // For MVP: Redirect to booking start. 
                        router.push('/booking');
                    }
                }
            ]
        );
    };

    const handleCancel = (id: number) => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm('Er du sikker på at du vil avbestille denne timen?');
            if (confirm) {
                performCancel(id);
            }
        } else {
            Alert.alert(
                'Avbestille time?',
                'Er du sikker på at du vil avbestille denne timen? Dette kan ikke angres.',
                [
                    { text: 'Behold time', style: 'cancel' },
                    {
                        text: 'Avbestill',
                        style: 'destructive',
                        onPress: () => performCancel(id)
                    }
                ]
            );
        }
    };

    const performCancel = async (id: number) => {
        setLoading(true);
        const success = await cancelAppointment(id);
        if (success) {
            // On web, alert might block render updates, wait a tick
            setTimeout(() => {
                if (Platform.OS !== 'web') {
                    Alert.alert('Time avbestilt', 'Timen din er nå kansellert.');
                }
                loadAppointments();
            }, 100);
        } else {
            if (Platform.OS !== 'web') {
                Alert.alert('Feil', 'Kunne ikke avbestille timen.');
            } else {
                alert('Kunne ikke avbestille timen.');
            }
        }
        setLoading(false);
    };

    const renderItem = ({ item }: { item: Appointment }) => {
        const date = new Date(item.Start).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
        const time = new Date(item.Start).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.dateBox}>
                        <Body style={styles.dateText}>{date}</Body>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Bekreftet</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <H3 style={styles.serviceName}>{item.Service}</H3>
                    <View style={styles.row}>
                        <Ionicons name="time-outline" size={16} color={Colors.neutral.darkGray} />
                        <Body style={styles.timeText}>Kl. {time}</Body>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="location-outline" size={16} color={Colors.neutral.darkGray} />
                        <Body style={styles.timeText}>TM Klinikken</Body>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.rescheduleButton} onPress={() => handleReschedule(item.Id)}>
                        <Text style={styles.rescheduleText}>Flytt time</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.Id)}>
                        <Text style={styles.cancelText}>Avbestill</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <H1 style={styles.headerTitle}>Mine timer</H1>
            </View>

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    header: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.s,
        backgroundColor: Colors.background.main,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    headerTitle: {
        color: Colors.primary.deep,
    },
    content: {
        flex: 1,
    },
    listContent: {
        padding: Spacing.m,
        gap: Spacing.m,
    },
    card: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 12,
        padding: Spacing.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.s,
    },
    dateBox: {
        backgroundColor: '#F5F5F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    dateText: {
        fontSize: 12,
        color: Colors.neutral.charcoal,
        fontWeight: '600',
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        color: '#2E7D32',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    cardBody: {
        marginBottom: Spacing.m,
    },
    serviceName: {
        fontSize: 18,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    timeText: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.s,
        marginTop: Spacing.s,
    },
    rescheduleButton: {
        flex: 1,
        backgroundColor: Colors.primary.deep,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    rescheduleText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: '#D32F2F',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyTitle: {
        fontSize: 20,
        color: Colors.neutral.charcoal,
        marginBottom: Spacing.s,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.neutral.darkGray,
        textAlign: 'center',
        maxWidth: 250,
    },
});
