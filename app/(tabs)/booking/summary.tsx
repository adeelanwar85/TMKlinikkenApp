
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
import { NotificationService } from '@/src/services/NotificationService';
import { LoyaltyService } from '@/src/services/LoyaltyService';
import { isLoyaltyEligible } from '@/src/constants/LoyaltyConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingSummaryScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { selectedTreatment, selectedTimeSlot } = useBooking();
    const [submitting, setSubmitting] = useState(false);

    // Safety: Redirect if no treatment selected
    useEffect(() => {
        if (!selectedTreatment || !selectedTimeSlot) {
            router.replace('/booking');
        }
    }, [selectedTreatment, selectedTimeSlot]);

    const handleConfirm = async () => {
        if (submitting) return;
        setSubmitting(true);
        console.log('Confirming booking...');

        try {
            if (!user) throw new Error("No user found");
            if (!selectedTreatment) throw new Error("No treatment");
            if (!selectedTimeSlot) throw new Error("No time slot");

            const response = await HanoService.createAppointment({
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

            // --- LOYALTY LOGIC ---
            // Register as PENDING/UPCOMING with Hano ID
            const userId = user.email.toLowerCase().trim();
            await LoyaltyService.registerPendingBooking(userId, {
                serviceId: selectedTreatment.Id,
                serviceName: selectedTreatment.Name,
                categoryId: selectedTreatment.CategoryId || 'unknown',
                price: selectedTreatment.Price,
                date: selectedTimeSlot.Start,
                hanoId: response?.Id || 0
            });
            // ---------------------

            await NotificationService.scheduleAppointmentReminder(new Date(selectedTimeSlot.Start), selectedTreatment.Name);

            // Navigate to Success Screen
            router.replace('/booking/success');

        } catch (error) {
            console.error("Booking Error:", error);
            Alert.alert("Feil", "Kunne ikke gjennomføre bestillingen. Prøv igjen.");
            setSubmitting(false);
        }
    };

    if (!selectedTreatment || !selectedTimeSlot || !user) {
        return <View style={styles.center}><Text>Laster...</Text></View>;
    }

    const isEligible = isLoyaltyEligible(selectedTreatment.CategoryId || '', selectedTreatment.Price);
    const pointsToEarn = Math.floor(selectedTreatment.Price / 10);

    return (
        <View style={styles.container}>
            {/* Header with Visuals */}
            <View style={styles.headerBackground}>
                <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
                    <View style={styles.navBar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.navTitle}>Se over & Bekreft</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>

                <View style={styles.headerHero}>
                    <Text style={styles.heroTitle}>Snart ferdig ✨</Text>
                    <Text style={styles.heroSubtitle}>Du er bare ett klikk unna litt velvære.</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.modernCard}>

                        {/* Treatment Item */}
                        <View style={styles.rowItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="sparkles" size={20} color={Colors.primary.main} />
                            </View>
                            <View style={styles.itemText}>
                                <Text style={styles.label}>BEHANDLING</Text>
                                <Text style={styles.valueLarge}>{selectedTreatment.Name}</Text>
                                <Text style={styles.valueSub}>{selectedTreatment.Duration} min • {selectedTreatment.Price},-</Text>
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
                                <Text style={styles.valueMain}>
                                    {new Date(selectedTimeSlot.Start).toLocaleDateString('no-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </Text>
                                <Text style={styles.valueSub}>
                                    Kl. {new Date(selectedTimeSlot.Start).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
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

                        <View style={styles.separator} />

                        {/* Loyalty Item */}
                        <View style={styles.rowItem}>
                            <View style={[styles.iconCircle, { backgroundColor: isEligible ? '#FFF9C4' : '#FFEBEE' }]}>
                                <Ionicons
                                    name={isEligible ? "star" : "shield"}
                                    size={20}
                                    color={isEligible ? "#FBC02D" : Colors.neutral.darkGray}
                                />
                            </View>
                            <View style={styles.itemText}>
                                <Text style={styles.label}>KUNDEKLUBB</Text>
                                {isEligible ? (
                                    <>
                                        <Text style={styles.valueMain}>+{pointsToEarn} Poeng</Text>
                                        <Text style={[styles.valueSub, { color: Colors.primary.main }]}>Du får et stempel i Glød-kortet ✨</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.valueMain}>Ingen bonus</Text>
                                        <Text style={styles.valueSub}>Medisinsk behandling gir ikke poeng (Helsepersonelloven).</Text>
                                    </>
                                )}
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
        backgroundColor: Colors.primary.deep, // Fallback or explicit color if image missing
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
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: Spacing.l,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
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
