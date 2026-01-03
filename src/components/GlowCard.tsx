import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
            <View style={styles.header}>
                <View>
                    <H3 style={{ color: 'white' }}>{LOYALTY_RULES.STAMP_CARD_NAME} ✨</H3>
                    <Caption style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Samle {totalStamps} stempler – få en {LOYALTY_RULES.REWARD_NAME}!
                    </Caption>
                </View>
                {/* Visual Icon */}
                <Ionicons name="sparkles" size={24} color="#FFF" style={{ opacity: 0.8 }} />
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
                <Caption style={{ color: 'rgba(255,255,255,0.9)' }}>
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
        borderRadius: 16,
        padding: Spacing.m,
        marginVertical: Spacing.s,
        ...Shadows.medium,
        overflow: 'hidden',
        // Optional: Add a subtle border
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.l,
    },
    stampsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.l,
        paddingHorizontal: Spacing.s,
    },
    stampSlot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)', // Transparent slot
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    stampFilled: {
        backgroundColor: '#FFD700', // Gold color for filled stamp
        borderColor: '#FFD700',
        transform: [{ scale: 1.1 }]
    },
    stampNumber: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 'bold',
        fontSize: 14
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: Spacing.s,
    }
});
