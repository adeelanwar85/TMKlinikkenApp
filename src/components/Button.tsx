import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Shadows, Spacing, Typography } from '../theme/Theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}: ButtonProps) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.neutral.lightGray;
        switch (variant) {
            case 'primary':
                return Colors.primary.main;
            case 'secondary':
                return Colors.primary.dark;
            case 'outline':
            case 'text':
                return 'transparent';
            default:
                return Colors.primary.main;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.neutral.darkGray;
        switch (variant) {
            case 'primary':
            case 'secondary':
                return Colors.neutral.white;
            case 'outline':
                return Colors.primary.main;
            case 'text':
                return Colors.primary.dark;
            default:
                return Colors.neutral.white;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    borderColor: variant === 'outline' ? Colors.primary.main : 'transparent',
                    ...((variant === 'primary' && !disabled) ? Shadows.button : {}),
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text style={[
                        styles.text,
                        { color: getTextColor(), marginLeft: icon ? Spacing.s : 0 },
                        textStyle
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.l,
        borderRadius: 12, // From design spec
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontFamily: Typography.fontFamily.heading,
        fontSize: 16,
        fontWeight: '500', // Medium
    },
});
