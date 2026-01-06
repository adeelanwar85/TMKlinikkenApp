import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { Colors, Spacing } from '@/src/theme/Theme';
import { H1, H2, H3, Body } from '@/src/theme/Typography';
import { GradientHeader } from '@/src/components/GradientHeader';
import { GiftCardService, GiftCardBalance } from '@/src/services/GiftCardService';

const AMOUNTS = [500, 1000, 1500, 2000, 5000];

export default function GiftCardScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<'check' | 'buy'>('check');

    // -- Check Balance States --
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [balanceResult, setBalanceResult] = useState<GiftCardBalance | null>(null);
    const [hasChecked, setHasChecked] = useState(false);

    // -- Purchase States --
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');

    // -- Handlers --

    const handleCheckBalance = async () => {
        if (!code.trim()) {
            Alert.alert('Feil', 'Vennligst skriv inn en kode.');
            return;
        }

        setLoading(true);
        setBalanceResult(null);
        setHasChecked(false);

        try {
            const result = await GiftCardService.checkBalance(code);
            setBalanceResult(result);
            setHasChecked(true);
        } catch (error) {
            Alert.alert('Feil', 'Noe gikk galt under sjekking av saldo.');
        } finally {
            setLoading(false);
        }
    };

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
                setTimeout(function() {
                    triggerInfo(document.querySelector('#ywgc-recipient-name'), "${recipientName}");
                    triggerInfo(document.querySelector('#ywgc-recipient-email'), "${recipientEmail}");
                    triggerInfo(document.querySelector('#ywgc-sender-name'), "${senderName}");
                    triggerInfo(document.querySelector('#ywgc-edit-message'), "${message.replace(/\n/g, '\\n')}");

                    var isCustom = ${!!customAmount};
                    var amountVal = ${amount};

                    if (isCustom) {
                        triggerInfo(document.querySelector('#ywgc-manual-amount'), amountVal);
                    } else {
                        var buttons = Array.from(document.querySelectorAll('button.ywgc-predefined-amount-button'));
                        var btn = buttons.find(function(b) { return b.textContent.includes(amountVal.toString()); });
                        if(btn) { btn.click(); }
                    }

                    setTimeout(function() {
                        var cartBtn = document.querySelector('.single_add_to_cart_button');
                        if(cartBtn) {
                            cartBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                    }, 500);

                }, 500);
            } catch(e) {
                console.log("Auto-fill error:", e);
            }
        })();
        `;

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
        <View style={styles.container}>
            <GradientHeader title="Gavekort" onBack={() => router.back()} />

            {/* Mode Switcher */}
            <View style={styles.modeSwitcherContainer}>
                <View style={styles.modeSwitcher}>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'check' && styles.modeButtonActive]}
                        onPress={() => setMode('check')}
                    >
                        <Body style={[styles.modeText, mode === 'check' && styles.modeTextActive]}>Sjekk Saldo</Body>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'buy' && styles.modeButtonActive]}
                        onPress={() => setMode('buy')}
                    >
                        <Body style={[styles.modeText, mode === 'buy' && styles.modeTextActive]}>Kjøp Nytt</Body>
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    {mode === 'check' ? (
                        <>
                            {/* CHECK BALANCE MODE */}
                            <View style={styles.heroSection}>
                                <View style={styles.cardIconContainer}>
                                    <Ionicons name="card-outline" size={48} color={Colors.primary.deep} />
                                </View>
                                <H2 style={styles.heroTitle}>Sjekk Saldo</H2>
                                <Body style={styles.heroText}>
                                    Har du fått et gavekort? Skriv inn koden under for å se hvor mye du har til gode.
                                </Body>
                            </View>

                            <View style={styles.inputContainer}>
                                <Body style={styles.label}>Gavekortkode</Body>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="F.eks. 12345"
                                        placeholderTextColor={Colors.neutral.mediumGray}
                                        value={code}
                                        onChangeText={setCode}
                                        keyboardType="number-pad"
                                        returnKeyType="done"
                                    />
                                    {code.length > 0 && (
                                        <TouchableOpacity onPress={() => setCode('')} style={styles.clearButton}>
                                            <Ionicons name="close-circle" size={20} color={Colors.neutral.mediumGray} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[styles.checkButton, (!code || loading) && styles.disabledButton]}
                                    onPress={handleCheckBalance}
                                    disabled={!code || loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.neutral.white} />
                                    ) : (
                                        <Body style={styles.buttonText}>Sjekk Saldo</Body>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {hasChecked && balanceResult && (
                                <View style={[styles.resultCard, balanceResult.isValid ? styles.validCard : styles.invalidCard]}>
                                    <View style={styles.resultHeader}>
                                        <Ionicons
                                            name={balanceResult.isValid ? "checkmark-circle" : "alert-circle"}
                                            size={32}
                                            color={balanceResult.isValid ? Colors.status.success : Colors.status.error}
                                        />
                                        <H3 style={styles.resultTitle}>{balanceResult.statusText}</H3>
                                    </View>

                                    {balanceResult.isValid && (
                                        <View style={styles.balanceContainer}>
                                            <Body style={styles.balanceLabel}>Saldo</Body>
                                            <H1 style={styles.balanceValue}>
                                                {balanceResult.balance} kr
                                            </H1>
                                            {balanceResult.expires && (
                                                <Body style={styles.expiryText}>Utløper: {balanceResult.expires}</Body>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}

                            <TouchableOpacity style={styles.switchModeLink} onPress={() => setMode('buy')}>
                                <Body style={styles.switchModeText}>Eller kjøp et nytt gavekort her</Body>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* BUY MODE */}
                            <View style={styles.heroSection}>
                                <Image
                                    source={require('@/assets/images/tm-logo.png')}
                                    style={styles.heroLogo}
                                    resizeMode="contain"
                                />
                                <H2 style={styles.heroTitle}>Gi ekstra oppmerksomhet!</H2>
                                <Body style={styles.heroText}>
                                    Gled noen du er glad i med et gavekort på våre behandlinger.
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

                            <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
                                <Body style={styles.buyButtonText}>
                                    Gå til betaling {(selectedAmount || customAmount) ? `(${selectedAmount || customAmount} kr)` : ''}
                                </Body>
                            </TouchableOpacity>
                        </>
                    )}

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
    modeSwitcherContainer: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
    },
    modeSwitcher: {
        flexDirection: 'row',
        backgroundColor: Colors.neutral.lightGray,
        borderRadius: 12,
        padding: 4,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    modeButtonActive: {
        backgroundColor: Colors.neutral.white,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    modeText: {
        fontWeight: '600',
        color: Colors.neutral.darkGray,
    },
    modeTextActive: {
        color: Colors.primary.deep,
    },
    content: {
        padding: Spacing.m,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: Spacing.l,
        marginTop: Spacing.s,
    },
    cardIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.neutral.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    heroLogo: {
        width: 140,
        height: 50,
        marginBottom: Spacing.m,
        tintColor: Colors.primary.deep,
    },
    heroTitle: {
        color: Colors.primary.deep,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    heroText: {
        textAlign: 'center',
        color: Colors.neutral.darkGray,
        paddingHorizontal: Spacing.l,
    },
    inputContainer: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        padding: Spacing.m,
        shadowColor: Colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: Spacing.l,
    },
    label: {
        marginBottom: Spacing.xs,
        marginLeft: 4,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.neutral.lightGray,
        borderRadius: 12,
        paddingHorizontal: Spacing.m,
        height: 50,
        backgroundColor: Colors.background.light,
        marginBottom: Spacing.m,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    clearButton: {
        padding: 4,
    },
    checkButton: {
        backgroundColor: Colors.primary.main,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: Colors.neutral.mediumGray,
        shadowOpacity: 0,
    },
    buttonText: {
        color: Colors.neutral.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultCard: {
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.l,
        borderWidth: 1,
    },
    validCard: {
        backgroundColor: '#F0FDF4', // Very light green
        borderColor: Colors.status.success,
    },
    invalidCard: {
        backgroundColor: '#FEF2F2', // Very light red
        borderColor: Colors.status.error,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    resultTitle: {
        marginLeft: Spacing.s,
        color: Colors.neutral.charcoal,
    },
    balanceContainer: {
        marginLeft: 40,
    },
    balanceLabel: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
    },
    balanceValue: {
        fontSize: 32,
        color: Colors.status.success,
        marginVertical: 4,
    },
    expiryText: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        marginTop: 4,
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
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.neutral.lightGray,
        marginVertical: Spacing.l,
    },
    formGroup: {
        marginBottom: Spacing.m,
    },
    buyButton: {
        backgroundColor: Colors.primary.main,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: Spacing.l,
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
    switchModeLink: {
        alignItems: 'center',
        padding: Spacing.m,
    },
    switchModeText: {
        color: Colors.primary.main,
        textDecorationLine: 'underline',
    }
});
