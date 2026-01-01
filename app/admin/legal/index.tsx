import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { LegalService, LegalType } from '@/src/services/LegalService';

export default function LegalEditorScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<LegalType>('privacy');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadContent(activeTab);
    }, [activeTab]);

    const loadContent = async (type: LegalType) => {
        setLoading(true);
        try {
            const doc = await LegalService.getLegalText(type);
            setContent(doc.content);
        } catch (error) {
            Alert.alert('Feil', 'Kunne ikke laste innhold');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            await LegalService.saveLegalText(activeTab, content);
            Alert.alert('Lagret', 'Innholdet er oppdatert.');
        } catch (error) {
            Alert.alert('Feil', 'Kunne ikke lagre.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Juridisk Redaktør</H2>
                    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveHeaderButton}>
                        {saving ? <ActivityIndicator color="white" /> : <Ionicons name="checkmark" size={24} color="white" />}
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
                        onPress={() => setActiveTab('privacy')}
                    >
                        <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>Personvern</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
                        onPress={() => setActiveTab('terms')}
                    >
                        <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>Vilkår</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={24} color={Colors.primary.main} />
                        <Body style={styles.infoText}>
                            Her kan du redigere appens juridiske tekster. Teksten støtter enkel Markdown (overskrifter, lister).
                        </Body>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.primary.deep} style={{ marginTop: 50 }} />
                    ) : (
                        <TextInput
                            style={styles.editor}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            textAlignVertical="top"
                            placeholder="Skriv inn tekst her..."
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.main },
    safeArea: { backgroundColor: Colors.background.main, zIndex: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.m, paddingVertical: Spacing.s, borderBottomWidth: 1, borderBottomColor: '#eee' },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -Spacing.s },
    pageTitle: { fontSize: 18, color: Colors.primary.deep, fontWeight: '600' },
    saveHeaderButton: { width: 40, height: 40, backgroundColor: Colors.primary.deep, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

    tabContainer: { flexDirection: 'row', paddingHorizontal: Spacing.m, marginBottom: 10, marginTop: 10, gap: 10 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8 },
    activeTab: { backgroundColor: Colors.primary.deep },
    tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
    activeTabText: { color: 'white' },

    content: { padding: Spacing.m },
    infoBox: { flexDirection: 'row', padding: 16, backgroundColor: '#E3F2FD', borderRadius: 12, marginBottom: 20, alignItems: 'center' },
    infoText: { flex: 1, marginLeft: 10, color: '#1565C0', fontSize: 13 },

    editor: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        minHeight: 400,
        borderWidth: 1,
        borderColor: '#EEE',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        lineHeight: 24
    }
});
