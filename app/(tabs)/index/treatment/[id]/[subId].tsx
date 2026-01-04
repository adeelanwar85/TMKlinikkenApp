import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, ActivityIndicator, Text, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H1, H2, H3, Body } from '@/src/theme/Typography';
import { ContentService, treatmentMenuItem, SubTreatment } from '@/src/services/ContentService';

const { width } = Dimensions.get('window');

export default function SubTreatmentDetailScreen() {
    const { id, subId } = useLocalSearchParams();
    const router = useRouter();

    const [parentTreatment, setParentTreatment] = useState<treatmentMenuItem | null>(null);
    const [subTreatment, setSubTreatment] = useState<SubTreatment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, [id, subId]);

    const loadContent = async () => {
        if (id && subId) {
            const parent = await ContentService.getTreatmentById(id as string);
            if (parent) {
                setParentTreatment(parent);
                if (parent.details && parent.details.subTreatments) {
                    const sub = parent.details.subTreatments.find(s => s.id === subId);
                    if (sub) {
                        setSubTreatment(sub);
                    }
                }
            }
        }
        setLoading(false);
    };

    const handleBack = () => router.back();
    const handleBook = () => router.push('/booking');

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary.deep} />
            </View>
        );
    }

    if (!subTreatment || !parentTreatment) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Body>Fant ikke behandlingen.</Body>
                <TouchableOpacity onPress={handleBack} style={{ marginTop: 20 }}>
                    <Body style={{ color: Colors.primary.deep }}>Gå tilbake</Body>
                </TouchableOpacity>
            </View>
        );
    }

    // Content extraction
    const { title, subtitle, heroImage, intro, content } = subTreatment;

    // Helper to get fallback hero image
    const displayHero = heroImage || parentTreatment.details?.heroImage || parentTreatment.image;

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header / Nav */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCircle}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                </View>

                {/* 1. HERO SECTION (Compact, No Tag) */}
                <View style={styles.heroSection}>
                    {/* Hero Image - Card Style */}
                    <View style={styles.heroImageContainer}>
                        <Image
                            source={typeof displayHero === 'string' ? { uri: displayHero } : displayHero}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                        <View style={styles.heroOverlay} />
                    </View>

                    <H1 style={styles.heroTitle}>{subTreatment.title}</H1>

                    {subTreatment.subtitle && (
                        <Body style={styles.heroDescription}>
                            {subTreatment.subtitle}
                        </Body>
                    )}
                </View>

                <View style={styles.contentContainer}>
                    {/* Dynamic Content Loop - ALL WRAPPED IN CARDS */}
                    {subTreatment.content.map((section, index) => {
                        const titleLower = section.title?.toLowerCase() || '';

                        // Detect Types
                        const isProcess = titleLower.includes('slik') || titleLower.includes('foregår') || titleLower.includes('klinikk');
                        const isCandidates = titleLower.includes('hvem') || titleLower.includes('passer');
                        const isAbout = titleLower.includes('om ') || titleLower.includes('hvorfor') || titleLower.includes('hva') || titleLower.includes('hvordan') || titleLower.includes('virker');
                        const isAftercare = titleLower.includes('etter') || titleLower.includes('info');

                        // --- A. ABOUT / INTRO (Beige Card) ---
                        if (isAbout) {
                            return (
                                <View key={index} style={styles.cardBeige}>
                                    <H2 style={styles.cardTitle}>{section.title}</H2>
                                    <Body style={styles.cardText}>{section.content}</Body>
                                </View>
                            );
                        }

                        // --- B. PROCESS (White Card with Steps) ---
                        if (isProcess) {
                            return (
                                <View key={index} style={styles.cardWhite}>
                                    <H2 style={styles.cardTitleCenter}>{section.title}</H2>

                                    <View style={styles.stepsRow}>
                                        {/* Visual Step Icons */}
                                        <View style={styles.stepItem}>
                                            <View style={styles.stepCircle}><Ionicons name="water-outline" size={20} color="white" /></View>
                                            <Text style={styles.stepLabel}>Rens</Text>
                                        </View>
                                        <View style={styles.stepLine} />
                                        <View style={styles.stepItem}>
                                            <View style={styles.stepCircle}><Ionicons name="flask-outline" size={20} color="white" /></View>
                                            <Text style={styles.stepLabel}>Behandle</Text>
                                        </View>
                                        <View style={styles.stepLine} />
                                        <View style={styles.stepItem}>
                                            <View style={styles.stepCircle}><Ionicons name="home-outline" size={20} color="white" /></View>
                                            <Text style={styles.stepLabel}>Hjemme</Text>
                                        </View>
                                    </View>

                                    {section.content && <Body style={styles.cardTextCenter}>{section.content}</Body>}
                                </View>
                            );
                        }

                        // --- C. CANDIDATES (White Card - Clean List) ---
                        if (isCandidates) {
                            return (
                                <View key={index} style={styles.cardWhite}>
                                    <H2 style={styles.cardTitle}>{section.title}</H2>
                                    <Body style={styles.cardText}>{section.content}</Body>

                                    {section.listItems && (
                                        <View style={styles.candidateList}>
                                            {section.listItems.map((item: any, i: number) => (
                                                <View key={i} style={styles.candidateItem}>
                                                    <View style={styles.candidateIconBox}>
                                                        <Ionicons name="checkmark" size={16} color={Colors.primary.deep} />
                                                    </View>
                                                    <Text style={styles.candidateText}>{item.label}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        }

                        // --- D. AFTERCARE / INFO (White Card with Icon List) ---
                        if (isAftercare) {
                            return (
                                <View key={index} style={styles.cardWhite}>
                                    <H2 style={styles.cardTitle}>{section.title}</H2>
                                    {section.content && <Body style={styles.cardText}>{section.content}</Body>}

                                    {section.listItems && (
                                        <View style={styles.checkList}>
                                            {section.listItems.map((item: any, i: number) => (
                                                <View key={i} style={styles.checkItem}>
                                                    <Ionicons name="ellipse" size={8} color={Colors.primary.deep} style={{ marginTop: 6 }} />
                                                    <View style={{ flex: 1 }}>
                                                        <Body style={styles.checkText}>
                                                            <Text style={{ fontWeight: '700' }}>{item.label}</Text> {item.value}
                                                        </Body>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        }

                        // Fallback Standard
                        return (
                            <View key={index} style={styles.cardWhite}>
                                <H2 style={styles.cardTitle}>{section.title}</H2>
                                {section.content && <Body style={styles.cardText}>{section.content}</Body>}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Footer Button (Floating) */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/booking')}>
                    <Ionicons name="calendar" size={20} color="white" />
                    <Text style={styles.bookButtonText}>Bestill time</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingBottom: 100 },

    header: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 50,
    },
    backButtonCircle: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // HERO - Tight & Card-like
    heroSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
    },
    heroImageContainer: {
        width: width - 40,
        height: 250,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#F0F0F0',
        elevation: 10,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
    heroTitle: {
        textAlign: 'center',
        fontSize: 28,
        color: Colors.primary.deep,
        marginBottom: 8,
    },
    heroDescription: {
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 10,
    },

    contentContainer: {
        paddingHorizontal: 20,
        gap: 20, // Space between cards
    },

    // CARDS - The core visual element
    cardWhite: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardBeige: {
        backgroundColor: '#F5F1E6', // Warm Beige for "About"
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 12,
        color: Colors.primary.deep,
    },
    cardTitleCenter: {
        fontSize: 20,
        marginBottom: 20,
        color: Colors.primary.deep,
        textAlign: 'center',
    },
    cardText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    cardTextCenter: {
        fontSize: 15,
        lineHeight: 24,
        color: '#555',
        textAlign: 'center',
    },

    // Process Steps specific styles
    stepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    stepItem: {
        alignItems: 'center',
        gap: 8,
    },
    stepCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary.deep,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    stepLine: {
        width: 30,
        height: 2,
        backgroundColor: Colors.primary.deep,
        marginHorizontal: 4,
        marginTop: -15, // Align with circle center roughly
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },

    // Candidates List (Cleaner, Non-button)
    candidateList: {
        marginTop: 16,
        gap: 12,
    },
    candidateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    candidateIconBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F3E5E5', // Very light brand tint
        justifyContent: 'center',
        alignItems: 'center',
    },
    candidateText: {
        fontSize: 15,
        color: '#444',
        fontWeight: '500',
    },

    // Check List
    checkList: { marginTop: 16, gap: 12 },
    checkItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    checkText: { fontSize: 15, color: '#444', lineHeight: 22 },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: width - 40,
    },
    bookButton: {
        backgroundColor: Colors.primary.deep,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
