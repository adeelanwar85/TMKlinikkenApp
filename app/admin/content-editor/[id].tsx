import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
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
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [subToDeleteId, setSubToDeleteId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [heroImage, setHeroImage] = useState('');
    // New Fields for Dashboard Card
    const [image, setImage] = useState('');
    const [icon, setIcon] = useState('');
    // Type Toggle
    const [type, setType] = useState<'page' | 'link'>('page');
    // Link Field
    const [externalUrl, setExternalUrl] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            if (id) loadTreatment(id as string);
        }, [id])
    );

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
            setExternalUrl(data.url || '');

            // Determine type
            if (!data.details && data.url) {
                setType('link');
            } else {
                setType('page');
            }
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
            const updated: treatmentMenuItem = {
                ...treatment,
                title,
                subtitle,
                image,
                icon,
                url: type === 'link' ? externalUrl : '', // Clear URL if page? Or keep as fallback? Keep safe.
                details: type === 'link' ? undefined : {
                    ...treatment.details,
                    heroImage: heroImage,
                    intro: treatment.details?.intro || '',
                    subTreatments: treatment.details?.subTreatments || []
                }
            };

            // If switching to link, we must force 'details' to be undefined so setDoc removes/omits it
            if (type === 'link') {
                delete (updated as any).details;
            }
            await ContentService.saveTreatment(updated);
            Alert.alert("Lagret", "Endringene er oppdatert i skyen.");
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke lagre endringer.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        if (!treatment?.id) return;
        const tId = treatment.id;

        if (Platform.OS === 'web') {
            if (window.confirm("Er du sikker på at du vil slette denne hovedkategorien permanent?")) {
                performDelete(tId);
            }
        } else {
            Alert.alert(
                "Slett Behandling",
                "Er du sikker? Dette sletter hele kategorien og alle undersider permanent.",
                [
                    { text: "Avbryt", style: "cancel" },
                    {
                        text: "Slett alt",
                        style: "destructive",
                        onPress: () => performDelete(tId)
                    }
                ]
            );
        }
    };

    const performDelete = async (treatmentId: string) => {
        console.log("Saving/Deleting treatment:", treatmentId);
        setSaving(true);
        try {
            await ContentService.deleteTreatment(treatmentId);
            console.log("Delete success");

            if (Platform.OS === 'web') {
                // Web alert might be blocked or ugly, just navigate
                if (router.canGoBack()) router.back();
                else router.replace('/admin/content-editor');
            } else {
                Alert.alert("Slettet", "Behandlingen er slettet.", [
                    {
                        text: "OK", onPress: () => {
                            if (router.canGoBack()) router.back();
                            else router.replace('/admin/content-editor');
                        }
                    }
                ]);
            }
        } catch (error: any) {
            console.error("Delete error:", error);
            Alert.alert("Feil", "Kunne ikke slette: " + error.message);
            setSaving(false);
        }
    };

    const handleAddSub = async () => {
        if (!treatment) return;
        const newSub: SubTreatment = {
            id: `sub_${Date.now()}`,
            title: 'Ny Underbehandling',
            subtitle: 'Beskrivelse',
            intro: '',
            content: []
        };

        const currentSubs = treatment.details?.subTreatments || [];
        const updatedSubs = [...currentSubs, newSub];

        const updatedTreatment = {
            ...treatment,
            details: {
                ...treatment.details,
                subTreatments: updatedSubs
            }
        };

        setTreatment(updatedTreatment); // Optimistic

        try {
            setSaving(true);
            await ContentService.saveTreatment(updatedTreatment);
        } catch (e: any) {
            Alert.alert("Feil", "Kunne ikke lagre ny underside: " + e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSub = (subId: string) => {
        setSubToDeleteId(subId);
    };

    const performDeleteSub = async (subId: string) => {
        setSubToDeleteId(null);
        if (!treatment) return;
        const currentSubs = treatment.details?.subTreatments || [];
        const updatedSubs = currentSubs.filter(s => s.id !== subId);

        const updatedTreatment = {
            ...treatment,
            details: {
                ...treatment.details,
                subTreatments: updatedSubs
            }
        };

        setTreatment(updatedTreatment); // Optimistic

        try {
            await ContentService.saveTreatment(updatedTreatment);
        } catch (e: any) {
            Alert.alert("Feil", "Kunne ikke slette: " + e.message);
            // Rollback? ideally yes, but for now simple error
        }
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
                        {/* Text instead of Icon for clarity? No, checkmark is fine if we have feedback */}
                        {saving ? <ActivityIndicator color="white" /> : <Ionicons name="cloud-upload" size={20} color="white" />}
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

                        {/* TYPE TOGGLE */}
                        <View style={styles.inputGroup}>
                            <Body style={styles.label}>Type Element</Body>
                            <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderRadius: 8, padding: 2 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, padding: 8, alignItems: 'center', backgroundColor: type === 'page' ? 'white' : 'transparent', borderRadius: 6 }}
                                    onPress={() => setType('page')}
                                >
                                    <Body style={{ fontWeight: type === 'page' ? 'bold' : 'normal' }}>Behandlingsside</Body>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, padding: 8, alignItems: 'center', backgroundColor: type === 'link' ? 'white' : 'transparent', borderRadius: 6 }}
                                    onPress={() => setType('link')}
                                >
                                    <Body style={{ fontWeight: type === 'link' ? 'bold' : 'normal' }}>Ekstern Lenke</Body>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <H3 style={styles.sectionTitle}>Innhold</H3>

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

                        {type === 'page' && (
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
                        )}

                        {type === 'link' && (
                            <View style={styles.inputGroup}>
                                <Body style={styles.label}>Nettadresse (URL)</Body>
                                <TextInput
                                    style={styles.input}
                                    value={externalUrl}
                                    onChangeText={setExternalUrl}
                                    placeholder="https://..."
                                    autoCapitalize="none"
                                    keyboardType="url"
                                />
                            </View>
                        )}

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

                        <View style={styles.divider} />

                        {type === 'page' && (
                            <>
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
                                    <View key={sub.id}>
                                        {subToDeleteId === sub.id ? (
                                            <View style={[styles.subCard, styles.blockCardDeleting]}>
                                                <View style={styles.deleteConfirmContainer}>
                                                    <Body style={{ color: '#D32F2F', fontWeight: 'bold', marginBottom: 10 }}>
                                                        Er du sikker på at du vil slette "{sub.title}"?
                                                    </Body>
                                                    <View style={{ flexDirection: 'row', gap: 15 }}>
                                                        <TouchableOpacity
                                                            onPress={() => setSubToDeleteId(null)}
                                                            style={styles.cancelDeleteButton}
                                                        >
                                                            <Text style={{ color: '#333' }}>Avbryt</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => performDeleteSub(sub.id)}
                                                            style={styles.confirmDeleteButton}
                                                        >
                                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Slett</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.subCard}
                                                onPress={() => router.push(`/admin/content-editor/${id}/${sub.id}`)}
                                            >
                                                <View style={styles.row}>
                                                    <View style={styles.dot} />
                                                    <Body style={styles.subTitle}>{sub.title}</Body>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                                    <TouchableOpacity onPress={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSub(sub.id);
                                                    }}>
                                                        <Ionicons name="trash-outline" size={20} color={Colors.primary.deep} />
                                                    </TouchableOpacity>
                                                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral.lightGray} />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
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
                            </>
                        )}

                        {/* Delete Treatment - Custom UI Confirmation */}
                        {id !== 'new' && treatment && (
                            <View style={{ marginTop: 40, alignItems: 'center', paddingBottom: 50 }}>
                                {saving ? (
                                    <View style={{ padding: 20 }}>
                                        <ActivityIndicator color="red" />
                                        <Body style={{ color: 'red', marginTop: 10 }}>Sletter...</Body>
                                    </View>
                                ) : (
                                    <>
                                        {!confirmDelete ? (
                                            <TouchableOpacity
                                                onPress={() => setConfirmDelete(true)}
                                                style={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                                            >
                                                <Ionicons name="trash-outline" size={18} color="red" />
                                                <Body style={{ color: 'red', fontSize: 14 }}>Slett hele denne kategorien</Body>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.deleteConfirmContainer}>
                                                <Body style={{ color: Colors.neutral.charcoal, marginBottom: 10, fontWeight: '600' }}>
                                                    Er du sikker? Dette kan ikke angres.
                                                </Body>
                                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                                    <TouchableOpacity
                                                        onPress={() => setConfirmDelete(false)}
                                                        style={styles.cancelDeleteButton}
                                                    >
                                                        <Text style={{ color: '#333' }}>Avbryt</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => performDelete(treatment.id)}
                                                        style={styles.confirmDeleteButton}
                                                    >
                                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ja, slett alt</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        )}
                    </ScrollView>
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
    },
    deleteConfirmContainer: {
        backgroundColor: '#FFE5E5',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    cancelDeleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmDeleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#E53935',
    }
});
