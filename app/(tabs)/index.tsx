import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H2, H3 } from '@/src/theme/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientHeader } from '@/src/components/GradientHeader'; // Can keep or remove if we want to reuse later, but lint unused might trigger
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ServiceCard } from '@/src/components/ServiceCard';
import { ContentService, treatmentMenuItem } from '@/src/services/ContentService';
import { NotificationService } from '@/src/services/NotificationService';
import { TREATMENT_MENU } from '@/src/constants/Menu';
import { LOCAL_ASSET_MAP } from '@/src/constants/LocalAssets';
const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState('');
    const [treatments, setTreatments] = useState<treatmentMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    // State for dynamic config
    const [alertBanner, setAlertBanner] = React.useState<{ active: boolean, message: string } | null>(null);

    useEffect(() => {
        loadTreatments();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadConfig();
            checkUnreadNotifications();
        }, [])
    );

    const checkUnreadNotifications = async () => {
        const count = await NotificationService.getUnreadCount();
        setUnreadCount(count);
    };

    const loadConfig = async () => {
        try {
            const config = await ContentService.getAppConfig();
            if (config && config.alertBanner) {
                setAlertBanner(config.alertBanner);
            }
        } catch (e) {
            console.error("Failed to load config", e);
        }
    };

    const loadTreatments = async () => {
        try {
            // Fetch live data from Firestore
            const data = await ContentService.getAllTreatments();

            // Sort by order/id if needed, or trust the return order
            // For now, simple sort or just set
            setTreatments(data);
        } catch (error) {
            console.error("Failed to load treatments", error);
            // Fallback to static if offline or error
            setTreatments(TREATMENT_MENU);
        } finally {
            setLoading(false);
        }
    };

    // Handle Tab Press
    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
        if (tab === 'TM Klinikken') {
            router.push({ pathname: '/webview', params: { url: 'https://www.tmklinikken.no', title: 'TM Klinikken' } });
        } else if (tab === 'Bestill time') {
            router.push('/booking');
        } else if (tab === 'Gavekort') {
            router.push('/giftcard');
        } else if (tab === 'Priser') {
            router.push('/prices');
        } else if (tab === 'Om oss') {
            router.push('/about');
        } else if (tab === 'Kontakt') {
            router.push('/contact');
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#FDFBF7' }}>
                {/* Top Bar with Notification Bell */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => router.push('/notifications')}
                        style={styles.notificationButton}
                    >
                        <Ionicons name="notifications-outline" size={24} color={Colors.primary.deep} />
                        {unreadCount > 0 && (
                            <View style={styles.badge} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.headerCentered}>
                    <Image
                        source={require('@/assets/images/tm-logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    <H2 style={styles.greeting}>Hei, {(user as any)?.name || (user as any)?.firstName || 'Gjest'} 👋</H2>
                    <H1 style={styles.mainQuestion}>Hva kan vi hjelpe deg med?</H1>
                </View>

                {/* Dynamic Alert Banner */}
                {alertBanner?.active && (
                    <View style={styles.alertBanner}>
                        <Ionicons name="alert-circle" size={20} color="#856404" style={{ marginRight: 8 }} />
                        <Body style={{ color: '#856404', flex: 1, fontSize: 13 }}>{alertBanner.message}</Body>
                    </View>
                )}
            </SafeAreaView>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
            >
                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabList}>
                        {['Bestill time', 'Gavekort', 'Priser', 'Om oss', 'Kontakt'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, selectedTab === tab && styles.tabButtonActive]}
                                onPress={() => handleTabPress(tab)}
                            >
                                <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab === 'Priser' ? 'Priser og behandlinger' : tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Main Cards Stack */}
                <View style={styles.cardStack}>
                    {loading ? (
                        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                            {/* Simple text loading or spinner */}
                            <Text style={{ color: Colors.neutral.darkGray }}>Laster behandlinger...</Text>
                        </View>
                    ) : (
                        /* Dynamic Service Cards from ContentService */
                        treatments.filter(item => item.id !== 'priser').map((item) => (
                            <ServiceCard
                                key={item.id}
                                title={item.title}
                                subtitle={item.subtitle}
                                // Handle icon safely - use item.icon if it exists (for laser/rose/apps), otherwise check if we have a local asset map
                                // Prioritize dynamic icon from DB if available
                                iconName={(item.icon as any) || (LOCAL_ASSET_MAP[item.id] ? undefined : 'sparkles-outline')}
                                // Handle image safely (local assets vs strings)
                                // Prioritize dynamic image URL from DB if available (item.image), then fallback to local asset
                                image={item.image ? { uri: item.image } : LOCAL_ASSET_MAP[item.id]}
                                buttonText="Les mer"
                                onPress={() => {
                                    if (item.details) {
                                        router.push(`/treatment/${item.id}`);
                                    } else if (item.id === 'bestill') {
                                        router.push('/booking');
                                    } else {
                                        router.push({ pathname: '/webview', params: { url: item.url, title: item.title } });
                                    }
                                }}
                            />
                        ))
                    )}


                    <View style={{ height: 20 }} />

                    {/* Nettbutikk Card */}
                    <TouchableOpacity style={styles.webshopCard} onPress={() => router.push({ pathname: '/webview', params: { url: 'https://www.tmklinikken.no/butikk', title: 'Nettbutikk' } })}>
                        <View style={styles.webshopContent}>
                            <H3 style={{ color: Colors.neutral.white }}>Besøk vår nettbutikk</H3>
                            <Body style={{ color: Colors.neutral.lightGray, marginTop: 4 }}>Kjøp dine favorittprodukter online</Body>
                        </View>
                        <View style={styles.webshopIcon}>
                            <Ionicons name="cart-outline" size={28} color={Colors.neutral.white} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 10 }} />

                    {/* Information Link Card */}
                    <TouchableOpacity style={styles.infoCard} onPress={() => router.push('/about')}>
                        <View style={styles.infoIcon}>
                            <Ionicons name="information-circle-outline" size={24} color={Colors.primary.dark} />
                        </View>
                        <View style={styles.infoContent}>
                            <H3 style={{ fontSize: 16 }}>Om TM Klinikken</H3>
                            <Body style={{ fontSize: 13, color: Colors.neutral.darkGray }}>Les mer om klinikken og våre ansatte.</Body>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.neutral.darkGray} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    // Top Bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.m,
        paddingTop: Spacing.s,
        backgroundColor: Colors.background.main,
    },
    notificationButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D32F2F', // Red dot
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    // Header
    headerCentered: {
        alignItems: 'center',
        paddingVertical: Spacing.l,
        paddingHorizontal: Spacing.m,
        backgroundColor: Colors.background.main,
    },
    headerLogo: {
        width: 180,
        height: 60,
        marginBottom: Spacing.s,
    },
    greeting: {
        color: '#4A2B29', // Matching the reddish tint from screenshot intuition or primary dark
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
    },
    mainQuestion: {
        color: '#2C2C2C',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: Spacing.m,
    },
    // Tabs
    tabContainer: {
        marginBottom: Spacing.l,
        paddingHorizontal: Spacing.m,
        backgroundColor: '#FDFBF7', // Match background for sticky effect
        zIndex: 10,
        paddingTop: 10, // Add breathing room when sticky
    },
    tabList: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    tabButtonActive: {
        backgroundColor: Colors.primary.deep,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.neutral.darkGray,
        opacity: 0.6,
    },
    tabTextActive: {
        color: Colors.neutral.white,
        fontWeight: 'bold',
        opacity: 1,
    },
    // Card Stack
    cardStack: {
        paddingHorizontal: Spacing.m,
        gap: Spacing.l,
    },
    // Info Link
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
        padding: Spacing.m,
        borderRadius: 12,
        marginBottom: Spacing.s,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
    },
    infoContent: {
        flex: 1,
    },
    webshopCard: {
        flexDirection: 'row',
        backgroundColor: Colors.neutral.charcoal,
        borderRadius: 20,
        padding: Spacing.l,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.s,
    },
    webshopContent: {
        flex: 1,
    },
    webshopIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBanner: {
        backgroundColor: '#fff3cd',
        padding: 10,
        marginHorizontal: Spacing.m,
        marginBottom: Spacing.m,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffecb5'
    },
});
