import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ServiceCard } from '@/src/components/ServiceCard';
import { TREATMENT_MENU } from '@/src/constants/Menu';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState('Behandlinger'); // Changed default to Behandlinger

    // Handle Tab Press
    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
        if (tab === 'TM Klinikken') {
            router.push({ pathname: '/webview', params: { url: 'https://www.tmklinikken.no', title: 'TM Klinikken' } });
        } else if (tab === 'Bestill time') {
            router.push('/booking');
        } else if (tab === 'Gavekort') {
            router.push('/shop/giftcard');
        } else if (tab === 'Priser') {
            router.push('/prices');
        } else if (tab === 'Om oss') {
            router.push('/about');
        } else if (tab === 'Kontakt') {
            router.push('/contact');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.headerCentered}>
                    <Image
                        source={require('@/assets/images/tm-logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    <Body style={styles.greeting}>Hei, {user?.name || 'Gjest'} 👋</Body>
                    <H2 style={styles.mainQuestion}>Hva kan vi hjelpe deg med?</H2>
                </View>

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabList}>
                        {['Behandlinger', 'Bestill time', 'Gavekort', 'Priser', 'Om oss', 'Kontakt'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, selectedTab === tab && styles.tabButtonActive]}
                                onPress={() => handleTabPress(tab)}
                            >
                                <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Main Cards Stack */}
                <View style={styles.cardStack}>
                    {/* Dynamic Service Cards from Scraped Menu */}
                    {TREATMENT_MENU.filter(item => item.id !== 'priser').map((item) => (
                        <ServiceCard
                            key={item.id}
                            title={item.title}
                            subtitle={item.subtitle}
                            iconName={item.icon as any}
                            image={item.image}
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
                    ))}


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
        </SafeAreaView>
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
    // Header
    headerCentered: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.m,
    },
    headerLogo: {
        width: 180,
        height: 45,
        marginBottom: Spacing.m,
    },
    greeting: {
        color: Colors.primary.dark,
        marginBottom: Spacing.xs,
        fontSize: 16,
    },
    mainQuestion: {
        color: '#4A2B29',
        textAlign: 'center',
        fontSize: 22,
    },
    // Tabs
    tabContainer: {
        marginBottom: Spacing.l,
        paddingHorizontal: Spacing.m,
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
});
