import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { AdminUser, AuthService } from '@/src/services/AuthService';
import { useAdminAuth } from '@/src/context/AdminAuthContext';

export default function UserManagementScreen() {
    const router = useRouter();
    const { user: currentUser } = useAdminAuth();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'superuser'>('admin');
    const [creating, setCreating] = useState(false);

    // Reset Password State
    const [resetVisible, setResetVisible] = useState(false);
    const [resetTarget, setResetTarget] = useState<string | null>(null);
    const [resetPass, setResetPass] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const list = await AuthService.getUsers();
            setUsers(list);
        } catch (error) {
            console.error(error);
            Alert.alert('Feil', 'Kunne ikke laste brukere');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!newUsername || !newPassword) {
            Alert.alert('Mangler info', 'Brukernavn og passord må fylles ut.');
            return;
        }
        setCreating(true);
        try {
            const res = await AuthService.createUser(newUsername, newPassword, newRole);
            if (res.success) {
                Alert.alert('Suksess', 'Bruker opprettet!');
                setModalVisible(false);
                setNewUsername('');
                setNewPassword('');
                loadUsers();
            } else {
                Alert.alert('Feil', res.error || 'Kunne ikke opprette bruker.');
            }
        } catch (error) {
            Alert.alert('Feil', 'En uventet feil oppstod.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = (username: string) => {
        if (username === currentUser?.username) {
            Alert.alert('Hei!', 'Du kan ikke slette deg selv.');
            return;
        }

        Alert.alert('Slette bruker?', `Er du sikker på at du vil slette ${username}?`, [
            { text: 'Avbryt', style: 'cancel' },
            {
                text: 'Slett',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await AuthService.deleteUser(username);
                        loadUsers();
                    } catch (error) {
                        Alert.alert('Feil', 'Kunne ikke slette bruker.');
                    }
                }
            }
        ]);
    };

    const confirmReset = async () => {
        if (!resetTarget || !resetPass) return;
        try {
            await AuthService.resetPassword(resetTarget, resetPass);
            Alert.alert('Passord endret', `Nytt passord satt for ${resetTarget}.`);
            setResetVisible(false);
            setResetPass('');
            setResetTarget(null);
        } catch (error) {
            Alert.alert('Feil', 'Kunne ikke endre passord.');
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Brukere</H2>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={24} color={Colors.primary.main} />
                    <Body style={styles.infoText}>
                        Superbrukere har tilgang til alt. Admin-brukere har tilgang til innhold, men ikke system-verktøy.
                    </Body>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary.deep} />
                ) : (
                    users.map((u, i) => (
                        <View key={i} style={styles.userCard}>
                            <View style={styles.userIconInfo}>
                                <View style={[styles.avatar, { backgroundColor: u.role === 'superuser' ? '#FFF3E0' : '#E3F2FD' }]}>
                                    <Ionicons
                                        name={u.role === 'superuser' ? 'key' : 'person'}
                                        size={20}
                                        color={u.role === 'superuser' ? '#EF6C00' : '#1565C0'}
                                    />
                                </View>
                                <View>
                                    <H3 style={styles.userName}>{u.username} {u.username === currentUser?.username && '(Deg)'}</H3>
                                    <Body style={styles.userRole}>{u.role.toUpperCase()}</Body>
                                </View>
                            </View>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => {
                                        setResetTarget(u.username);
                                        setResetVisible(true);
                                    }}
                                >
                                    <Ionicons name="refresh-circle" size={28} color={Colors.neutral.darkGray} />
                                </TouchableOpacity>

                                {u.username !== currentUser?.username && (
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(u.username)}>
                                        <Ionicons name="trash-outline" size={24} color="#E53935" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            {/* Create User Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <H3 style={styles.modalTitle}>Ny Bruker</H3>

                        <TextInput
                            style={styles.input}
                            placeholder="Brukernavn"
                            value={newUsername}
                            onChangeText={setNewUsername}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Passord"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />

                        <View style={styles.roleSelector}>
                            <TouchableOpacity
                                style={[styles.roleOption, newRole === 'admin' && styles.roleActive]}
                                onPress={() => setNewRole('admin')}
                            >
                                <Text style={[styles.roleText, newRole === 'admin' && styles.roleTextActive]}>Admin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleOption, newRole === 'superuser' && styles.roleActive]}
                                onPress={() => setNewRole('superuser')}
                            >
                                <Text style={[styles.roleText, newRole === 'superuser' && styles.roleTextActive]}>Superuser</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
                                <Text style={{ color: '#666' }}>Avbryt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCreateUser} style={styles.modalCreate} disabled={creating}>
                                {creating ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Opprett</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Reset Password Modal */}
            <Modal visible={resetVisible} animationType="fade" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <H3 style={styles.modalTitle}>Tilbakestill Passord for {resetTarget}</H3>
                        <Body style={{ marginBottom: 10, textAlign: 'center' }}>Skriv inn nytt passord.</Body>

                        <TextInput
                            style={styles.input}
                            placeholder="Nytt passord"
                            value={resetPass}
                            onChangeText={setResetPass}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => { setResetVisible(false); setResetPass(''); }} style={styles.modalCancel}>
                                <Text style={{ color: '#666' }}>Avbryt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmReset} style={styles.modalCreate}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Lagre</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.main },
    safeArea: { backgroundColor: Colors.background.main },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.m, paddingVertical: Spacing.s, borderBottomWidth: 1, borderBottomColor: '#eee' },
    backButton: { padding: 5 },
    pageTitle: { fontSize: 18, color: Colors.primary.deep },
    content: { padding: Spacing.m },
    infoBox: { flexDirection: 'row', padding: 16, backgroundColor: '#E3F2FD', borderRadius: 12, marginBottom: 20, alignItems: 'center' },
    infoText: { flex: 1, marginLeft: 10, color: '#1565C0', fontSize: 13 },

    userCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    userIconInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    userName: { fontSize: 16, fontWeight: '600', color: '#333' },
    userRole: { fontSize: 12, color: '#777', fontWeight: 'bold' },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    actionBtn: { padding: 8 },

    fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary.deep, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary.deep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: '85%', backgroundColor: 'white', borderRadius: 24, padding: 24, alignItems: 'center' },
    modalTitle: { fontSize: 20, marginBottom: 20, color: Colors.primary.deep },
    input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, fontSize: 16, backgroundColor: '#FAFAFA' },

    roleSelector: { flexDirection: 'row', width: '100%', gap: 12, marginBottom: 24 },
    roleOption: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center' },
    roleActive: { backgroundColor: Colors.primary.deep, borderColor: Colors.primary.deep },
    roleText: { color: '#666', fontWeight: '600' },
    roleTextActive: { color: 'white' },

    modalActions: { flexDirection: 'row', gap: 16, width: '100%' },
    modalCancel: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#F0F0F0', alignItems: 'center' },
    modalCreate: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.primary.deep, alignItems: 'center' }
});
