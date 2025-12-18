import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ServiceCardProps {
    title: string;
    subtitle: string;
    image?: ImageSourcePropType;
    iconName?: keyof typeof Ionicons.glyphMap;
    buttonText: string;
    onPress?: () => void;
    variant?: 'teal' | 'light';
}

export const ServiceCard = ({ title, subtitle, image, iconName, buttonText, onPress, variant = 'teal' }: ServiceCardProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 10, stiffness: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    };

    return (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={[styles.card, variant === 'light' && styles.cardLight, animatedStyle]}>
                <View style={styles.cardImageContainer}>
                    {iconName ? (
                        <Ionicons
                            name={iconName}
                            size={48}
                            color={variant === 'teal' ? Colors.neutral.white : Colors.primary.main}
                        />
                    ) : (
                        image && <Image source={image} style={[styles.cardImage, variant === 'light' && { opacity: 0.8 }]} resizeMode="contain" />
                    )}
                </View>
                <View style={styles.cardContent}>
                    <H3 style={[styles.cardTitle, variant === 'teal' && { color: Colors.neutral.white }]}>{title}</H3>
                    <Body style={[styles.cardSubtitle, variant === 'teal' && { color: Colors.neutral.lightGray, opacity: 0.9 }]}>{subtitle}</Body>

                    <View style={[styles.cardButton, variant === 'teal' ? styles.cardButtonTeal : styles.cardButtonLight]}>
                        <Text style={[styles.cardButtonText, variant === 'teal' ? { color: Colors.primary.dark } : { color: Colors.primary.dark }]}>{buttonText}</Text>
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.primary.main,
        borderRadius: 24,
        overflow: 'hidden',
        height: 140, // Slightly more compact
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardLight: {
        backgroundColor: Colors.neutral.white,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    cardImageContainer: {
        width: '32%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: Spacing.m,
        justifyContent: 'center',
    },
    cardTitle: {
        color: Colors.neutral.white,
        marginBottom: 4,
        fontSize: 17,
        fontWeight: '600',
    },
    cardSubtitle: {
        color: Colors.neutral.lightGray,
        marginBottom: Spacing.m,
        fontSize: 13,
        lineHeight: 18,
    },
    cardButton: {
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
    },
    cardButtonTeal: {
        backgroundColor: Colors.neutral.white,
    },
    cardButtonLight: {
        backgroundColor: Colors.primary.light,
    },
    cardButtonText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
});
