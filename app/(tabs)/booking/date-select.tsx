import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useBooking } from '@/src/context/BookingContext';
import { HanoService } from '@/src/services/HanoService';
import { AvailableSlot } from '@/src/types/HanoTypes';
import { Colors, Spacing, Typography, Shadows } from '@/src/theme/Theme';
import { H1, H2, Body, Caption } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Setup Norwegian locale
LocaleConfig.locales['no'] = {
    monthNames: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
    dayNames: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
    dayNamesShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
    today: 'I dag'
};
LocaleConfig.defaultLocale = 'no';

export default function SelectDateScreen() {
    const router = useRouter();
    const { selectedTreatment, setDate, setTimeSlot } = useBooking();
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState<AvailableSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If no treatment selected, go back
    useEffect(() => {
        if (!selectedTreatment) {
            router.back();
        }
    }, [selectedTreatment]);

    const handleDateSelect = async (day: any) => {
        setSelectedDate(day.dateString);
        setDate(day.dateString);
        loadSlots(day.dateString);
    };

    const loadSlots = async (dateStr: string) => {
        if (!selectedTreatment) return;

        try {
            setLoadingSlots(true);
            setError(null);
            setSlots([]);

            const data = await HanoService.getAvailableSlots(selectedTreatment.Id, dateStr);
            setSlots(data);

        } catch (err) {
            console.error(err);
            setError('Kunne ikke laste ledige timer.');
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSlotSelect = (slot: AvailableSlot) => {
        setTimeSlot(slot);
        router.push('/booking/summary');
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('no-NO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const renderHeader = () => (
        <LinearGradient
            colors={[Colors.primary.dark, Colors.primary.main]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.headerBackground}
        >
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={router.back} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Tidspunkt</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.headerHero}>
                    <Text style={styles.heroTitle}>Velg Tid</Text>
                    {selectedTreatment && (
                        <Text style={styles.heroSubtitle}>{selectedTreatment.Name}</Text>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}

            <View style={styles.contentContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={handleDateSelect}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: Colors.primary.main }
                            }}
                            theme={{
                                backgroundColor: 'transparent',
                                calendarBackground: 'transparent',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: Colors.primary.main,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: Colors.primary.main,
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: Colors.primary.main,
                                selectedDotColor: '#ffffff',
                                arrowColor: Colors.primary.main,
                                monthTextColor: Colors.neutral.darkGray,
                                textDayFontFamily: Platform.select({ web: 'sans-serif', default: 'System' }),
                                textMonthFontFamily: Platform.select({ web: 'sans-serif', default: 'System' }),
                                textDayHeaderFontFamily: Platform.select({ web: 'sans-serif', default: 'System' }),
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '500',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 13
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                        />
                    </View>

                    {selectedDate && (
                        <View style={styles.slotsWrapper}>
                            <H2 style={styles.sectionHeader}>Ledige timer {new Date(selectedDate).toLocaleDateString('no-NO', { day: 'numeric', month: 'long' })}</H2>

                            {loadingSlots ? (
                                <ActivityIndicator size="small" color={Colors.primary.main} style={{ marginTop: 20 }} />
                            ) : error ? (
                                <Body style={styles.errorText}>{error}</Body>
                            ) : slots.length === 0 ? (
                                <Body style={styles.emptyText}>Ingen ledige timer denne dagen.</Body>
                            ) : (
                                <View style={styles.grid}>
                                    {slots.map((slot, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.slotButton}
                                            onPress={() => handleSlotSelect(slot)}
                                            activeOpacity={0.7}
                                        >
                                            <Body style={styles.slotTime}>{formatTime(slot.Start)}</Body>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    headerBackground: {
        height: 220,
        paddingHorizontal: Spacing.m,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerSafeArea: {
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.9,
    },
    headerHero: {
        marginTop: Spacing.l,
        paddingHorizontal: Spacing.s,
    },
    heroTitle: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    contentContainer: {
        flex: 1,
        marginTop: -50,
        paddingHorizontal: Spacing.m,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: Spacing.m,
        marginBottom: Spacing.l,
        ...Shadows.card,
        elevation: 5,
    },
    slotsWrapper: {
        paddingLeft: Spacing.s,
    },
    sectionHeader: {
        fontSize: 18,
        color: Colors.neutral.darkGray,
        marginBottom: Spacing.m,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.s,
    },
    slotButton: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        minWidth: '28%',
        alignItems: 'center',
        ...Shadows.card,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    slotTime: {
        color: Colors.neutral.darkGray,
        fontWeight: '600',
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#888',
        marginTop: Spacing.s,
    },
    errorText: {
        color: Colors.status.error,
        marginTop: Spacing.s,
    }
});
