
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../theme/Theme';

interface GradientHeaderProps {
    title?: string;
    heroTitle: string;
    heroSubtitle?: string;
    showBackButton?: boolean;
    headerRight?: React.ReactNode;
    onBack?: () => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
    title,
    heroTitle,
    heroSubtitle,
    showBackButton = true,
    headerRight,
    onBack,
    children,
    style
}) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={[Colors.primary.dark, Colors.primary.main]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
            >
                <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
                    <View style={styles.headerContent}>
                        {showBackButton ? (
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 40 }} />
                        )}

                        {title && <Text style={styles.headerTitle}>{title}</Text>}

                        {headerRight ? (
                            <View style={styles.headerRightContainer}>
                                {headerRight}
                            </View>
                        ) : (
                            <View style={{ width: 40 }} />
                        )}
                    </View>

                    <View style={styles.headerHero}>
                        <Text style={styles.heroTitle}>{heroTitle}</Text>
                        {heroSubtitle && (
                            <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* OVerlap Content */}
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    headerBackground: {
        height: 280,
        paddingHorizontal: Spacing.m,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerSafeArea: {
        flex: 1,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRightContainer: {
        width: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.9,
    },
    headerHero: {
        marginTop: Spacing.l,
        paddingHorizontal: Spacing.s,
    },
    heroTitle: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    contentContainer: {
        flex: 1,
        marginTop: -40, // overlap
    },
});
