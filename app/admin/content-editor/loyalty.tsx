import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body, Caption } from '@/src/theme/Typography';
import { ContentService, LoyaltyContent } from '@/src/services/ContentService';

export default function LoyaltyEditor() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<LoyaltyContent | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        const data = await ContentService.getLoyaltyContent();
        setContent(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            await ContentService.saveLoyaltyContent(content);
            Alert.alert("Suksess", "Innholdet ble oppdatert!");
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke lagre endringene.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const updateIntro = (field: keyof LoyaltyContent['intro'], value: string) => {
        if (!content) return;
        setContent({ ...content, intro: { ...content.intro, [field]: value } });
    };

    const updateCard = (value: string) => {
        if (!content) return;
        setContent({ ...content, card: { ...content.card, subtitle: value } });
    };

    const updateSection = (section: keyof LoyaltyContent['sections'], field: 'title' | 'body' | 'disclaimer', value: string) => {
        if (!content) return;
        setContent({ ...content, sections: { ...content.sections, [section]: { ...content.sections[section], [field]: value } } });
    };

    const updateBullet = (section: keyof LoyaltyContent['sections'], index: number, field: 'title' | 'text', value: string) => {
        if (!content) return;
        const newBullets = [...content.sections[section].bullets];
        newBullets[index] = { ...newBullets[index], [field]: value };
        setContent({ ...content, sections: { ...content.sections, [section]: { ...content.sections[section], bullets: newBullets } } });
    };

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
        if (!content) return;
        const newFaq = [...content.faq];
        newFaq[index] = { ...newFaq[index], [field]: value };
        setContent({ ...content, faq: newFaq });
    };


    if (loading || !content) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary.deep} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                </TouchableOpacity>
                <H2 style={styles.pageTitle}>Rediger Kundeklubb</H2>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
                    {saving ? <ActivityIndicator color="white" /> : <Body style={{ color: 'white', fontWeight: 'bold' }}>Lagre</Body>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* INTRO */}
                    <View style={styles.section}>
                        <H3 style={styles.sectionHeader}>Introduksjon</H3>
                        <InputLabel label="Tittel" />
                        <Input value={content.intro.title} onChangeText={(t) => updateIntro('title', t)} />

                        <InputLabel label="Hovedtekst" />
                        <Input value={content.intro.body} onChangeText={(t) => updateIntro('body', t)} multiline />

                        <InputLabel label="Bli medlem Tittel" />
                        <Input value={content.intro.joinTitle} onChangeText={(t) => updateIntro('joinTitle', t)} />

                        <InputLabel label="Bli medlem Tekst" />
                        <Input value={content.intro.joinText} onChangeText={(t) => updateIntro('joinText', t)} />
                    </View>

                    {/* CARD */}
                    <View style={styles.section}>
                        <H3 style={styles.sectionHeader}>Kortet (Glow Card)</H3>
                        <InputLabel label="Undertittel på kortet" />
                        <Input value={content.card.subtitle} onChangeText={updateCard} />
                    </View>

                    {/* SECTION 1: GLØD KORT */}
                    <SectionEditor
                        title="Seksjon 1: Glød Kort"
                        data={content.sections.glowCard}
                        onUpdate={(field, val) => updateSection('glowCard', field, val)}
                        onUpdateBullet={(idx, field, val) => updateBullet('glowCard', idx, field, val)}
                    />

                    {/* SECTION 2: POINTS */}
                    <SectionEditor
                        title="Seksjon 2: Poeng"
                        data={content.sections.points}
                        onUpdate={(field, val) => updateSection('points', field, val)}
                        onUpdateBullet={(idx, field, val) => updateBullet('points', idx, field, val)}
                    />

                    {/* SECTION 3: VIP */}
                    <SectionEditor
                        title="Seksjon 3: VIP Gull"
                        data={content.sections.vip}
                        onUpdate={(field, val) => updateSection('vip', field, val)}
                        onUpdateBullet={(idx, field, val) => updateBullet('vip', idx, field, val)}
                    />

                    {/* FAQ */}
                    <View style={styles.section}>
                        <H3 style={styles.sectionHeader}>Ofte Stilte Spørsmål (FAQ)</H3>
                        {content.faq.map((item, index) => (
                            <View key={index} style={styles.subGroup}>
                                <Caption style={{ marginBottom: 4 }}>Spørsmål {index + 1}</Caption>
                                <Input value={item.question} onChangeText={(t) => updateFaq(index, 'question', t)} placeholder="Spørsmål" />
                                <Input value={item.answer} onChangeText={(t) => updateFaq(index, 'answer', t)} multiline placeholder="Svar" />
                            </View>
                        ))}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// --- Helper Components ---

const InputLabel = ({ label }: { label: string }) => (
    <Caption style={styles.label}>{label}</Caption>
);

const Input = (props: React.ComponentProps<typeof TextInput>) => (
    <TextInput
        style={[styles.input, props.multiline && styles.textArea]}
        placeholderTextColor={Colors.neutral.gray}
        {...props}
    />
);

const SectionEditor = ({ title, data, onUpdate, onUpdateBullet }: {
    title: string,
    data: LoyaltyContent['sections']['glowCard'],
    onUpdate: (field: 'title' | 'body' | 'disclaimer', val: string) => void,
    onUpdateBullet: (index: number, field: 'title' | 'text', val: string) => void
}) => (
    <View style={styles.section}>
        <H3 style={styles.sectionHeader}>{title}</H3>

        <InputLabel label="Seksjonstittel" />
        <Input value={data.title} onChangeText={(t) => onUpdate('title', t)} />

        <InputLabel label="Brødtekst" />
        <Input value={data.body} onChangeText={(t) => onUpdate('body', t)} multiline />

        <InputLabel label="Punkter (Bullets)" />
        {data.bullets.map((b, i) => (
            <View key={i} style={styles.bulletRow}>
                <Input
                    value={b.title}
                    onChangeText={(t) => onUpdateBullet(i, 'title', t)}
                    placeholder="Fet tittel (valgfri)"
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                />
                <Input
                    value={b.text}
                    onChangeText={(t) => onUpdateBullet(i, 'text', t)}
                    placeholder="Tekst"
                    style={[styles.input, { flex: 2 }]}
                />
            </View>
        ))}

        <InputLabel label="Disclaimer (liten tekst nederst)" />
        <Input value={data.disclaimer} onChangeText={(t) => onUpdate('disclaimer', t)} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
        backgroundColor: Colors.background.main,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: Colors.primary.deep,
        paddingHorizontal: Spacing.m,
        paddingVertical: 8,
        borderRadius: 20,
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
    scrollContent: {
        padding: Spacing.m,
    },
    section: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 12,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeader: {
        fontSize: 18,
        color: Colors.primary.main,
        marginBottom: Spacing.m,
    },
    subGroup: {
        marginBottom: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: Spacing.s,
    },
    label: {
        color: Colors.neutral.darkGray,
        marginBottom: 4,
        marginTop: 8,
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: Colors.neutral.charcoal,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 8,
    }
});
