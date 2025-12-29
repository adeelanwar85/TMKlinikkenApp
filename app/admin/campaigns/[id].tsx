import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentService } from '@/src/services/ContentService';
import { Campaign } from '@/src/constants/Campaigns';

export default function CampaignEditorScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [active, setActive] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

    useEffect(() => {
        if (!isNew && id) {
            loadCampaign();
        }
    }, [id]);

    const loadCampaign = async () => {
        // In a real app we might fetch single by ID or find in list. 
        // Since we don't have getCampaignById easily exposed except via getAll or direct doc ref (which Service has logic for internal collections),
        // we can fetch all and find, or just use the logic if we had a specific method.
        // Let's assume passed ID is valid doc ID.
        // Actually ContentService doesn't expose getCampaignById, let's just fetch all (cached usually) or add a specific method.
        // For MVP, fetch all is fine as number isn't huge.
        const all = await ContentService.getAllCampaigns();
        const found = all.find(c => c.id === id);
        if (found) {
            setTitle(found.title);
            setDescription(found.description);
            // Handle image logic: if it's a require number, we can't edit it easily as string, so just show nothing or placeholder string
            if (typeof found.imageUrl === 'string') {
                setImageUrl(found.imageUrl);
            }
            setActive(found.active);
            setDate(found.date);
        } else {
            Alert.alert("Feil", "Fant ikke kampanjen");
            router.back();
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Mangler info", "Tittel og beskrivelse må fylles ut.");
            return;
        }

        setSaving(true);
        try {
            const campaignData: Campaign = {
                id: isNew ? Date.now().toString() : (id as string),
                title,
                description,
                imageUrl: imageUrl || 'https://via.placeholder.com/300', // Fallback or empty
                date,
                active
            };

            await ContentService.saveCampaign(campaignData);
            Alert.alert("Suksess", "Kampanje lagret", [{ text: "OK", onPress: () => router.back() }]);
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke lagre kampanjen.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Slett kampanje",
            "Er du sikker på at du vil slette denne kampanjen?",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Slett",
                    style: "destructive",
                    onPress: async () => {
                        setSaving(true);
                        try {
                            await ContentService.deleteCampaign(id as string);
                            router.back();
                        } catch (e) {
                            Alert.alert("Feil", "Kunne ikke slette.");
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary.deep} /></View>;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>{isNew ? 'Ny Kampanje' : 'Rediger Kampanje'}</H2>
                    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
                        {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Lagre</Text>}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Tittel</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="F.eks. Sommerkampanje"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Beskrivelse</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Beskriv kampanjen..."
                            multiline
                        />
                    </View>

                    {/* Image URL Input */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Bilde URL</Text>
                        <TextInput
                            style={styles.input}
                            value={imageUrl}
                            onChangeText={setImageUrl}
                            placeholder="https://..."
                            autoCapitalize="none"
                        />
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.imagePreview} resizeMode="cover" />
                        ) : null}
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Dato (YYYY-MM-DD)</Text>
                        <TextInput
                            style={[styles.input, { flex: 1, marginLeft: 10 }]}
                            value={date}
                            onChangeText={setDate}
                            placeholder="2025-01-01"
                        />
                    </View>

                    <View style={[styles.row, { marginTop: 20 }]}>
                        <Text style={styles.label}>Aktiv</Text>
                        <Switch
                            value={active}
                            onValueChange={setActive}
                            trackColor={{ false: "#767577", true: Colors.primary.deep }}
                        />
                    </View>

                    {!isNew && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color="white" />
                            <Text style={styles.deleteButtonText}>Slett Kampanje</Text>
                        </TouchableOpacity>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -Spacing.s,
    },
    pageTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: Colors.primary.deep,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    content: {
        padding: Spacing.m,
        paddingBottom: 50
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    imagePreview: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginTop: 10,
        backgroundColor: '#eee'
    },
    deleteButton: {
        flexDirection: 'row',
        backgroundColor: '#D32F2F', // Red
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        gap: 8,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    }
});
