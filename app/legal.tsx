import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LegalService } from '@/src/services/LegalService';

export default function LegalScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: 'privacy' | 'terms' }>();

    const isPrivacy = type === 'privacy';
    const title = isPrivacy ? 'Personvernerklæring' : 'Vilkår for bruk';

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!type) return;
            const doc = await LegalService.getLegalText(type);
            setContent(doc.content);
            setLoading(false);
        };
        load();
    }, [type]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primary.dark} />
                </TouchableOpacity>
                <H2 style={styles.headerTitle}>{title}</H2>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary.deep} style={{ marginTop: 50 }} />
                ) : (
                    <View>
                        {/* Simple Markdown-like Renderer */}
                        {content.split('\n').map((line, index) => {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('###')) {
                                return (
                                    <Body key={index} style={styles.heading}>
                                        {trimmed.replace('###', '').trim()}
                                    </Body>
                                );
                            }
                            if (!trimmed) {
                                return <View key={index} style={{ height: 10 }} />;
                            }
                            return (
                                <Body key={index} style={styles.paragraph}>
                                    {line}
                                </Body>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

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
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
        backgroundColor: Colors.neutral.white,
    },
    backButton: {
        padding: Spacing.s,
    },
    headerTitle: {
        fontSize: 18,
        color: Colors.primary.dark,
    },
    content: {
        padding: Spacing.l,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Spacing.s,
        marginTop: Spacing.m,
        color: Colors.primary.deep,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.neutral.charcoal,
        marginBottom: 4,
    },
});
