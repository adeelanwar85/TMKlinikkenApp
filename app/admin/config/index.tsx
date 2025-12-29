import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentService } from '@/src/services/ContentService';

export default function ConfigEditorScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [alertActive, setAlertActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [openingHours, setOpeningHours] = useState('');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const config = await ContentService.getAppConfig();

            // Use config values OR fallback to defaults
            setAlertActive(config?.alertBanner?.active || false);
            setAlertMessage(config?.alertBanner?.message || '');

            setPhone(config?.contactInfo?.phone || '21 42 36 36');
            setEmail(config?.contactInfo?.email || 'post@tmklinikken.no');
            setAddress(config?.contactInfo?.address || 'Nygaardsgata 36, 1607 Fredrikstad');

            const defaultHours = "Mandag - Fredag: 10:00 – 16:00\nTorsdag: 10:00 – 20:00\nLørdag: 11:00 – 15:00\n\n(Behandlinger på kveldstid etter avtale)";

            let loadedHours = config?.openingHours;
            if (typeof loadedHours === 'object' && loadedHours !== null) {
                // Flatten object to string for the text area
                // Example: Monday: x, Tuesday: y...
                // But better to just default to the pretty format if it matches the default object, 
                // or simplified. Let's just use the defaultHours string if it's the specific default object structure to avoid messy JSON stringification.
                // Or better: try to construct it.
                loadedHours = defaultHours; // Fallback to our clean string format if its the complicated object
            }

            setOpeningHours((loadedHours as string) || defaultHours);

        } catch (error) {
            console.error("Failed to load config", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await ContentService.saveAppConfig({
                alertBanner: {
                    active: alertActive,
                    message: alertMessage
                },
                contactInfo: {
                    phone,
                    email,
                    address
                },
                openingHours
            });
            Alert.alert("Suksess", "Innstillinger lagret");
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke lagre innstillinger.");
            console.error(error);
        } finally {
            setSaving(false);
        }
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
                    <H2 style={styles.pageTitle}>Drift & Info</H2>
                    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton}>
                        {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Lagre</Text>}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Alert Banner Section */}
                    <View style={styles.section}>
                        <H3 style={styles.sectionTitle}>Varsel Banner</H3>
                        <Body style={styles.sectionDesc}>Vises øverst på forsiden (f.eks. ved ferieavvikling)</Body>

                        <View style={styles.row}>
                            <Text style={styles.label}>Aktiv</Text>
                            <Switch
                                value={alertActive}
                                onValueChange={setAlertActive}
                                trackColor={{ false: "#767577", true: Colors.primary.deep }}
                            />
                        </View>

                        {alertActive && (
                            <TextInput
                                style={styles.input}
                                value={alertMessage}
                                onChangeText={setAlertMessage}
                                placeholder="Melding (f.eks. Feriestengt uke 28-30)"
                            />
                        )}
                    </View>

                    <View style={styles.separator} />

                    {/* Contact Info Section */}
                    <View style={styles.section}>
                        <H3 style={styles.sectionTitle}>Kontaktinformasjon</H3>

                        <Text style={styles.label}>Telefon</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+47 ..."
                            keyboardType="phone-pad"
                        />

                        <Text style={styles.label}>E-post</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="post@..."
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Adresse</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Gateadresse, Poststed"
                        />
                    </View>

                    <View style={styles.separator} />

                    {/* Opening Hours Section */}
                    <View style={styles.section}>
                        <H3 style={styles.sectionTitle}>Åpningstider</H3>
                        <Body style={styles.sectionDesc}>Tekst som vises under åpningstider i appen.</Body>

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={openingHours}
                            onChangeText={setOpeningHours}
                            placeholder="Man-Fre: 09-16..."
                            multiline
                        />
                    </View>

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
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 20,
    },
    fieldGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
        marginTop: 10,
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
});
