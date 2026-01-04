
import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, Body, H3, Caption } from '@/src/theme/Typography';
import { GlowCard } from '@/src/components/GlowCard';
import { useAuth } from '@/src/context/AuthContext';
import { GradientHeader } from '@/src/components/GradientHeader';
import { LOYALTY_RULES } from '@/src/constants/LoyaltyConfig';

export default function LoyaltyScreen() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <GradientHeader title="Kundeklubb" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Branding / Intro */}
                <View style={styles.headerSection}>
                    <Image
                        source={require('@/assets/images/tm-logo.png')}
                        style={styles.brandLogo}
                        resizeMode="contain"
                    />
                    <H2 style={styles.title}>Velkommen til TM Glød ✨</H2>
                    <Body style={styles.subtitle}>
                        Som medlem sparer du poeng på hver behandling og får eksklusive fordeler.
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
                        <Caption style={styles.conversionText}>Verdi: {Math.floor((user?.loyalty?.points ?? 0) / 10)},- NOK</Caption>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statBox}>
                        <Body style={styles.statLabel}>MEDLEMSKAP</Body>
                        <H2 style={[styles.statValue, { color: Colors.primary.main }]}>
                            {(user?.loyalty?.tier ?? 'Bronse').toUpperCase()}
                        </H2>
                        <Caption style={styles.conversionText}>Neste nivå: Sølv</Caption>
                    </View>
                </View>

                {/* Detailed Information */}
                <View style={styles.infoBox}>
                    <H3 style={styles.infoTitle}>Slik fungerer det</H3>

                    <View style={styles.infoRow}>
                        <View style={styles.iconCircle}>
                            <Body>💎</Body>
                        </View>
                        <View style={styles.infoText}>
                            <Body style={styles.infoHeading}>Tjen Stempler</Body>
                            <Body style={styles.infoDesc}>Få 1 stempel for hver behandling over 1500,- (gjelder velvære og hudpleie).</Body>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconCircle}>
                            <Body>💰</Body>
                        </View>
                        <View style={styles.infoText}>
                            <Body style={styles.infoHeading}>Samle Poeng</Body>
                            <Body style={styles.infoDesc}>Du får 10 poeng for hver 100-lapp du bruker. Poengene kan brukes som rabatt på produkter i klinikken.</Body>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconCircle}>
                            <Body>🎁</Body>
                        </View>
                        <View style={styles.infoText}>
                            <Body style={styles.infoHeading}>Din Belønning</Body>
                            <Body style={styles.infoDesc}>Når kortet er fullt (5 stempler), spanderer vi en gratis **Express Facial** (verdi 950,-)!</Body>
                        </View>
                    </View>

                    <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                        <View style={styles.iconCircle}>
                            <Body>🩺</Body>
                        </View>
                        <View style={styles.infoText}>
                            <Body style={styles.infoHeading}>Viktig Info</Body>
                            <Body style={styles.infoDesc}>Medisinske behandlinger (injeksjoner, laser etc.) gir dessverre ikke stempler/poeng iht. lovverk.</Body>
                        </View>
                    </View>
                </View>

                {/* Shop CTA */}
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => router.push('/shop')}
                    activeOpacity={0.9}
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
        paddingBottom: 40,
    },
    headerSection: {
        marginBottom: Spacing.m,
        alignItems: 'center',
    },
    brandLogo: {
        width: 140,
        height: 60,
        marginBottom: Spacing.s,
        opacity: 0.9
    },
    title: {
        fontSize: 22,
        color: Colors.primary.deep,
        marginBottom: 4,
        textAlign: 'center'
    },
    subtitle: {
        textAlign: 'center',
        color: Colors.neutral.darkGray,
        opacity: 0.7,
        lineHeight: 20,
        fontSize: 14,
        paddingHorizontal: Spacing.m
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
        elevation: 3,
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
        fontSize: 11,
        color: Colors.neutral.darkGray,
        marginBottom: 4,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    statValue: {
        fontSize: 24,
        color: Colors.primary.deep,
        marginBottom: 2
    },
    conversionText: {
        fontSize: 11,
        color: Colors.neutral.darkGray,
        opacity: 0.6
    },
    infoBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 20,
        padding: Spacing.l,
        marginBottom: Spacing.l,
    },
    infoTitle: {
        fontSize: 18,
        marginBottom: Spacing.m,
        color: Colors.primary.deep,
        textAlign: 'center'
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: Spacing.m,
        paddingBottom: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1
    },
    infoText: {
        flex: 1,
    },
    infoHeading: {
        fontWeight: 'bold',
        color: Colors.primary.deep,
        marginBottom: 2,
        fontSize: 15
    },
    infoDesc: {
        fontSize: 13,
        color: Colors.neutral.darkGray,
        lineHeight: 18
    },
    shopButton: {
        backgroundColor: Colors.primary.main,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    shopButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});
