import { TREATMENT_MENU } from '@/src/constants/Menu';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TreatmentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const treatment = TREATMENT_MENU.find(item => item.id === id);

    if (!treatment || !treatment.details) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.neutral.charcoal} />
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <Text>Fant ikke behandlingen.</Text>
                </View>
            </View>
        );
    }

    const { details } = treatment;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    {details.heroImage ? (
                        <Image source={{ uri: details.heroImage }} style={styles.heroImage} resizeMode="cover" />
                    ) : (
                        <Image source={treatment.image} style={styles.heroImage} resizeMode="cover" />
                    )}

                    <TouchableOpacity
                        style={[styles.backButtonAbsolute, { top: insets.top + 10 }]}
                        onPress={() => router.back()}
                    >
                        <View style={styles.backButtonCircle}>
                            <Ionicons name="arrow-back" size={24} color={Colors.neutral.charcoal} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <H1 style={styles.pageTitle}>{treatment.title}</H1>
                    {details.intro && (
                        <Body style={styles.introText}>{details.intro}</Body>
                    )}

                    <View style={styles.divider} />

                    {details.sections.map((section, index) => (
                        <View key={index} style={styles.section}>
                            <H3 style={styles.sectionTitle}>{section.title}</H3>

                            {section.type === 'text' && section.content && (
                                <Body style={styles.sectionText}>{section.content}</Body>
                            )}

                            {section.type === 'list' && section.listItems && (
                                <View style={styles.listContainer}>
                                    {section.listItems.map((item, i) => (
                                        <View key={i} style={styles.listItem}>
                                            <View style={styles.bullet} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.listItemLabel}>{item.label}</Text>
                                                {item.value && <Text style={styles.listItemValue}>{item.value}</Text>}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/booking')}>
                    <Text style={styles.bookButtonText}>Bestill time nå</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8', // Slightly off-white background for contrast
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: Spacing.m,
    },
    backButton: {
        padding: 8,
    },
    backButtonAbsolute: {
        position: 'absolute',
        top: 50,
        left: Spacing.m,
        zIndex: 10,
    },
    backButtonCircle: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    heroContainer: {
        width: width,
        height: 380, // Taller hero for impact
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
        justifyContent: 'flex-end',
        padding: Spacing.l,
    },
    heroTitle: {
        display: 'none',
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.neutral.charcoal, // Or primary.deep
        marginBottom: Spacing.m,
        marginTop: Spacing.s,
    },
    contentContainer: {
        paddingHorizontal: Spacing.m,
        paddingTop: Spacing.l,
        paddingBottom: Spacing.xl,
        backgroundColor: '#F8F8F8',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -40, // More overlap
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    introText: {
        fontSize: 18,
        lineHeight: 30,
        color: '#4A4A4A',
        marginBottom: Spacing.l,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: Spacing.m,
    },
    section: {
        marginBottom: Spacing.m,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: Spacing.l,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 22,
        color: Colors.primary.deep,
        marginBottom: Spacing.m,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    sectionText: {
        fontSize: 16,
        lineHeight: 26,
        color: Colors.neutral.darkGray,
    },
    listContainer: {
        marginTop: Spacing.xs,
        gap: 16,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary.deep,
        marginTop: 9,
        marginRight: 12,
    },
    listItemLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    listItemValue: {
        fontSize: 14,
        color: Colors.primary.deep, // Accent color for values/prices
        marginTop: 4,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: Spacing.m,
        paddingHorizontal: Spacing.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    bookButton: {
        backgroundColor: Colors.primary.deep,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
