
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '@/src/context/BookingContext';
import { useAuth } from '@/src/context/AuthContext';
import { HanoService, DEPARTMENT_ID } from '@/src/services/HanoService';
import { Colors, Spacing, Shadows } from '@/src/theme/Theme';
import { H1, H2, Body, Caption } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// ... imports
import { NotificationService } from '@/src/services/NotificationService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SummaryScreen() {
    const router = useRouter();
    const { selectedTreatment, selectedTimeSlot } = useBooking();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        NotificationService.registerForPushNotificationsAsync();
    }, []);

    if (!selectedTreatment || !selectedTimeSlot || !user) {
        return (
            <SafeAreaView style={styles.center}>
                <Body style={styles.errorText}>Mangler informasjon for å fullføre.</Body>
                <TouchableOpacity onPress={() => router.replace('/booking')}>
                    <Body style={styles.linkText}>Gå tilbake til start</Body>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleConfirm = async () => {
        if (submitting) return;
        setSubmitting(true);
        console.log('Confirming booking...');

        try {
            await HanoService.createAppointment({
                departmentId: DEPARTMENT_ID,
                serviceId: selectedTreatment.Id,
                start: selectedTimeSlot.Start,
                customer: {
                    firstName: user.name.split(' ')[0],
                    lastName: user.name.split(' ').slice(1).join(' ') || '',
                    email: user.email,
                    phone: user.phone,
                    dob: user.birthdate,
                    address: user.address,
                    postcode: user.postcode,
                    city: user.city,
                    comment: ''
                }
            });

            await NotificationService.scheduleAppointmentReminder(new Date(selectedTimeSlot.Start), selectedTreatment.Name);

            // Navigate to Success Screen
            router.replace('/booking/success');

        } catch (error) {
            console.error('Booking Error:', error);
            if (Platform.OS === 'web') {
                window.alert('Noe gikk galt. Vi fikk ikke registrert timen.');
            } else {
                Alert.alert('Noe gikk galt', 'Vi fikk ikke registrert timen. Vennligst prøv igjen.');
            }
        } finally {
            // Only reset submitting if we are NOT navigating away on web (which unmounts)
            // But safe to reset generally.
            if (Platform.OS !== 'web') {
                setSubmitting(false);
            }
        }
    };

    const formatDateTime = (isoDate: string) => {
        const date = new Date(isoDate);
        const day = date.toLocaleString('no-NO', { weekday: 'long' });
        const dayNum = date.getDate();
        const month = date.toLocaleString('no-NO', { month: 'long' });
        const time = date.toLocaleString('no-NO', { hour: '2-digit', minute: '2-digit' });
        return { day, dayNum, month, time };
    };

    const dt = formatDateTime(selectedTimeSlot.Start);

    return (
        <View style={styles.container}>
            {/* Extended Header Background - Full width/height for immersive feel */}
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
                        <Text style={styles.navTitle}>Se over detaljer</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>

                {/* Header Content Area */}
                <View style={styles.headerHero}>
                    <Text style={styles.heroTitle}>Din Time</Text>
                    <Text style={styles.heroSubtitle}>Vi gleder oss til å se deg.</Text>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Modern Card Design */}
                    <View style={styles.modernCard}>

                        {/* Service Item */}
                        <View style={styles.rowItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="sparkles" size={20} color={Colors.primary.main} />
                            </View>
                            <View style={styles.itemText}>
                                <Text style={styles.label}>BEHANDLING</Text>
                                <Text style={styles.valueLarge}>{selectedTreatment.Name}</Text>
                                <Text style={styles.valueSub}>{selectedTreatment.Duration} • {selectedTreatment.Price},-</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        {/* Time Item */}
                        <View style={styles.rowItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="calendar" size={20} color={Colors.primary.main} />
                            </View>
                            <View style={styles.itemText}>
                                <Text style={styles.label}>TIDSPUNKT</Text>
                                <Text style={styles.valueLarge}>{dt.day} {dt.dayNum}. {dt.month}</Text>
                                <Text style={styles.valueSub}>Kl. {dt.time}</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        {/* Contact Item */}
                        <View style={styles.rowItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="person" size={20} color={Colors.primary.main} />
                            </View>
                            <View style={styles.itemText}>
                                <Text style={styles.label}>KONTAKT</Text>
                                <Text style={styles.valueMain}>{user.name}</Text>
                                <Text style={styles.valueSub}>{user.phone}</Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </View>

            {/* Bottom Action Area */}
            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>Ved å bestille godtar du våre vilkår for avbestilling (24t).</Text>
                </View>

                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={submitting}
                    activeOpacity={0.8}
                    style={styles.buttonContainer}
                >
                    <LinearGradient
                        colors={[Colors.primary.main, Colors.primary.dark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        {submitting ? (
                            <Text style={styles.buttonText}>Bekrefter...</Text>
                        ) : (
                            <Text style={styles.buttonText}>FULLFØR BESTILLING</Text>
                        )}
                        <Ionicons name="checkmark-circle" size={24} color="white" style={styles.buttonIcon} />
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBackground: {
        height: '35%', // Take up top 35% of screen
        paddingHorizontal: Spacing.m,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerSafeArea: {
        marginBottom: Spacing.s,
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
        paddingHorizontal: Spacing.m,
        marginTop: Spacing.l,
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
        marginTop: -60, // Overlap
        paddingHorizontal: Spacing.l,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    modernCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: Spacing.l,
        // Soft Modern Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: Spacing.s,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.background.main,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    itemText: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 1,
        marginBottom: 4,
    },
    valueLarge: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.neutral.darkGray,
        marginBottom: 2,
    },
    valueMain: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.neutral.darkGray,
        marginBottom: 2,
    },
    valueSub: {
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: Spacing.m,
        marginLeft: 56, // Align with text
    },
    footer: {
        padding: Spacing.l,
        backgroundColor: 'white',
    },
    termsContainer: {
        marginBottom: Spacing.m,
        alignItems: 'center',
    },
    termsText: {
        fontSize: 12,
        color: '#999',
    },
    buttonContainer: {
        borderRadius: 20, // Match child
        // Ensure no leakage 
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
        backgroundColor: 'transparent',
    },
    gradientButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 20, // Smooth rounded button
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Key fix for "white squares"
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    errorText: {
        color: Colors.status.error,
        marginBottom: Spacing.m,
    },
    linkText: {
        color: Colors.primary.main,
        textDecorationLine: 'underline',
    }
});
