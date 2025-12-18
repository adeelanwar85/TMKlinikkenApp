import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, enableBiometrics, hasBiometrics } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);

    useEffect(() => {
        if (hasBiometrics !== undefined) {
            setFaceIdEnabled(hasBiometrics);
        }
    }, [hasBiometrics]);

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
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* User Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <H2 style={styles.avatarText}>{getInitials(user?.name)}</H2>
                    </View>
                    <H2 style={styles.name}>{user?.name || 'Ola Nordmann'}</H2>
                    <Body style={styles.idText}>Fødselsdato: {user?.birthdate || '12.03.1985'}</Body>
                    <Body style={styles.idText}>{user?.phone}</Body>
                </View>

                {/* Min Helse Section */}
                <Section title="Min Helse">
                    <MenuItem icon="document-text-outline" title="Journal" onPress={() => { }} />
                    <MenuItem icon="medkit-outline" title="Resepter" onPress={() => { }} last />
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

                <Body style={styles.versionText}>Versjon 1.0.0</Body>

            </ScrollView>
        </SafeAreaView>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
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
    versionText: {
        textAlign: 'center',
        marginTop: Spacing.l,
        color: Colors.neutral.darkGray,
        opacity: 0.5,
        fontSize: 12,
    },
});
