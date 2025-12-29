import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AMOUNTS = [500, 1000, 1500, 2000, 5000];

export default function GiftCardScreen() {
    const router = useRouter();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');

    const handlePurchase = () => {
        const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

        if (!amount || amount <= 0) {
            Alert.alert("Velg beløp", "Vennligst velg eller skriv inn et gyldig beløp.");
            return;
        }
        if (!recipientName || !recipientEmail || !senderName) {
            Alert.alert("Mangler info", "Fyll ut navn og e-post til mottaker og deg selv.");
            return;
        }

        // Script to auto-fill the squarespace/woocommerce form
        // Based on analysis of https://tmklinikken.no/produkter/p/gavekort/
        // NOTE: This injection ONLY works on Native (iOS/Android). 
        // Web Browsers block cross-origin script injection into iframes.
        const script = `
        (function() {
            function triggerInfo(el, val) {
                if(!el) return;
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            }

            try {
                // 1. Fill Text Fields
                setTimeout(function() {
                    triggerInfo(document.querySelector('#ywgc-recipient-name'), "${recipientName}");
                    triggerInfo(document.querySelector('#ywgc-recipient-email'), "${recipientEmail}");
                    triggerInfo(document.querySelector('#ywgc-sender-name'), "${senderName}");
                    triggerInfo(document.querySelector('#ywgc-edit-message'), "${message.replace(/\n/g, '\\n')}");

                    // 2. Select Amount
                    var isCustom = ${!!customAmount};
                    var amountVal = ${amount};

                    if (isCustom) {
                        triggerInfo(document.querySelector('#ywgc-manual-amount'), amountVal);
                    } else {
                        // Click predefined button
                        var buttons = Array.from(document.querySelectorAll('button.ywgc-predefined-amount-button'));
                        var btn = buttons.find(function(b) { return b.textContent.includes(amountVal.toString()); });
                        if(btn) { btn.click(); }
                    }

                    // 3. Scroll to Add To Cart
                    setTimeout(function() {
                        var cartBtn = document.querySelector('.single_add_to_cart_button');
                        if(cartBtn) {
                            cartBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                    }, 500);

                }, 500); // Small delay to ensure DOM is ready

            } catch(e) {
                console.log("Auto-fill error:", e);
            }
        })();
        `;

        // Navigate to payment (WebView)
        router.push({
            pathname: '/webview',
            params: {
                url: 'https://tmklinikken.no/produkter/p/gavekort/',
                title: 'Betaling Gavekort',
                script: script
            }
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primary.dark} />
                </TouchableOpacity>
                <H2 style={styles.headerTitle}>Kjøp Gavekort</H2>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.heroSection}>
                        <Image
                            source={require('@/assets/images/tm-logo.png')}
                            style={styles.heroLogo}
                            resizeMode="contain"
                        />
                        <H2 style={styles.heroTitle}>Gi ekstra oppmerksomhet i gave til en du er glad i!</H2>
                        <H3 style={styles.heroSubtitle}>Gavekort</H3>
                        <Body style={styles.heroText}>
                            TM tilbyr gavekort på alle våre behandlinger og tjenester. Gavekort er svært populært ved spesielle anledninger og i hverdagen. Gi gavekort til en du er glad i!
                        </Body>
                    </View>

                    <H3 style={styles.sectionTitle}>Velg beløp</H3>
                    <View style={styles.amountGrid}>
                        {AMOUNTS.map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                style={[
                                    styles.amountButton,
                                    selectedAmount === amount && styles.amountButtonActive
                                ]}
                                onPress={() => {
                                    setSelectedAmount(amount);
                                    setCustomAmount('');
                                }}
                            >
                                <Body style={[
                                    styles.amountText,
                                    selectedAmount === amount && styles.amountTextActive
                                ]}>
                                    {amount},-
                                </Body>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.customAmountContainer}>
                        <Body style={styles.label}>Eller valgfritt beløp:</Body>
                        <TextInput
                            style={styles.input}
                            placeholder="Kroner"
                            keyboardType="numeric"
                            value={customAmount}
                            onChangeText={(text) => {
                                setCustomAmount(text);
                                setSelectedAmount(null);
                            }}
                        />
                    </View>

                    <View style={styles.divider} />

                    <H3 style={styles.sectionTitle}>Mottaker</H3>
                    <View style={styles.formGroup}>
                        <Body style={styles.label}>Navn på mottaker</Body>
                        <TextInput
                            style={styles.input}
                            placeholder="Ola Nordmann"
                            value={recipientName}
                            onChangeText={setRecipientName}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Body style={styles.label}>E-post til mottaker</Body>
                        <TextInput
                            style={styles.input}
                            placeholder="ola@eksempel.no"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={recipientEmail}
                            onChangeText={setRecipientEmail}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Body style={styles.label}>Din hilsen (valgfritt)</Body>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Skriv en hyggelig melding..."
                            multiline
                            numberOfLines={3}
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>

                    <H3 style={styles.sectionTitle}>Fra</H3>
                    <View style={styles.formGroup}>
                        <Body style={styles.label}>Ditt navn</Body>
                        <TextInput
                            style={styles.input}
                            placeholder="Ditt navn"
                            value={senderName}
                            onChangeText={setSenderName}
                        />
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
                        <Body style={styles.buyButtonText}>
                            Gå til betaling {(selectedAmount || customAmount) ? `(${selectedAmount || customAmount} kr)` : ''}
                        </Body>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        backgroundColor: Colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
        paddingTop: Platform.OS === 'android' ? 40 : Spacing.m,
    },
    backButton: {
        padding: Spacing.s,
    },
    headerTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
    },
    content: {
        padding: Spacing.l,
        paddingBottom: 100,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        backgroundColor: Colors.neutral.white,
        padding: Spacing.l,
        borderRadius: 16,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    heroLogo: {
        width: 140,
        height: 50,
        marginBottom: Spacing.m,
    },
    heroTitle: {
        fontSize: 22,
        color: Colors.primary.deep,
        textAlign: 'center',
        marginBottom: Spacing.s,
        lineHeight: 28,
    },
    heroSubtitle: {
        fontSize: 18,
        color: Colors.primary.main,
        marginBottom: Spacing.m,
        fontWeight: '600',
    },
    heroText: {
        textAlign: 'center',
        color: Colors.neutral.charcoal,
        lineHeight: 22,
        paddingHorizontal: Spacing.s,
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
        marginBottom: Spacing.m,
        marginTop: Spacing.m,
    },
    amountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.m,
        marginBottom: Spacing.l,
    },
    amountButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: Colors.neutral.white,
        borderWidth: 1,
        borderColor: Colors.neutral.lightGray,
        minWidth: '28%',
        alignItems: 'center',
    },
    amountButtonActive: {
        backgroundColor: Colors.primary.main,
        borderColor: Colors.primary.main,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary.deep,
    },
    amountTextActive: {
        color: Colors.neutral.white,
    },
    customAmountContainer: {
        marginBottom: Spacing.l,
    },
    label: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    input: {
        backgroundColor: Colors.neutral.white,
        borderWidth: 1,
        borderColor: Colors.neutral.lightGray,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.neutral.lightGray,
        marginVertical: Spacing.l,
    },
    formGroup: {
        marginBottom: Spacing.m,
    },
    footer: {
        padding: Spacing.m,
        backgroundColor: Colors.neutral.white,
        borderTopWidth: 1,
        borderTopColor: Colors.neutral.lightGray,
    },
    buyButton: {
        backgroundColor: Colors.primary.main,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buyButtonText: {
        color: Colors.neutral.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
