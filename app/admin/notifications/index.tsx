import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { ContentService, BroadcastMessage } from '@/src/services/ContentService';

export default function NotificationsAdmin() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [sending, setSending] = useState(false);
    const [history, setHistory] = useState<BroadcastMessage[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await ContentService.getRecentBroadcasts();
        setHistory(data);
    };

    const handleSend = async () => {
        if (!title.trim() || !body.trim()) {
            Alert.alert("Mangler info", "Skriv inn både tittel og melding.");
            return;
        }

        Alert.alert(
            "Send Push-varsel",
            "Er du sikker? Dette vil sende en melding til ALLE brukere som har appen åpen (eller i bakgrunnen hvis konfigurert).",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Send Nå",
                    style: "destructive",
                    onPress: async () => {
                        setSending(true);
                        try {
                            await ContentService.sendBroadcastNotification(title, body, image);
                            Alert.alert("Sendt!", "Meldingen er lagt i køen.");
                            setTitle('');
                            setBody('');
                            setImage('');
                            loadHistory();
                        } catch (error) {
                            Alert.alert("Feil", "Kunne ikke sende melding.");
                        } finally {
                            setSending(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Admin Push-varsel</H2>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={24} color={Colors.primary.main} />
                        <Body style={{ flex: 1, marginLeft: 10, fontSize: 13, color: Colors.primary.deep }}>
                            Simulert Push: Dette sender en melding via databasen som apper lytter til. Fungerer mens appen er åpen.
                        </Body>
                    </View>

                    <H3 style={styles.sectionTitle}>Ny Melding</H3>

                    <View style={styles.inputGroup}>
                        <Body style={styles.label}>Tittel</Body>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Eks: Juletilbud!"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Body style={styles.label}>Melding</Body>
                        <TextInput
                            style={[styles.input, { height: 100 }]}
                            value={body}
                            onChangeText={setBody}
                            placeholder="Skriv meldingen her..."
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Body style={styles.label}>Bilde URL (Valgfritt)</Body>
                        <TextInput
                            style={styles.input}
                            value={image}
                            onChangeText={setImage}
                            placeholder="https://..."
                            multiline
                        />
                        {image && image.length > 5 && (
                            <Body style={{ fontSize: 10, color: 'green', marginTop: 4 }}>Bilde lagt til</Body>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, sending && { opacity: 0.7 }]}
                        onPress={handleSend}
                        disabled={sending}
                    >
                        {sending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="send" size={20} color="white" style={{ marginRight: 10 }} />
                                <Body style={styles.sendButtonText}>Send til Alle</Body>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <H3 style={styles.sectionTitle}>Tidligere Meldinger</H3>

                    {history.map((msg) => (
                        <View key={msg.id || Math.random()} style={styles.historyCard}>
                            <View style={styles.historyHeader}>
                                <Body style={styles.historyTitle}>{msg.title}</Body>
                                <Body style={styles.historyDate}>
                                    {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Body>
                            </View>
                            <Body style={styles.historyBody}>{msg.body}</Body>
                            {msg.image && (
                                <Body style={{ fontSize: 10, color: Colors.primary.main, marginTop: 4 }}>📷 Har bilde</Body>
                            )}
                        </View>
                    ))}

                    {history.length === 0 && (
                        <Body style={{ color: Colors.neutral.lightGray, textAlign: 'center', marginTop: 20 }}>Ingen tidligere meldinger.</Body>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.main },
    safeArea: { backgroundColor: Colors.background.main, zIndex: 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -Spacing.s },
    pageTitle: { fontSize: 18, color: Colors.primary.deep },
    content: { padding: Spacing.m, paddingBottom: 40 },
    sectionTitle: { fontSize: 18, color: Colors.primary.deep, marginBottom: Spacing.m, marginTop: Spacing.s },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: Spacing.m,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: Spacing.l,
    },
    inputGroup: { marginBottom: Spacing.m },
    label: { fontSize: 14, color: Colors.neutral.darkGray, marginBottom: 6, fontWeight: '600' },
    input: {
        backgroundColor: Colors.neutral.white,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    sendButton: {
        backgroundColor: Colors.primary.deep,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        marginTop: Spacing.s,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: Spacing.xl },
    historyCard: {
        backgroundColor: Colors.neutral.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    historyTitle: { fontWeight: 'bold', color: Colors.neutral.charcoal },
    historyDate: { fontSize: 12, color: Colors.neutral.lightGray },
    historyBody: { color: Colors.neutral.darkGray, fontSize: 14 }
});
