
import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, Body, H3 } from '@/src/theme/Typography';
import { GlowCard } from '@/src/components/GlowCard';
import { useAuth } from '@/src/context/AuthContext';
import { GradientHeader } from '@/src/components/GradientHeader';
import { LOYALTY_RULES } from '@/src/constants/LoyaltyConfig';

export default function LoyaltyScreen() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <GradientHeader title="TM Kundeklubb" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Intro / Status */}
                <View style={styles.section}>
                    <H2 style={styles.title}>Min Glød ✨</H2>
                    <Body style={styles.subtitle}>
                        Ditt digitale stempelkort. Få hver 6. behandling gratis!*
                        {"\n"}(Gjelder utvalgte velværebehandlinger)
                    </Body>
                </View>

                {/* The Card */}
                <View style={styles.cardContainer}>
                    <GlowCard stamps={user?.loyalty?.stamps ?? 0} />
                </View>

                {/* Points Status */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Body style={styles.statLabel}>DINE POENG</Body>
                        <H2 style={styles.statValue}>{user?.loyalty?.points ?? 0}</H2>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statBox}>
                        <Body style={styles.statLabel}>MEDLEMSKAP</Body>
                        <H2 style={[styles.statValue, { color: Colors.primary.main }]}>
                            {(user?.loyalty?.tier ?? 'Bronse').toUpperCase()}
                        </H2>
                    </View>
                </View>

                {/* Information */}
                <View style={styles.infoBox}>
                    <H3 style={styles.infoTitle}>Hvordan fungerer det?</H3>
                    <View style={styles.bullet}>
                        <Body>💎 <Body style={{ fontWeight: 'bold' }}>Stempler:</Body> Du får 1 stempel for hver behandling over 1500,- (gjelder velvære/hud).</Body>
                    </View>
                    <View style={styles.bullet}>
                        <Body>🎁 <Body style={{ fontWeight: 'bold' }}>Bonus:</Body> Når kortet er fullt (5 stempler), får du en gratis Express Facial!</Body>
                    </View>
                    <View style={styles.bullet}>
                        <Body>🩺 <Body style={{ fontWeight: 'bold' }}>Lege:</Body> Medisinske behandlinger gir dessverre ikke stempler iht. lovverk.</Body>
                    </View>
                </View>

                {/* Shop CTA (Since we moved Shop out of tabs) */}
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => router.push('/shop')}
                >
                    <H3 style={styles.shopButtonText}>Gå til Nettbutikk</H3>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollContent: {
        padding: Spacing.l,
    },
    section: {
        marginBottom: Spacing.m,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        color: Colors.primary.deep,
        marginBottom: Spacing.s,
    },
    subtitle: {
        textAlign: 'center',
        color: Colors.neutral.darkGray,
        opacity: 0.8,
        lineHeight: 20
    },
    cardContainer: {
        marginVertical: Spacing.m,
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: Colors.neutral.lightGray,
        marginHorizontal: Spacing.s,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.neutral.darkGray,
        marginBottom: 4,
        fontWeight: '600',
        letterSpacing: 1,
    },
    statValue: {
        fontSize: 24,
        color: Colors.primary.deep,
    },
    infoBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.l,
    },
    infoTitle: {
        fontSize: 16,
        marginBottom: Spacing.m,
        color: Colors.primary.deep,
    },
    bullet: {
        marginBottom: Spacing.s,
    },
    shopButton: {
        backgroundColor: Colors.primary.main,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    shopButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
