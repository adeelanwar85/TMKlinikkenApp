
import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../theme/Theme';
import { H3, Body, Caption } from '../theme/Typography';
import { LOYALTY_RULES } from '../constants/LoyaltyConfig';

interface GlowCardProps {
    stamps: number; // 0 to 5
}

export const GlowCard: React.FC<GlowCardProps> = ({ stamps }) => {
    const totalStamps = LOYALTY_RULES.STAMPS_REQUIRED_FOR_REWARD;
    const progress = Math.min(stamps / totalStamps, 1);

    return (
        <View style={styles.container}>
            {/* Background decoration */}
            <View style={styles.glowEffect} />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.logoRow}>
                        <Image
                            source={require('@/assets/images/tm-logo-white.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <H3 style={styles.cardTitle}>GLØD KORT</H3>
                    </View>
                    <Caption style={styles.subText}>
                        Samle {totalStamps} stempler – få en {LOYALTY_RULES.REWARD_NAME}!
                    </Caption>
                </View>
                {/* Visual Icon */}
                <Ionicons name="sparkles" size={24} color="#FFF" style={styles.sparkleIcon} />
            </View>

            <View style={styles.stampsContainer}>
                {Array.from({ length: totalStamps }).map((_, index) => {
                    const isFilled = index < stamps;
                    return (
                        <View key={index} style={[styles.stampSlot, isFilled && styles.stampFilled]}>
                            {isFilled ? (
                                <Ionicons name="star" size={20} color={Colors.primary.deep} />
                            ) : (
                                <Text style={styles.stampNumber}>{index + 1}</Text>
                            )}
                        </View>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <Caption style={styles.footerText}>
                    {stamps >= totalStamps
                        ? "🎊 Gratulerer! Du har en gratis behandling!"
                        : `Du mangler ${totalStamps - stamps} stempler for belønning.`}
                </Caption>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary.deep, // Using deep burgundy as base
        borderRadius: 20,
        padding: Spacing.m,
        marginVertical: Spacing.s,
        // Enhanced Shadows for "Lively" look
        shadowColor: "#5e1e28",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        width: '100%',
        maxWidth: 380, // Prevent too wide
    },
    glowEffect: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
        transform: [{ scale: 1.5 }],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.l,
    },
    headerContent: {
        flex: 1,
        marginRight: Spacing.m,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    logo: {
        width: 30, // Small TM Logo
        height: 20,
        marginRight: 6,
    },
    cardTitle: {
        color: 'white',
        letterSpacing: 1.5,
        fontSize: 14,
        fontWeight: 'bold',
    },
    subText: {
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 18,
    },
    sparkleIcon: {
        opacity: 0.8,
        marginTop: 4
    },
    stampsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.l,
        paddingHorizontal: Spacing.xs,
    },
    stampSlot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)', // Transparent slot
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    stampFilled: {
        backgroundColor: '#FFD700', // Gold color for filled stamp
        borderColor: '#FFD700',
        transform: [{ scale: 1.1 }],
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
    },
    stampNumber: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 'bold',
        fontSize: 14
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
        paddingTop: Spacing.m,
    },
    footerText: {
        color: 'rgba(255,255,255,0.95)',
        fontStyle: 'italic',
    }
});
