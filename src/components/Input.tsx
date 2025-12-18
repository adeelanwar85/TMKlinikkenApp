import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/Theme';
import { Body } from '../theme/Typography';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Body style={styles.label}>{label}</Body>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.focused,
                    error ? styles.errorBorder : null,
                    style
                ]}
                placeholderTextColor={Colors.neutral.darkGray + '80'} // 50% opacity
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && <Body style={styles.errorText}>{error}</Body>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.m,
    },
    label: {
        marginBottom: Spacing.xs,
        fontSize: 14,
        color: Colors.neutral.darkGray,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.neutral.lightGray,
        borderRadius: 8,
        paddingHorizontal: Spacing.m,
        fontSize: 16,
        fontFamily: Typography.fontFamily.body,
        color: Colors.neutral.charcoal,
        backgroundColor: Colors.neutral.white,
    },
    focused: {
        borderColor: Colors.primary.main,
        borderWidth: 2,
    },
    errorBorder: {
        borderColor: Colors.status.error,
    },
    errorText: {
        color: Colors.status.error,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
});
