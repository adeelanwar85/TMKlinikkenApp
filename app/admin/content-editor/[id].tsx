import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { ContentService, treatmentMenuItem, SubTreatment } from '@/src/services/ContentService';

export default function TreatmentEditor() {
    const { id } = useLocalSearchParams(); // Category ID (e.g. "peelinger")
    const router = useRouter();
    const [treatment, setTreatment] = useState<treatmentMenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [heroImage, setHeroImage] = useState('');
    // New Fields for Dashboard Card
    const [image, setImage] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (id) loadTreatment(id as string);
    }, [id]);

    const loadTreatment = async (treatmentId: string) => {
        setLoading(true);
        const data = await ContentService.getTreatmentById(treatmentId);
        if (data) {
            setTreatment(data);
            setTitle(data.title);
            setSubtitle(data.subtitle);
            setHeroImage(data.details?.heroImage || '');
            setImage(data.image || '');
            setIcon(data.icon || '');
        } else {
            Alert.alert("Feil", "Fant ikke behandlingen.");
            router.back();
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!treatment) return;
        setSaving(true);
        try {
            const updated = {
                ...treatment,
                title,
                subtitle,
                image, // Dashboard Image URL
                icon,  // Ionicons Name
                details: {
                    ...treatment.details,
                    heroImage: heroImage
                }
            };
            await ContentService.saveTreatment(updated);
            Alert.alert("Lagret", "Endringene er oppdatert i skyen.");
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke lagre endringer.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!treatment) return;
        Alert.alert(
            "Slett Behandling",
            "Er du sikker på at du vil slette denne behandlingen? Dette kan ikke angres.",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Slett",
                    style: "destructive",
                    onPress: async () => {
                        setSaving(true);
                        await ContentService.deleteTreatment(treatment.id);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleAddSub = () => {
        if (!treatment) return;
        const newSub: SubTreatment = {
            id: `sub_${Date.now()}`,
            title: 'Ny Underbehandling',
            subtitle: 'Beskrivelse',
            intro: '',
            content: []
        };

        const currentSubs = treatment.details?.subTreatments || [];
        setTreatment({
            ...treatment,
            details: {
                ...treatment.details,
                subTreatments: [...currentSubs, newSub]
            }
        });
    };

    const handleDeleteSub = (subId: string) => {
        if (!treatment) return;
        Alert.alert(
            "Slett Underbehandling",
            "Slette denne?",
            [
                { text: "Nei", style: "cancel" },
                {
                    text: "Ja",
                    style: "destructive",
                    onPress: () => {
                        const currentSubs = treatment.details?.subTreatments || [];
                        const updatedSubs = currentSubs.filter(s => s.id !== subId);
                        setTreatment({
                            ...treatment,
                            details: {
                                ...treatment.details,
                                subTreatments: updatedSubs
                            }
                        });
                    }
                }
            ]
        );
    };

    const hasSubTreatments = treatment?.details?.subTreatments && treatment.details.subTreatments.length > 0;

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Rediger Kategori</H2>
                    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
                        {saving ? <ActivityIndicator color="white" /> : <Ionicons name="checkmark" size={24} color="white" />}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary.deep} />
                </View>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.content}>

                        <H3 style={styles.sectionTitle}>Hovedinfo</H3>

                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Tittel</Body>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Eks: Peelinger"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Undertittel</Body>
                            <TextInput
                                style={styles.input}
                                value={subtitle}
                                onChangeText={setSubtitle}
                                placeholder="Eks: Medisinske peelinger..."
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Hero Bilde URL</Body>
                            <TextInput
                                style={styles.input}
                                value={heroImage}
                                onChangeText={setHeroImage}
                                placeholder="https://..."
                                multiline
                            />
                            {heroImage && heroImage.startsWith('http') && (
                                <Body style={{ fontSize: 10, color: 'green', marginTop: 4 }}>Bilde-link ser gyldig ut</Body>
                            )}
                        </View>

                        <H3 style={styles.sectionTitle}>Dashboard Kort (Hjemskjerm)</H3>

                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Dashboard Bilde URL (Overstyrer ikon)</Body>
                            <TextInput
                                style={styles.input}
                                value={image}
                                onChangeText={setImage}
                                placeholder="http://..."
                                multiline
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Eller: Ikon Navn (Ionicons)</Body>
                            <TextInput
                                style={styles.input}
                                value={icon}
                                onChangeText={setIcon}
                                placeholder="f.eks. heart, medkit, sparkles"
                                autoCapitalize="none"
                            />
                            {icon ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 }}>
                                    <Ionicons name={icon as any} size={24} color={Colors.primary.main} />
                                    <Body style={{ fontSize: 12 }}>Forhåndsvisning</Body>
                                </View>
                            ) : null}
                        </View>

                        <View style={styles.divider} />

                        <H3 style={styles.sectionTitle}>
                            {hasSubTreatments ? 'Undersider (Behandlinger)' : 'Seksjoner (Info)'}
                        </H3>

                        {/* ADD SUB BUTTON */}
                        <TouchableOpacity style={styles.addSubButton} onPress={handleAddSub}>
                            <Ionicons name="add" size={20} color="white" />
                            <Body style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Ny Underside</Body>
                        </TouchableOpacity>

                        {/* SUB TREATMENTS LIST */}
                        {hasSubTreatments && treatment?.details?.subTreatments?.map((sub, index) => (
                            <TouchableOpacity
                                key={sub.id}
                                style={styles.subCard}
                                // Navigate to sub-editor (not created yet, but placeholder logic)
                                // We can use query params to identify: /admin/content-editor/peelinger?subId=inno
                                // But better to use: /admin/content-editor/[id]/[subId]
                                onPress={() => router.push(`/admin/content-editor/${id}/${sub.id}`)}
                            >
                                <View style={styles.row}>
                                    <View style={styles.dot} />
                                    <Body style={styles.subTitle}>{sub.title}</Body>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                    <TouchableOpacity onPress={() => handleDeleteSub(sub.id)}>
                                        <Ionicons name="trash-outline" size={20} color={Colors.primary.deep} />
                                    </TouchableOpacity>
                                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral.lightGray} />
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* LEGACY SECTIONS LIST */}
                        {!hasSubTreatments && treatment?.details?.sections?.map((sec, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.subCard}
                                onPress={() => router.push(`/admin/content-editor/${id}/section_${index}`)}
                            >
                                <View style={styles.row}>
                                    <Ionicons name="document-text-outline" size={16} color="#666" />
                                    <Body style={styles.subTitle}>{sec.title || 'Uten navn'}</Body>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={Colors.neutral.lightGray} />
                            </TouchableOpacity>
                        ))}

                    </ScrollView>

                    <View style={{ padding: 20 }}>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Body style={{ color: 'white', fontWeight: 'bold' }}>Slett hele behandlingen</Body>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    safeArea: {
        backgroundColor: Colors.background.main,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
    },
    saveButton: {
        backgroundColor: Colors.primary.deep,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: Spacing.m,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.neutral.charcoal,
        marginBottom: Spacing.m,
        marginTop: Spacing.s,
        textTransform: 'uppercase',
        opacity: 0.7,
    },
    inputGroup: {
        marginBottom: Spacing.m,
    },
    label: {
        fontSize: 12,
        color: Colors.neutral.darkGray,
        marginBottom: 4,
        fontWeight: '600',
    },
    input: {
        backgroundColor: Colors.neutral.white,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: Spacing.l,
    },
    subCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.neutral.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary.main,
    },
    subTitle: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    addSubButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    deleteButton: {
        backgroundColor: '#E53935',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    }
});
