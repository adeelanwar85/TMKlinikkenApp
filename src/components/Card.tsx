import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Shadows, Spacing } from '../theme/Theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card = ({ children, style, onPress, variant = 'elevated' }: CardProps) => {
    const Container = onPress ? TouchableOpacity : View;

    const getStyle = () => {
        switch (variant) {
            case 'elevated':
                return [styles.card, styles.elevated];
            case 'outlined':
                return [styles.card, styles.outlined];
            case 'flat':
                return [styles.card, styles.flat];
            default:
                return [styles.card, styles.elevated];
        }
    };

    return (
        <Container
            activeOpacity={onPress ? 0.8 : 1}
            style={[getStyle(), style]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background.card,
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.m,
    },
    elevated: {
        ...Shadows.card,
    },
    outlined: {
        borderWidth: 1,
        borderColor: Colors.neutral.lightGray,
    },
    flat: {
        backgroundColor: Colors.neutral.cream,
    },
});
