import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { Colors, Typography } from './Theme';

interface CustomTextProps extends TextProps {
    children: React.ReactNode;
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export const H1 = ({ children, style, color = Colors.neutral.charcoal, align = 'left', ...props }: CustomTextProps) => {
    return (
        <Text style={[styles.h1, { color, textAlign: align }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H2 = ({ children, style, color = Colors.neutral.charcoal, align = 'left', ...props }: CustomTextProps) => {
    return (
        <Text style={[styles.h2, { color, textAlign: align }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H3 = ({ children, style, color = Colors.neutral.charcoal, align = 'left', ...props }: CustomTextProps) => {
    return (
        <Text style={[styles.h3, { color, textAlign: align }, style]} {...props}>
            {children}
        </Text>
    );
};

export const Body = ({ children, style, color = Colors.neutral.darkGray, align = 'left', ...props }: CustomTextProps) => {
    return (
        <Text style={[styles.body, { color, textAlign: align }, style]} {...props}>
            {children}
        </Text>
    );
};

export const Caption = ({ children, style, color = Colors.neutral.darkGray, align = 'left', ...props }: CustomTextProps) => {
    return (
        <Text style={[styles.caption, { color, textAlign: align }, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: Typography.size.h1,
        fontWeight: 'bold', // 700
        fontFamily: Typography.fontFamily.heading,
    },
    h2: {
        fontSize: Typography.size.h2,
        fontWeight: 'bold', // 700
        fontFamily: Typography.fontFamily.heading,
    },
    h3: {
        fontSize: Typography.size.h3,
        fontWeight: '500', // Medium
        fontFamily: Typography.fontFamily.heading,
    },
    body: {
        fontSize: Typography.size.body,
        fontWeight: '400', // Regular
        fontFamily: Typography.fontFamily.body,
    },
    caption: {
        fontSize: Typography.size.caption,
        fontWeight: '300', // Light
        fontFamily: Typography.fontFamily.body,
    },
});
