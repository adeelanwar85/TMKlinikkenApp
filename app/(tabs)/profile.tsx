
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
        // setTapCount(tapRef.current); // Removed state update to prevent re-render glitches

        if (tapRef.current >= 5) {
            // Reset
            tapRef.current = 0;
            setTapCount(0);

            if (Platform.OS === 'web') {
                // Open Admin in a new tab as requested
                window.open('/admin', '_blank');
            } else if (Platform.OS === 'ios') {
                Alert.prompt(
                    "Admin Tilgang",
                    "Skriv inn passord",
                    [
                        { text: "Avbryt", style: "cancel" },
                        {
                            text: "Logg inn",
                            onPress: (item: string | undefined) => {
                                if (item === "1234") router.push('/admin');
                                else Alert.alert("Feil passord");
                            }
                        }
                    ],
                    "secure-text"
                );
            } else {
                // Android
                Alert.alert(
                    "Admin Tilgang",
                    "Hemmelig admin-meny. Skriv kode (1234).",
                    [
                        { text: "Avbryt", style: "cancel" },
                        { text: "Åpne (Dev)", onPress: () => router.push('/admin') }
                    ]
                );
            }
        }
    };

    useEffect(() => {
        if (hasBiometrics !== undefined) {
            setFaceIdEnabled(hasBiometrics);
        }
    }, [hasBiometrics]);

    // Sync Loyalty Points on Mount
    useEffect(() => {
        if (user?.email) {
            LoyaltyService.syncPoints(user.email.toLowerCase().trim())
                .then(res => {
                    if (res?.updated) {
                        console.log("Points synced!");
                        // Optional: refreshUser() if AuthContext supports it to show new points immediately 
                        // For now, next app load or re-login triggers context update, 
                        // but we might want to force update local state or Context.
                        // Simplest: The user sees it next time or we assume real-time listener in Context works?
                        // AuthContext usually doesn't listen real-time unless we set it up.
                        // But for now, this logic is safer.
                    }
                });
        }
    }, [user?.email]);

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm('Er du sikker på at du vil logge ut?');
            if (confirm) {
                await logout();
                router.replace('/');
            }
            return;
        }

        Alert.alert('Logg ut', 'Er du sikker på at du vil logge ut?', [
            { text: 'Avbryt', style: 'cancel' },
            {
                text: 'Logg ut',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/');
                }
            },
        ]);
    };

    const toggleFaceId = async (value: boolean) => {
        if (value) {
            const success = await enableBiometrics();
            if (success) {
                setFaceIdEnabled(true);
                Alert.alert('FaceID / TouchID', 'Biometri er aktivert for neste innlogging.');
            } else {
                setFaceIdEnabled(false);
            }
        } else {
            setFaceIdEnabled(false);
        }
    };

    const handleSetPin = () => {
        if (Platform.OS === 'ios') {
            Alert.prompt(
                "Velg PIN-kode",
                "Skriv inn 4 siffer",
                [
                    { text: "Avbryt", style: "cancel" },
                    {
                        text: "Lagre",
                        onPress: (pin: string | undefined) => {
                            if (pin && pin.length === 4 && /^\d+$/.test(pin)) {
                                setPin(pin);
                                Alert.alert("Suksess", "PIN-kode er lagret.");
                            } else {
                                Alert.alert("Feil", "PIN må være 4 siffer.");
                            }
                        }
                    }
                ],
                "secure-text"
            );
        } else if (Platform.OS === 'web') {
            const pin = window.prompt("Velg PIN-kode (4 siffer):");
            if (pin) {
                if (pin.length === 4 && /^\d+$/.test(pin)) {
                    setPin(pin);
                    alert("PIN-kode lagret.");
                } else {
                    alert("PIN må være 4 siffer.");
                }
            }
        } else {
            // Placeholder for Android until custom modal is built
            Alert.alert("Beklager", "PIN-oppsett støttes foreløpig best på iOS (og Web).");
        }
    };

    // Helper to get initials
    const getInitials = (name?: string) => {
        if (!name) return 'ON';
        const parts = name.trim().split(/\s+/); // Split by any whitespace and trim
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
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



                {/* Min Lommebok Section */}
                <Section title={LOYALTY_RULES.PROGRAM_NAME}>
                    <View style={{ padding: Spacing.s }}>
                        <GlowCard stamps={user?.loyalty?.stamps ?? 0} />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: Spacing.m,
                            paddingHorizontal: Spacing.s,
                            paddingBottom: Spacing.s
                        }}>
                            <View>
                                <Body style={{ fontSize: 12, color: Colors.neutral.darkGray, textTransform: 'uppercase' }}>
                                    {LOYALTY_RULES.CURRENCY_NAME}
                                </Body>
                                <H2 style={{ color: Colors.neutral.charcoal }}>
                                    {user?.loyalty?.points ?? 0}
                                </H2>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                                <Body style={{ fontSize: 12, color: Colors.neutral.darkGray, textTransform: 'uppercase' }}>
                                    Status
                                </Body>
                                <H2 style={{ color: Colors.primary.deep }}>
                                    {(user?.loyalty?.tier ?? 'Bronse').toUpperCase()} 🥉
                                </H2>
                            </View>
                        </View>
                    </View>
                </Section>

                {/* Innstillinger Section */}
                <Section title="Innstillinger">
                    <MenuItem
                        icon="notifications-outline"
                        title="Varslinger"
                        isSwitch
                        switchValue={notificationsEnabled}
                        onSwitchChange={setNotificationsEnabled}
                    />
                    <MenuItem
                        icon="scan-outline"
                        title="FaceID / TouchID"
                        isSwitch
                        switchValue={faceIdEnabled}
                        onSwitchChange={toggleFaceId}
                    />
                    <MenuItem
                        icon="keypad-outline"
                        title={hasPin ? "Endre PIN-kode" : "Opprett PIN-kode"}
                        onPress={handleSetPin}
                        last
                    />
                </Section>

                {/* Om Appen Section */}
                <Section title="Om Appen">
                    <MenuItem
                        icon="information-circle-outline"
                        title="Om oss"
                        onPress={() => router.push('/about')}
                    />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        title="Personvern"
                        onPress={() => router.push({ pathname: '/legal', params: { type: 'privacy' } })}
                    />
                    <MenuItem
                        icon="document-outline"
                        title="Vilkår"
                        onPress={() => router.push({ pathname: '/legal', params: { type: 'terms' } })}
                    />
                    <MenuItem icon="help-circle-outline" title="Hjelp og støtte" onPress={() => { }} last />
                </Section>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Body style={styles.logoutText}>Logg ut</Body>
                </TouchableOpacity>

                {/* Admin Trigger - Large Hit Area */}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={handleVersionTap}
                    style={styles.versionContainer}
                >
                    <Body style={styles.versionText}>
                        Versjon 1.0.0
                        {tapCount > 0 && <Text style={{ color: 'red', fontWeight: 'bold' }}> ({tapCount})</Text>}
                    </Body>
                </TouchableOpacity>


            </ScrollView>
        </View>
    );
}

