import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { ContentService, treatmentMenuItem } from '@/src/services/ContentService';

export default function ContentEditorList() {
    const router = useRouter();
    const [treatments, setTreatments] = useState<treatmentMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTreatments();
    }, []);

    const loadTreatments = async () => {
        setLoading(true);
        const data = await ContentService.getAllTreatments();
        setTreatments(data);
        setLoading(false);
    };

    const handleBack = () => router.back();

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Velg side å redigere</H2>
                    <TouchableOpacity onPress={loadTreatments} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary.deep} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Body style={styles.subtitle}>Her er alle hovedkategoriene. Trykk på en for å redigere tekst, bilder og undersider.</Body>

                    {treatments.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            onPress={() => router.push(`/admin/content-editor/${item.id}`)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconBox}>
                                {/* Handling both remote URI strings and local require numbers safely */}
                                {item.icon ? (
                                    <Ionicons name={(item.icon as any) || 'document'} size={24} color={Colors.primary.main} />
                                ) : (
                                    <Ionicons name="layers-outline" size={24} color={Colors.primary.main} />
                                )}
                            </View>
                            <View style={styles.cardContent}>
                                <H3 style={styles.cardTitle}>{item.title}</H3>
                                <Body style={styles.cardSubtitle}>{item.subtitle}</Body>
                            </View>
                            <Ionicons name="pencil" size={20} color={Colors.neutral.lightGray} />
                        </TouchableOpacity>
                    ))}

                    {treatments.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="alert-circle-outline" size={48} color={Colors.neutral.lightGray} />
                            <Body style={{ marginTop: 10, textAlign: 'center' }}>Ingen behandlinger funnet i databasen. Har du husket å kjøre "Seed"?</Body>
                        </View>
                    )}
                </ScrollView>
            )}
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -Spacing.s,
    },
    refreshButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -Spacing.s,
    },
    pageTitle: {
        fontSize: 20,
        color: Colors.primary.deep,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: Spacing.m,
    },
    subtitle: {
        marginBottom: Spacing.m,
        color: Colors.neutral.darkGray,
        lineHeight: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        color: Colors.primary.deep,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 13,
        color: Colors.neutral.darkGray,
        opacity: 0.7,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
        padding: 20,
    }
});
