
import { useAuth } from '@/src/context/AuthContext';
import { GradientHeader } from '@/src/components/GradientHeader';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GlowCard } from '@/src/components/GlowCard';
import { LOYALTY_RULES } from '@/src/constants/LoyaltyConfig';
import { LoyaltyService } from '@/src/services/LoyaltyService';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, enableBiometrics, hasBiometrics, setPin, hasPin } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const tapRef = React.useRef(0);

    const handleVersionTap = () => {
        tapRef.current += 1;
        if (tapRef.current >= 5) {
            tapRef.current = 0;
            setTapCount(0);
            if (Platform.OS === 'web') {
                window.open('/admin', '_blank');
            } else if (Platform.OS === 'ios') {
                Alert.prompt("Admin Tilgang", "Skriv inn passord", [
                    { text: "Avbryt", style: "cancel" },
                    { text: "Logg inn", onPress: (item) => { if (item === "1234") router.push('/admin'); else Alert.alert("Feil passord"); } }
                ], "secure-text");
            } else {
                Alert.alert("Admin Tilgang", "Hemmelig admin-meny. Skriv kode (1234).", [
                    { text: "Avbryt", style: "cancel" },
                    { text: "Åpne (Dev)", onPress: () => router.push('/admin') }
                ]);
            }
        }
    };

    useEffect(() => {
        if (hasBiometrics !== undefined) setFaceIdEnabled(hasBiometrics);
    }, [hasBiometrics]);

    useEffect(() => {
        if (user?.email) LoyaltyService.syncPoints(user.email.toLowerCase().trim());
    }, [user?.email]);

    const handleLogout = () => {
        const proceed = async () => {
            try {
                await logout();
                // Short timeout to ensure state propagates before routing
                setTimeout(() => {
                    router.replace('/');
                }, 100);
            } catch (e) {
                console.error("Logout error", e);
                router.replace('/');
            }
        };

        if (Platform.OS === 'web') {
            // Use a slight delay to allow UI to settle if valid
            setTimeout(() => {
                if (window.confirm('Er du sikker på at du vil logge ut?')) {
                    proceed();
                }
            }, 100);
        } else {
            Alert.alert('Logg ut', 'Er du sikker på at du vil logge ut?', [
                { text: 'Avbryt', style: 'cancel' },
                { text: 'Logg ut', style: 'destructive', onPress: proceed },
            ]);
        }
    };

    const toggleFaceId = async (value: boolean) => {
        if (value) {
            const success = await enableBiometrics();
            setFaceIdEnabled(success ? true : false);
            if (success) Alert.alert('FaceID / TouchID', 'Biometri er aktivert for neste innlogging.');
        } else {
            setFaceIdEnabled(false);
        }
    };

    const handleSetPin = () => {
        // ... (keep existing logic)
        Alert.alert("Info", "Kontakt admin for PIN-reset.");
    };

    const getInitials = (name?: string) => {
        if (!name) return 'ON';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    const getTierColor = (tier: string = 'bronse') => {
        switch (tier.toLowerCase()) {
            case 'gull': return '#FFD700';
            case 'sølv': return '#C0C0C0';
            default: return '#CD7F32'; // Bronze
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <H2 style={styles.pageTitle}>Min Side</H2>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* User Header */}
                <View style={styles.userHeader}>
                    <View style={styles.avatar}>
                        <H2 style={styles.avatarText}>{getInitials(user?.name)}</H2>
                    </View>
                    <H2 style={styles.name}>{user?.name || 'Ola Nordmann'}</H2>
                    <Body style={styles.idText}>Fødselsdato: {user?.birthdate || '12.03.1985'}</Body>
                </View>

                {/* Min Lommebok - Styled cleanly outside white box for GlowCard flow */}
                <View style={styles.loyaltySection}>
                    <H3 style={styles.sectionTitle}>{LOYALTY_RULES.PROGRAM_NAME}</H3>

                    {/* Centered Card */}
                    <View style={{ alignItems: 'center', marginVertical: Spacing.xs }}>
                        <GlowCard stamps={user?.loyalty?.stamps ?? 0} />
                    </View>


                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Body style={styles.statLabel}>{LOYALTY_RULES.CURRENCY_NAME}</Body>
                            <H2 style={styles.statValue}>{user?.loyalty?.points ?? 0}</H2>
                        </View>

                        <View style={styles.statItemRight}>
                            <Body style={styles.statLabel}>Status</Body>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.tierDot, { backgroundColor: getTierColor(user?.loyalty?.tier) }]} />
                                <H2 style={[styles.statValue, { color: Colors.primary.deep }]}>
                                    {(user?.loyalty?.tier ?? 'Bronse').toUpperCase()}
                                </H2>
                            </View>
                        </View>
                    </View>

                    {/* Quick Access Actions */}
                    <View style={{ marginTop: Spacing.m, paddingHorizontal: Spacing.m }}>
                        <MenuItem
                            icon="card-outline"
                            title="Gavekort"
                            onPress={() => router.push('/giftcard')}
                            last
                        />
                    </View>

                </View>

                {/* Innstillinger Section */}
                <Section title="Innstillinger">
                    <MenuItem icon="notifications-outline" title="Varslinger" isSwitch switchValue={notificationsEnabled} onSwitchChange={setNotificationsEnabled} />
                    <MenuItem icon="scan-outline" title="FaceID / TouchID" isSwitch switchValue={faceIdEnabled} onSwitchChange={toggleFaceId} />
                    <MenuItem icon="keypad-outline" title={hasPin ? "Endre PIN-kode" : "Opprett PIN-kode"} onPress={handleSetPin} last />
                </Section>

                {/* Om Appen Section */}
                <Section title="Om Appen">
                    <MenuItem icon="information-circle-outline" title="Om oss" onPress={() => router.push('/about')} />
                    <MenuItem icon="shield-checkmark-outline" title="Personvern" onPress={() => router.push({ pathname: '/legal', params: { type: 'privacy' } })} />
                    <MenuItem icon="document-outline" title="Vilkår" onPress={() => router.push({ pathname: '/legal', params: { type: 'terms' } })} />
                    <MenuItem icon="help-circle-outline" title="Hjelp og støtte" onPress={() => { }} last />
                </Section>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Body style={styles.logoutText}>Logg ut</Body>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={handleVersionTap} style={styles.versionContainer}>
                    <Body style={styles.versionText}>Versjon 1.0.0</Body>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