// Reusable Components

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <H3 style={styles.sectionTitle}>{title}</H3>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );
}

function MenuItem({
    icon,
    title,
    onPress,
    last,
    isSwitch,
    switchValue,
    onSwitchChange
}: {
    icon: any,
    title: string,
    onPress?: () => void,
    last?: boolean,
    isSwitch?: boolean,
    switchValue?: boolean,
    onSwitchChange?: (val: boolean) => void
}) {
    const content = (
        <>
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={22} color={Colors.primary.deep} />
                </View>
                <Body style={styles.menuItemText}>{title}</Body>
            </View>

            {isSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: Colors.neutral.lightGray, true: Colors.primary.main }}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={Colors.neutral.darkGray} style={{ opacity: 0.5 }} />
            )}
        </>
    );

    if (isSwitch) {
        return (
            <View style={[styles.menuItem, last && styles.menuItemLast]}>
                {content}
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.menuItem, last && styles.menuItemLast]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {content}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollContent: {
        padding: Spacing.m,
        paddingBottom: 40,
        paddingTop: 0,
    },
    header: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary.deep,
    },
    userHeader: {
        alignItems: 'center',
        marginBottom: Spacing.l,
        marginTop: Spacing.m,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    avatarText: {
        color: Colors.neutral.white,
        fontSize: 28,
    },
    name: {
        color: Colors.primary.deep,
        marginBottom: 4,
    },
    idText: {
        color: Colors.neutral.darkGray,
        opacity: 0.7,
    },
    section: {
        marginBottom: Spacing.l,
    },
    sectionTitle: {
        color: Colors.neutral.darkGray,
        marginBottom: Spacing.s,
        marginLeft: Spacing.xs,
        fontSize: 14,
        textTransform: 'uppercase',
        opacity: 0.6,
        fontWeight: 'bold',
    },
    sectionContent: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: Spacing.s,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    logoutButton: {
        marginTop: Spacing.m,
        backgroundColor: Colors.neutral.white,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: Colors.status.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionContainer: {
        marginTop: Spacing.l,
        alignItems: 'center',
        padding: 24, // HUGE hit area
        marginBottom: 20
    },
    versionText: {
        fontSize: 12,
        color: Colors.neutral.darkGray,
        opacity: 0.4,
    },
});
