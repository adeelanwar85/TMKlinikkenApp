import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../src/context/BookingContext';
import { getTreatments } from '../../src/api/hanoClient';
import { Service } from '../../src/types/HanoTypes';
import { Colors, Spacing, Typography, Shadows } from '../../src/theme/Theme';
import { H1, H2, Body, Caption } from '../../src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectTreatmentScreen() {
    const router = useRouter();
    const { setTreatment } = useBooking();
    const [treatments, setTreatments] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTreatments();
    }, []);

    const loadTreatments = async () => {
        try {
            setLoading(true);
            const data = await getTreatments();
            setTreatments(data);
        } catch (err) {
            setError('Kunne ikke laste behandlinger. Prøv igjen senere.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (treatment: Service) => {
        setTreatment(treatment);
        router.push('/booking/date-select');
    };

    const getIconForTreatment = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('konsultasjon')) return 'chatbubbles-outline';
        if (lower.includes('filler') || lower.includes('leppe') || lower.includes('volum')) return 'water-outline';
        if (lower.includes('hud') || lower.includes('skin') || lower.includes('acne') || lower.includes('peel')) return 'rose-outline';
        if (lower.includes('fett') || lower.includes('sculp') || lower.includes('kropp')) return 'body-outline';
        if (lower.includes('laser') || lower.includes('hårfjerning')) return 'flash-outline';
        return 'sparkles-outline'; // Default (Back to stars as requested)
    };

    const renderItem = ({ item }: { item: Service }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => handleSelect(item)}
            activeOpacity={0.8}
        >
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Ionicons name={getIconForTreatment(item.Name) as any} size={24} color={Colors.primary.main} />
                </View>
                <View style={styles.textContainer}>
                    <H2 style={styles.title}>{item.Name}</H2>
                    <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                        <Caption style={styles.metaText}>{item.Duration}</Caption>
                        <View style={styles.dot} />
                        <Ionicons name="card-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                        <Caption style={styles.metaText}>{item.Price},-</Caption>
                    </View>
                    {item.Description ? (
                        <Body style={styles.description} numberOfLines={2}>
                            {item.Description.replace(/<\/?[^>]+(>|$)/g, "")}
                        </Body>
                    ) : null}
                </View>
                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Premium Header */}
            <LinearGradient
                colors={[Colors.primary.dark, Colors.primary.main]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
            >
                <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={router.back} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Ny Bestilling</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <View style={styles.headerHero}>
                        <Text style={styles.heroTitle}>Velg Behandling</Text>
                        <Text style={styles.heroSubtitle}>Hva ønsker du å gjøre i dag?</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={Colors.primary.main} />
                        <Body style={styles.loadingText}>Henter behandlinger...</Body>
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Ionicons name="alert-circle-outline" size={48} color={Colors.status.error} />
                        <Body style={styles.errorText}>{error}</Body>
                        <TouchableOpacity style={styles.retryButton} onPress={loadTreatments}>
                            <Text style={styles.retryText}>Prøv igjen</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={treatments}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.Id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
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
    headerBackground: {
        height: 220,
        paddingHorizontal: Spacing.m,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerSafeArea: {
        flex: 1,
    },
    headerContent: {
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
    headerTitle: {
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
        marginTop: -40, // overlap
    },
    listContent: {
        padding: Spacing.m,
        paddingBottom: 40,
    },
    cardContainer: {
        marginBottom: Spacing.m,
        ...Shadows.card,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: Spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: Colors.background.main,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.neutral.darkGray,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#ccc',
        marginHorizontal: 8,
    },
    description: {
        fontSize: 13,
        color: '#888',
        lineHeight: 18,
    },
    arrowContainer: {
        paddingLeft: Spacing.s,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
        marginTop: 40,
    },
    loadingText: {
        marginTop: Spacing.m,
        color: Colors.neutral.charcoal,
    },
    errorText: {
        marginTop: Spacing.m,
        textAlign: 'center',
        marginBottom: Spacing.l,
        color: Colors.neutral.darkGray,
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: Colors.primary.main,
        borderRadius: 12,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
