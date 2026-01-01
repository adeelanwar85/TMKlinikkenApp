import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { ContentService, treatmentMenuItem } from '@/src/services/ContentService';

export default function SubTreatmentEditor() {
    const { id, subId } = useLocalSearchParams(); // id=peelinger, subId=meline OR section_0
    const router = useRouter();

    const [parentTreatment, setParentTreatment] = useState<treatmentMenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Determines if we are editing a SubTreatment (object) or a Section (legacy object)
    const [isSection, setIsSection] = useState(false);
    const [sectionIndex, setSectionIndex] = useState(-1);

    // Form Data
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [intro, setIntro] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [contentBlocks, setContentBlocks] = useState<any[]>([]);

    useEffect(() => {
        if (id && subId) loadContent();
    }, [id, subId]);

    const loadContent = async () => {
        setLoading(true);
        const parent = await ContentService.getTreatmentById(id as string);
        if (parent) {
            setParentTreatment(parent);

            // Logic to find the child node
            const sId = subId as string;
            if (sId.startsWith('section_')) {
                // It's a section
                setIsSection(true);
                const idx = parseInt(sId.split('_')[1]);
                setSectionIndex(idx);
                const section = parent.details?.sections?.[idx];
                if (section) {
                    setTitle(section.title || '');
                    setSubtitle(''); // Sections don't usually have subtitles
                    setIntro(''); // Sections uses 'content' string as intro/body usually, or it's a block
                    // Normalize Section to match SubTreatment structure for the form
                    // If section.type is 'text', it has a content string.
                    // We will cheat and put that single content into a "Block" for consistent editing.
                    // Actually, let's treat the Section ITSELF as one big block if it doesn't have listItems?
                    // No, keeping it consistent:
                    // A Section has: title, content (string), type, listItems (optional).
                    // We map this to our form fields.

                    // Specific handling for Sections:
                    // They usually represent ONE block.
                    // So we will just edit that block directly.
                    setContentBlocks([section]);
                }
            } else {
                // It's a SubTreatment
                setIsSection(false);
                const sub = parent.details?.subTreatments?.find(s => s.id === sId);
                if (sub) {
                    setTitle(sub.title || '');
                    setSubtitle(sub.subtitle || '');
                    setIntro(sub.intro || '');
                    setHeroImage(sub.heroImage || '');
                    setContentBlocks(sub.content || []);
                }
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!parentTreatment) return;
        setSaving(true);
        try {
            // Deep clone parent
            const updatedParent = JSON.parse(JSON.stringify(parentTreatment));

            if (isSection) {
                // Update specific section at index
                // Note: The form for sections currently maps the WHOLE section to contentBlocks[0] approximately.
                // But sections are simple: { title, content, type... }
                // Let's assume the user edited the "Title" and the "First Block" fields.

                // For simplicity in this MVP, we map the Title Field back to title
                // And we take the first block from contentBlocks and use its content/type

                const editedBlock = contentBlocks[0];
                const updatedSection = {
                    ...updatedParent.details.sections[sectionIndex],
                    title: title,
                    content: editedBlock.content,
                    type: editedBlock.type,
                    listItems: editedBlock.listItems
                };
                updatedParent.details.sections[sectionIndex] = updatedSection;

            } else {
                // Update SubTreatment
                const subIndex = updatedParent.details.subTreatments.findIndex((s: any) => s.id === subId);
                if (subIndex === -1) {
                    Alert.alert("Feil", "Fant ikke underbehandlingen i databasen.");
                    return;
                }

                if (subIndex >= 0) {
                    updatedParent.details.subTreatments[subIndex] = {
                        ...updatedParent.details.subTreatments[subIndex],
                        title,
                        subtitle,
                        intro,
                        heroImage,
                        content: contentBlocks
                    };
                }
            }

            // 3. Sanitize Payload for Firestore (Removes undefined, keeps null)
            // This is crucial because contentBlocks state might contain 'undefined' which Firestore rejects.
            const cleanPayload = JSON.parse(JSON.stringify(updatedParent));

            await ContentService.saveTreatment(cleanPayload);
            Alert.alert("Lagret", "Innholdet er oppdatert.");
            router.back();
        } catch (error: any) {
            console.error(error);
            Alert.alert("Feil ved lagring", error.message || "Ukjent feil");
        } finally {
            setSaving(false);
        }
    };

    const updateBlock = (index: number, field: string, value: any) => {
        const newBlocks = [...contentBlocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setContentBlocks(newBlocks);
    };

    const addBlock = (type: 'text' | 'list') => {
        const newBlock = {
            title: type === 'text' ? 'Ny Tekst' : 'Ny Liste',
            type: type,
            // Use null instead of undefined to be explicit (though sanitize would handle undefined)
            content: type === 'text' ? '' : null,
            listItems: type === 'list' ? [] : null
        };
        setContentBlocks([...contentBlocks, newBlock]);
    };

    const removeBlock = (index: number) => {
        if (Platform.OS === 'web') {
            if (window.confirm("Slette denne blokken?")) {
                const updated = [...contentBlocks];
                updated.splice(index, 1);
                setContentBlocks(updated);
            }
        } else {
            Alert.alert("Slette blokk?", "Er du sikker?", [
                { text: "Avbryt", style: 'cancel' },
                {
                    text: "Slett",
                    style: 'destructive',
                    onPress: () => {
                        const updated = [...contentBlocks];
                        updated.splice(index, 1);
                        setContentBlocks(updated);
                    }
                }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>{isSection ? 'Rediger Seksjon' : 'Rediger Side'}</H2>
                    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload" size={18} color="white" />
                                <Text style={styles.saveButtonText}>Lagre</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary.deep} />
                </View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.content}>

                        {/* Metadata Fields */}
                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Tittel</Body>
                            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                        </View>

                        {/* Only SubTreatments have these extra fields */}
                        {!isSection && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Body style={styles.label}>Undertittel</Body>
                                    <TextInput style={styles.input} value={subtitle} onChangeText={setSubtitle} />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Body style={styles.label}>Intro-tekst</Body>
                                    <TextInput style={[styles.input, { height: 80 }]} value={intro} onChangeText={setIntro} multiline />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Body style={styles.label}>Hero Bilde URL</Body>
                                    <TextInput style={styles.input} value={heroImage} onChangeText={setHeroImage} />
                                </View>
                            </>
                        )}

                        <View style={styles.divider} />
                        <View style={styles.divider} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <H3 style={styles.sectionTitle}>Innholdsblokker</H3>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity onPress={() => addBlock('text')} style={styles.smallButton}>
                                    <Ionicons name="text-outline" size={16} color="white" />
                                    <Body style={styles.smallButtonText}>+ Tekst</Body>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addBlock('list')} style={styles.smallButton}>
                                    <Ionicons name="list-outline" size={16} color="white" />
                                    <Body style={styles.smallButtonText}>+ Liste</Body>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Blocks Editor */}
                        {contentBlocks.map((block, index) => (
                            <View key={index} style={styles.blockCard}>
                                <View style={styles.blockHeader}>
                                    <Body style={styles.blockLabel}>Blokk {index + 1} ({block.type || 'text'})</Body>
                                    <TouchableOpacity onPress={() => removeBlock(index)}>
                                        <Ionicons name="trash-outline" size={20} color="#E53935" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Body style={styles.label}>Overskrift (Valgfri)</Body>
                                    <TextInput
                                        style={styles.input}
                                        value={block.title}
                                        onChangeText={(text) => updateBlock(index, 'title', text)}
                                    />
                                </View>

                                {block.type === 'list' ? (
                                    <View>
                                        <Body style={styles.label}>Liste-elementer (Seperér med komma for nå)</Body>
                                        <TextInput
                                            style={[styles.input, { height: 60 }]}
                                            // Mocking list editing as CSV for MVP simplicity
                                            value={block.listItems?.map((l: any) => l.label).join(', ')}
                                            onChangeText={(text) => {
                                                const items = text.split(',').map(s => ({ label: s.trim() }));
                                                updateBlock(index, 'listItems', items);
                                            }}
                                            multiline
                                        />
                                        <Body style={{ fontSize: 10, color: '#666' }}>Eks: Fordel 1, Fordel 2, Fordel 3</Body>
                                    </View>
                                ) : (
                                    <View>
                                        <Body style={styles.label}>Tekstinnhold</Body>
                                        <TextInput
                                            style={[styles.input, { height: 120 }]}
                                            value={block.content}
                                            onChangeText={(text) => updateBlock(index, 'content', text)}
                                            multiline
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                        {/* Bottom Save Button for Visibility */}
                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                                style={styles.mainSaveButton}
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Ionicons name="cloud-upload-outline" size={20} color="white" />
                                        <Text style={styles.mainSaveButtonText}>Lagre Endringer</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.main },
    safeArea: { backgroundColor: Colors.background.main },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.m, paddingVertical: Spacing.s, borderBottomWidth: 1, borderBottomColor: '#eee' },
    backButton: { padding: 5 },

    // Updated Header Save Button
    saveButton: {
        backgroundColor: Colors.primary.deep,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

    pageTitle: { fontSize: 18, color: Colors.primary.deep },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: Spacing.m, paddingBottom: 40 },
    sectionTitle: { fontSize: 16, color: Colors.neutral.charcoal, marginBottom: Spacing.m, marginTop: Spacing.s, textTransform: 'uppercase', opacity: 0.7 },
    inputGroup: { marginBottom: Spacing.m },
    label: { fontSize: 12, color: Colors.neutral.darkGray, marginBottom: 4, fontWeight: '600' },
    input: { backgroundColor: Colors.neutral.white, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16, color: Colors.neutral.charcoal },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: Spacing.l },
    blockCard: { backgroundColor: '#F9F9F9', padding: Spacing.m, borderRadius: 12, marginBottom: Spacing.m, borderWidth: 1, borderColor: '#EEE' },
    blockHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    blockLabel: { fontWeight: 'bold', color: Colors.primary.main },
    smallButton: { flexDirection: 'row', backgroundColor: Colors.primary.main, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignItems: 'center', gap: 4 },
    smallButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    // Bottom Save Button
    mainSaveButton: {
        backgroundColor: Colors.primary.deep,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    mainSaveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
