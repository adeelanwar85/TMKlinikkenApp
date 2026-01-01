import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationService } from '@/src/services/NotificationService';

export default function PushNotificationScreen() {
    const router = useRouter();
    const [sending, setSending] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSend = async () => {
        if (!title.trim() || !body.trim()) {
            Alert.alert("Mangler info", "Du må fylle ut både tittel og melding.");
            return;
        }

        Alert.alert(
            "Send Varsel?",
            "Er du sikker på at du vil sende dette varselet til alle brukere?",
            [
                { text: "Avbryt", style: "cancel" },
                {
                    text: "Send",
                    style: "destructive",
                    onPress: async () => {
                        setSending(true);
                        try {
                            const result = await NotificationService.sendPushNotificationToAll(title, body);
                            if (result.success) {
                                Alert.alert("Suksess", `Varsel sendt! (ID: ${result.id})`);
                                setTitle('');
                                setBody('');
                            } else {
                                Alert.alert("Feil", "Noe gikk galt under utsending.");
                            }
                        } catch (error) {
                            Alert.alert("Feil", "Kritisk feil under utsending.");
                            console.error(error);
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
                    <H2 style={styles.pageTitle}>Send Varsel</H2>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Live Preview */}
                    <Text style={styles.label}>Forhåndsvisning (iOS Style)</Text>
                    <View style={styles.previewContainer}>
                        <View style={styles.previewCard}>
                            <View style={styles.previewHeader}>
                                <View style={styles.previewIcon}>
                                    <Ionicons name="medical" size={12} color="white" />
                                </View>
                                <Text style={styles.previewAppName}>TM Klinikken</Text>
                                <Text style={styles.previewTime}>Nå</Text>
                            </View>
                            <Text style={styles.previewTitle} numberOfLines={1}>
                                {title || 'Din overskrift'}
                            </Text>
                            <Text style={styles.previewBody} numberOfLines={3}>
                                {body || 'Din melding kommer her...'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={24} color={Colors.primary.main} />
                        <Body style={styles.infoText}>
                            Her kan du sende push-varsler til alle brukere som har lastet ned appen og godkjent varsler.
                        </Body>
                    </View>

                    <Text style={styles.label}>Tittel</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="F.eks. Sommerkampanje!"
                        maxLength={50}
                    />

                    <Text style={styles.label}>Melding</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={body}
                        onChangeText={setBody}
                        placeholder="Skriv din melding her..."
                        multiline
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        style={[styles.sendButton, (!title || !body) && styles.disabledButton]}
                        onPress={handleSend}
                        disabled={sending || !title || !body}
                    >
                        {sending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text style={styles.sendButtonText}>Send til alle</Text>
                            </>
                        )}
                    </TouchableOpacity>
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
    content: {
        padding: Spacing.m,
    },
    // Preview Styles
    previewContainer: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 10,
    },
    previewCard: {
        width: '95%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 14,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    previewIcon: {
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: Colors.primary.deep,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    previewAppName: {
        textTransform: 'uppercase',
        fontSize: 11,
        color: '#666',
        flex: 1,
        fontWeight: '500',
    },
    previewTime: {
        fontSize: 11,
        color: '#666',
    },
    previewTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
        color: '#000',
    },
    previewBody: {
        fontSize: 15,
        color: '#000',
        lineHeight: 20,
    },
    infoBox: {
        backgroundColor: '#e6f7ff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#bae7ff',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        color: '#0050b3',
        fontSize: 14,
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
        marginBottom: 20,
    },
    textArea: {
        height: 150,
        paddingTop: 12,
    },
    sendButton: {
        backgroundColor: Colors.primary.main,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
