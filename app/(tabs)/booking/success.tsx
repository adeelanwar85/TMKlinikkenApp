import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H1, Body } from '@/src/theme/Typography';
import { useBooking } from '@/src/context/BookingContext';
import { CalendarService } from '@/src/services/CalendarService';

export default function SuccessScreen() {
    const router = useRouter();
    const { selectedTreatment, selectedTimeSlot } = useBooking();

    // If navigated here without state (refresh), redirect out
    useEffect(() => {
        if (!selectedTreatment || !selectedTimeSlot) {
            router.replace('/(tabs)/appointments');
        }
    }, []);

    if (!selectedTreatment || !selectedTimeSlot) return null;

    const handleAddToCalendar = async () => {
        if (!selectedTimeSlot || !selectedTreatment) return;

        const date = new Date(selectedTimeSlot.Start);
        // Parse duration (e.g., "30 min")
        const durationMatch = selectedTreatment.Duration.match(/(\d+)/);
        const duration = durationMatch ? parseInt(durationMatch[0]) : 30;

        if (Platform.OS === 'web') {
            const endTime = new Date(date.getTime() + duration * 60000);
            const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                `DTSTART:${formatDate(date)}`,
                `DTEND:${formatDate(endTime)}`,
                `SUMMARY:${selectedTreatment.Name} @ TM Klinikken`,
                'DESCRIPTION:Husk å møte opp 5 minutter før.',
                'LOCATION:TM Klinikken, Fredrikstad',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'time_tmklinikken.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        await CalendarService.addAppointmentToCalendar(date, selectedTreatment.Name, duration);
    };

    const handleDone = () => {
        if (router.canDismiss()) {
            router.dismissAll();
        }
        router.replace('/(tabs)/appointments');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Logo */}
                <Image
                    source={require('@/assets/images/tm-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.iconContainer}>
                    <LinearGradient
                        colors={[Colors.primary.main, Colors.primary.dark]}
                        style={styles.checkCircle}
                    >
                        <Ionicons name="checkmark" size={64} color="white" />
                    </LinearGradient>
                </View>

                <H1 style={styles.title}>Bestilling Bekreftet!</H1>
                <Body style={styles.message}>
                    Tusen takk for din bestilling.{'\n'}
                    Vi har sendt en bekreftelse på e-post.
                </Body>

                <View style={styles.card}>
                    <Text style={styles.treatmentName}>{selectedTreatment.Name}</Text>
                    <Text style={styles.timeInfo}>
                        {new Date(selectedTimeSlot.Start).toLocaleDateString('no-NO', {
                            weekday: 'long', day: 'numeric', month: 'long'
                        })}
                        {'\n'}
                        kl. {new Date(selectedTimeSlot.Start).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>

                <TouchableOpacity style={styles.calendarButton} onPress={handleAddToCalendar}>
                    <Ionicons name="calendar-outline" size={24} color={Colors.primary.main} />
                    <Text style={styles.calendarButtonText}>Legg til i kalender</Text>
                </TouchableOpacity>
            </View>

            <SafeAreaView style={styles.footer}>
                <TouchableOpacity onPress={handleDone}>
                    <LinearGradient
                        colors={[Colors.primary.main, Colors.primary.dark]}
                        style={styles.doneButton}
                    >
                        <Text style={styles.doneButtonText}>FERDIG</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    iconContainer: {
        marginBottom: Spacing.xl,
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderRadius: 50, // Fix for square shadow artifact
        backgroundColor: 'transparent',
    },
    logo: {
        width: 150,
        height: 60,
        marginBottom: Spacing.l,
    },
    checkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: Colors.primary.dark,
        marginBottom: Spacing.m,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        color: Colors.neutral.darkGray,
        marginBottom: Spacing.xl,
        lineHeight: 24,
    },
    card: {
        backgroundColor: 'white',
        padding: Spacing.l,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    treatmentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.neutral.darkGray,
        marginBottom: 8,
        textAlign: 'center',
    },
    timeInfo: {
        fontSize: 16,
        color: Colors.primary.main,
        textAlign: 'center',
        lineHeight: 24,
    },
    calendarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.primary.main,
    },
    calendarButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: Colors.primary.main,
        fontWeight: '600',
    },
    footer: {
        padding: Spacing.l,
    },
    doneButton: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
