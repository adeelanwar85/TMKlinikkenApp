import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H3 } from '@/src/theme/Typography';
import { ContentService, treatmentMenuItem } from '@/src/services/ContentService';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TreatmentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [treatment, setTreatment] = useState<treatmentMenuItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                if (!id) {
                    setLoading(false);
                    return;
                }
                const data = await ContentService.getTreatmentById(id as string);

                if (data) {
                    // If the loaded treatment ID is different from the requested ID, 
                    // it means we found a parent for a sub-treatment ID. Redirect to sub-page.
                    // FIX: Updated path to reflect nested stack location
                    if (data.id !== id) {
                        router.replace({ pathname: '/(tabs)/index/treatment/[id]/[subId]', params: { id: data.id, subId: id as string } });
                        return;
                    }
                    setTreatment(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, [id, router]);

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={Colors.primary.deep} />
            </View>
        );
    }

    if (!treatment) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCircle}>
                        <Ionicons name="arrow-back" size={24} color={Colors.neutral.charcoal} />
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <Text>Fant ikke behandlingen.</Text>
                </View>
            </View>
        );
    }

    const { details } = treatment;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header / Nav */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCircle}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                </View>

                {/* Floating Hero Section (V3) */}
                <View style={styles.heroWrapper}>
                    <View style={styles.heroContainer}>
                        {details?.heroImage ? (
                            <Image source={{ uri: details.heroImage }} style={styles.heroImage} resizeMode="cover" />
                        ) : (
                            <Image source={treatment.image} style={styles.heroImage} resizeMode="cover" />
                        )}
                        <View style={styles.heroOverlay} />
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <H1 style={styles.pageTitle}>{treatment.title}</H1>
                    <Text style={styles.subtitle}>{treatment.subtitle}</Text>

                    <View style={styles.divider} />

                    {details?.intro && (
                        <Body style={styles.introText}>{details.intro}</Body>
                    )}

                    {/* Sub Treatments List */}
                    {details?.subTreatments ? (
                        <View style={styles.subTreatmentGrid}>
                            <H3 style={styles.sectionTitle}>Våre behandlinger</H3>
                            {details.subTreatments.map((sub, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.subTreatmentCard}
                                    onPress={() => router.push(`/treatment/${treatment.id}/${sub.id}`)}
                                >
                                    <View style={styles.subContent}>
                                        <Text style={styles.subTitle}>{sub.title}</Text>
                                        {sub.subtitle && <Text style={styles.subSubtitle}>{sub.subtitle}</Text>}
                                    </View>
                                    <View style={styles.iconCircle}>
                                        <Ionicons name="arrow-forward" size={20} color={Colors.primary.deep} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        // Fallback for legacy structure
                        details?.sections?.map((section, index) => (
                            <View key={index} style={styles.section}>
                                <H3 style={styles.sectionTitle}>{section.title}</H3>
                                {section.type === 'text' && section.content && (
                                    <Body style={styles.sectionText}>{section.content}</Body>
                                )}
                                {section.type === 'list' && section.listItems && (
                                    <View style={styles.listContainer}>
                                        {section.listItems.map((item: any, i: number) => (
                                            <View key={i} style={styles.listItem}>
                                                <Ionicons name="ellipse" size={6} color={Colors.primary.deep} style={{ marginRight: 12, opacity: 0.6 }} />
                                                <Text style={styles.listItemLabel}>{item.label}</Text>
                                                {item.value && <Text style={styles.listItemValue}>{item.value}</Text>}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/booking')}>
                    <Ionicons name="calendar-outline" size={20} color="white" />
                    <Text style={styles.bookButtonText}>Bestill time</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F6', // V3 Warm Beige
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 50,
    },
    backButtonCircle: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 50,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    // Floating Hero (V3)
    heroWrapper: {
        marginTop: 20,
        alignItems: 'center',
        shadowColor: "#2C1810",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    heroContainer: {
        width: width - 40,
        height: 280,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },

    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    pageTitle: {
        fontSize: 32,
        fontFamily: 'System',
        fontWeight: '700',
        color: '#502022', // Brand Deep
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8A8A8A',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    introText: {
        fontSize: 16,
        lineHeight: 28,
        color: '#555',
        marginBottom: 30,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#E6E6E1',
        marginVertical: 20,
        width: 100,
        alignSelf: 'center',
    },

    // Cards
    section: {
        marginBottom: 24,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#502022",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#502022', // Brand Deep
        marginBottom: 20,
        fontWeight: '700',
        fontFamily: 'System',
    },
    sectionText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#555',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemLabel: {
        fontSize: 16,
        color: '#444',
        flex: 1,
    },
    listItemValue: {
        fontSize: 16,
        color: Colors.primary.deep,
        fontWeight: '600',
    },

    // Sub Treatments Grid
    subTreatmentGrid: {
        marginTop: 10,
        gap: 16,
    },
    subTreatmentCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Premium Shadow
        shadowColor: "#502022",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    subContent: {
        flex: 1,
        paddingRight: 10,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    subSubtitle: {
        fontSize: 14,
        color: '#888',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9F9F6',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: width - 40,
    },
    bookButton: {
        backgroundColor: '#502022', // Deep Brand Red
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        shadowColor: "#502022",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