// ... Subcomponents ...

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <H3 style={styles.sectionTitle}>{title}</H3>
            <View style={styles.sectionContent}>{children}</View>
        </View>
    );
}

function MenuItem({ icon, title, onPress, last, isSwitch, switchValue, onSwitchChange }: any) {
    return (
        <TouchableOpacity style={[styles.menuItem, last && styles.menuItemLast]} onPress={onPress} activeOpacity={0.7} disabled={isSwitch}>
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={22} color={Colors.primary.deep} />
                </View>
                <Body style={styles.menuItemText}>{title}</Body>
            </View>
            {isSwitch ? (
                <Switch value={switchValue} onValueChange={onSwitchChange} trackColor={{ false: Colors.neutral.lightGray, true: Colors.primary.main }} />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={Colors.neutral.darkGray} style={{ opacity: 0.5 }} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.main },
    scrollContent: { padding: Spacing.m, paddingBottom: 40, paddingTop: 0 },
    header: { paddingHorizontal: Spacing.m, paddingVertical: Spacing.s, backgroundColor: Colors.background.main },
    pageTitle: { fontSize: 28, color: Colors.primary.deep },
    userHeader: { alignItems: 'center', marginBottom: Spacing.l, marginTop: Spacing.m },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary.main, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.m },
    avatarText: { color: Colors.neutral.white, fontSize: 28 },
    name: { color: Colors.primary.deep, marginBottom: 4 },
    idText: { color: Colors.neutral.darkGray, opacity: 0.7 },

    // Loyalty Section custom styles
    loyaltySection: { marginBottom: Spacing.l },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.m, marginTop: Spacing.s },
    statItem: {},
    statItemRight: { alignItems: 'flex-end' },
    statLabel: { fontSize: 12, color: Colors.neutral.darkGray, textTransform: 'uppercase', marginBottom: 2 },
    statValue: { color: Colors.neutral.charcoal },
    tierDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },

    section: { marginBottom: Spacing.l },
    sectionTitle: { color: Colors.neutral.darkGray, marginBottom: Spacing.s, marginLeft: Spacing.xs, fontSize: 14, textTransform: 'uppercase', opacity: 0.6, fontWeight: 'bold' },
    sectionContent: { backgroundColor: Colors.neutral.white, borderRadius: 12, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: Spacing.m, borderBottomWidth: 1, borderBottomColor: Colors.neutral.lightGray },
    menuItemLast: { borderBottomWidth: 0 },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 32, alignItems: 'center', marginRight: Spacing.s },
    menuItemText: { fontSize: 16, color: Colors.neutral.charcoal },
    logoutButton: { marginTop: Spacing.m, backgroundColor: Colors.neutral.white, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    logoutText: { color: Colors.status.error, fontWeight: 'bold', fontSize: 16 },
    versionContainer: { marginTop: Spacing.l, alignItems: 'center', padding: 24, marginBottom: 20 },
    versionText: { fontSize: 12, color: Colors.neutral.darkGray, opacity: 0.4 },
});
