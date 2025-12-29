import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { PRICES } from '@/src/constants/Prices';
import { ContentService } from '@/src/services/ContentService';

export default function AdminScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleBack = () => router.back();

    const handleSeedData = async () => {
        Alert.alert(
            "Last opp data?",
            "Dette vil overskrive data i skyen med de lokale prislistene (Prices.ts). Er du sikker?",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Last opp",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // Prepare data: Convert image require numbers to null or strings if needed
                            // For Firestore, we can't store 'require(...)' numbers directly easily if we expect URLs.
                            // For now, let's strip the image/icon field or handle it carefully.
                            const cleanData = PRICES.map(cat => {
                                const { image, ...rest } = cat;
                                return { ...rest, image: null }; // Uploading images is a separate task (Storage)
                            });

                            await ContentService.seedInitialData(cleanData);
                            Alert.alert("Suksess", "Prislisten er lastet opp til skyen! ☁️");
                        } catch (error) {
                            Alert.alert("Feil", "Kunne ikke laste opp data: " + error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Admin Dashboard 🛠️</H2>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.introContainer}>
                    <Body style={styles.introText}>
                        Velkommen til kontrollpanelet. Her kan du administrere innholdet i appen.
                    </Body>
                </View>

                {/* Dashboard Options */}
                <H3 style={styles.sectionTitle}>Innhold</H3>

                <TouchableOpacity style={styles.card} onPress={() => { }} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="pricetags" size={24} color="#1565C0" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Behandlinger & Priser</H3>
                        <Body style={styles.cardSubtitle}>Rediger prislisten</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => { }} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                        <Ionicons name="time" size={24} color="#E65100" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Åpningstider</H3>
                        <Body style={styles.cardSubtitle}>Endre åpningstider</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <H3 style={styles.sectionTitle}>Kommunikasjon</H3>

                <TouchableOpacity style={styles.card} onPress={() => { }} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="notifications" size={24} color="#2E7D32" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Push-varsel</H3>
                        <Body style={styles.cardSubtitle}>Send melding til alle</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <H3 style={styles.sectionTitle}>System</H3>

                <TouchableOpacity style={styles.card} onPress={handleSeedData} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="cloud-upload" size={24} color="#C62828" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Last opp Start-data</H3>
                        <Body style={styles.cardSubtitle}>Synkroniser lokale filer til skyen</Body>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.primary.main} />
                    ) : (
                        <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                    )}
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
    safeArea: {
        backgroundColor: Colors.background.main,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -Spacing.s,
    },
    pageTitle: {
        fontSize: 20,
        color: Colors.primary.deep,
        fontWeight: '600',
    },
    content: {
        padding: Spacing.m,
    },
    introContainer: {
        marginBottom: Spacing.l,
    },
    introText: {
        fontSize: 16,
        color: Colors.neutral.darkGray,
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
        marginBottom: Spacing.m,
        marginTop: Spacing.m,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        color: Colors.primary.deep,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.neutral.darkGray, // Fixed mediumGray -> darkGray
        opacity: 0.7,
    },
});
