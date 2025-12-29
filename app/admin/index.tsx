import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';


export default function AdminScreen() {
    const router = useRouter();


    const handleBack = () => router.back();



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
                <H3 style={styles.sectionTitle}>Innhold & Struktur</H3>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/content-editor')} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="document-text" size={24} color="#1565C0" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Behandlingssider (CMS)</H3>
                        <Body style={styles.cardSubtitle}>Rediger tekst, bilder og innhold</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/campaigns')} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                        <Ionicons name="megaphone" size={24} color="#7B1FA2" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Kampanjer</H3>
                        <Body style={styles.cardSubtitle}>Administrer tilbud og nyheter</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/employees')} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#E0F2F1' }]}>
                        <Ionicons name="people" size={24} color="#00796B" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Ansatte</H3>
                        <Body style={styles.cardSubtitle}>Rediger team-oversikten</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <H3 style={styles.sectionTitle}>Drift & Kommunikasjon</H3>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/notifications')} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="notifications" size={24} color="#2E7D32" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Push-varsel</H3>
                        <Body style={styles.cardSubtitle}>Send melding til alle kunder</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/config')} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="settings" size={24} color="#C62828" />
                    </View>
                    <View style={styles.cardContent}>
                        <H3 style={styles.cardTitle}>Drift & Info</H3>
                        <Body style={styles.cardSubtitle}>Åpningstider, nød-banner m.m.</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
                </TouchableOpacity>

                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.push('/admin/seed')} style={{ padding: 10 }}>
                        <Body style={{ color: Colors.neutral.darkGray, fontSize: 12, opacity: 0.5 }}>
                            Database-verktøy (Klikk for å laste opp standardinnhold)
                        </Body>
                    </TouchableOpacity>
                </View>



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
