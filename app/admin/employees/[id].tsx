import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentService } from '@/src/services/ContentService';
import { Employee } from '@/src/constants/Employees';

export default function EmployeeEditorScreen() {
    const { id } = useLocalSearchParams(); // 'name' is passed as ID
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (!isNew && id) {
            loadEmployee();
        }
    }, [id]);

    const loadEmployee = async () => {
        // Fetch all and find by Name (id)
        const all = await ContentService.getAllEmployees();
        const found = all.find(e => e.name === id);
        if (found) {
            setName(found.name);
            setTitle(found.title || (found as any).role || '');
            setBio(found.bio || '');
            if (typeof found.image === 'string') {
                setImageUrl(found.image);
            }
        } else {
            Alert.alert("Feil", "Fant ikke den ansatte");
            router.back();
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!name.trim() || !title.trim()) {
            Alert.alert("Mangler info", "Navn og tittel må fylles ut.");
            return;
        }

        setSaving(true);
        try {
            const employeeData: Employee = {
                name,
                title,
                image: imageUrl || null, // Allow null if no image
                bio: bio || undefined
            };

            // Pass original ID if editing, to handle renaming
            await ContentService.saveEmployee(employeeData, isNew ? undefined : (id as string));
            Alert.alert("Suksess", "Ansatt lagret", [{ text: "OK", onPress: () => router.back() }]);
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke lagre.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Slett ansatt",
            "Er du sikker på at du vil slette denne ansatte?",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Slett",
                    style: "destructive",
                    onPress: async () => {
                        setSaving(true);
                        try {
                            await ContentService.deleteEmployee(id as string);
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
                    <H2 style={styles.pageTitle}>{isNew ? 'Ny Ansatt' : 'Rediger Ansatt'}</H2>
                    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
                        {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Lagre</Text>}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Navn</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Fullt navn"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Tittel</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="F.eks. Kosmetisk sykepleier"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Bio / Info (Valgfritt)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Kort beskrivelse..."
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


                    {!isNew && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color="white" />
                            <Text style={styles.deleteButtonText}>Slett Ansatt</Text>
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
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circular preview
        marginTop: 10,
        backgroundColor: '#eee',
        alignSelf: 'center'
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
