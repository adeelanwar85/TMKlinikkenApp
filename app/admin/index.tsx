import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { ADMIN_MENU } from '@/src/config/Menus';


import { useAdminAuth } from '@/src/context/AdminAuthContext';

export default function AdminScreen() {
    const router = useRouter();
    const { isSuperuser, logout } = useAdminAuth();

    const handleBack = () => router.back();

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Admin Dashboard 🛠️</H2>
                    <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
                        <Ionicons name="log-out-outline" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.introContainer}>
                    <Body style={styles.introText}>
                        Velkommen til kontrollpanelet. Her kan du administrere innholdet i appen.
                    </Body>
                </View>

                {/* Dashboard Options */}

                {/* Content Section */}
                <H3 style={styles.sectionTitle}>Innhold & Struktur</H3>
                {ADMIN_MENU.filter(item => item.section === 'content').map(item => (
                    <MenuCard key={item.id} item={item} onPress={() => router.push(item.route as any)} />
                ))}

                {/* Operations Section */}
                <H3 style={styles.sectionTitle}>Drift & Kommunikasjon</H3>
                {ADMIN_MENU.filter(item => item.section === 'operations').map(item => (
                    <MenuCard key={item.id} item={item} onPress={() => router.push(item.route as any)} />
                ))}

                {/* System Section (Superuser) */}
                {isSuperuser && (
                    <>
                        <H3 style={styles.sectionTitle}>System & Tilgang</H3>
                        {ADMIN_MENU.filter(item => item.section === 'system').map(item => (
                            <MenuCard key={item.id} item={item} onPress={() => router.push(item.route as any)} />
                        ))}

                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => router.push('/admin/seed')} style={{ padding: 10 }}>
                                <Body style={{ color: Colors.neutral.darkGray, fontSize: 12, opacity: 0.5 }}>
                                    Database-verktøy (Seeding)
                                </Body>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

            </ScrollView>
        </View>
    );
}

function MenuCard({ item, onPress }: { item: any, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.cardContent}>
                <H3 style={styles.cardTitle}>{item.title}</H3>
                <Body style={styles.cardSubtitle}>{item.subtitle}</Body>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
        </TouchableOpacity>
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
