import { GradientHeader } from '@/src/components/GradientHeader';
import { Colors } from '@/src/theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GiftCardService, { GiftCardBalance } from '@/src/services/GiftCardService';

// --- Assets ---
const TM_SYMBOL_WHITE = require('@/assets/images/tm-symbol-white.png');

// --- Components ---

const PremiumInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: any) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={[styles.inputField, multiline && styles.textArea]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
            multiline={multiline}
            autoCapitalize="words"
        />
    </View>
);

const AmountChip = ({ amount, selected, onPress }: any) => (
    <TouchableOpacity
        style={[styles.amountChip, selected && styles.amountChipSelected]}
        onPress={() => onPress(amount)}
    >
        <Text style={[styles.amountChipText, selected && styles.amountChipTextSelected]}>
            {amount},-
        </Text>
    </TouchableOpacity>
);

const VirtualCard = ({ amount }: { amount: number }) => (
    <LinearGradient
        // TM Glød style: Deep Burgundy Gradient
        colors={[Colors.primary.main, '#3E1012']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.virtualCard}
    >
        <View style={styles.cardHeader}>
            {/* Logo: Symbol Only */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={TM_SYMBOL_WHITE}
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
            </View>
        </View>
        <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>GAVEKORT</Text>
            <Text style={styles.cardValue}>
                {amount ? `${amount} NOK` : 'Velg beløp'}
            </Text>
        </View>
        <View style={styles.cardFooter}>
            {/* Removed "Valid for all treatments" as requested */}
        </View>
    </LinearGradient>
);

// --- Main Screen ---

export default function GiftCardScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<'buy' | 'check'>('buy');

    // Purchase State
    const [amount, setAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');
    const [isBuying, setIsBuying] = useState(false);

    // Balance State
    const [code, setCode] = useState('');
    const [balanceResult, setBalanceResult] = useState<GiftCardBalance | null>(null);
    const [loading, setLoading] = useState(false);

    const PRESET_AMOUNTS = [500, 1000, 1500, 2000, 5000];

    const handlePurchase = () => {
        if (!amount || amount <= 0) {
            Alert.alert('Mangler beløp', 'Vennligst velg eller skriv inn et beløp.');
            return;
        }
        if (!recipientName || !recipientEmail || !senderName) {
            Alert.alert('Mangler info', 'Vennligst fyll ut navn og e-post.');
            return;
        }

        setIsBuying(true);

        // Robust Auto-Fill & Click Script + Checkout Redirect
        const script = `
            (function() {
                var attempts = 0;
                var maxAttempts = 20; 
                var clicked = false;

                function fillForm() {
                    if (clicked) return; // Stop if already clicked

                    // Helper to set value
                    function setVal(selectors, val) {
                        for (var i = 0; i < selectors.length; i++) {
                            var el = document.querySelector(selectors[i]);
                            if (el) {
                                el.value = val;
                                el.dispatchEvent(new Event('input', { bubbles: true }));
                                el.dispatchEvent(new Event('change', { bubbles: true }));
                                return true;
                            }
                        }
                        return false;
                    }

                    // 1. Amount
                    setVal(['input[name="amount"]', 'input[id*="amount"]', '.amount-input'], "${amount}");
                    
                    // 2. Recipient
                    setVal(['input[name="recipient_name"]', 'input[id*="recipient"]', '#recipient_name'], "${recipientName}");
                    setVal(['input[name="recipient_email"]', 'input[id*="email"]', '#recipient_email'], "${recipientEmail}");

                    // 3. Sender
                    setVal(['input[name="sender_name"]', 'input[id*="sender"]', '#your-name'], "${senderName}");
                    
                    // 4. Message
                    setVal(['textarea[name="message"]', 'textarea[id*="message"]'], "${message}");

                    // 5. CLICK BUTTON & REDIRECT
                    var btn = document.querySelector('button[type="submit"]');
                    if(btn && !btn.disabled) { 
                         // console.log("Clicking submit!");
                         btn.click();
                         clicked = true;
                         
                         // Wait for cart add (approx 2s) then go to checkout
                         setTimeout(function() {
                             window.location.href = 'https://tmklinikken.no/handlekurv/'; // Go to cart/checkout
                         }, 2000);
                    }
                    
                    attempts++;
                    if (attempts < maxAttempts && !clicked) {
                        setTimeout(fillForm, 500);
                    }
                }
                
                fillForm();
            })();
        `;

        setTimeout(() => {
            setIsBuying(false);
            router.push({
                pathname: '/webview',
                params: {
                    url: 'https://tmklinikken.no/produkter/p/gavekort/',
                    title: 'Fullfør kjøp',
                    script: script,
                    successUrl: 'order-received'
                }
            });
        }, 500);
    };

    const handleCheckBalance = async () => {
        if (!code) return;
        setLoading(true);
        setBalanceResult(null);
        try {
            const result = await GiftCardService.checkBalance(code);
            setBalanceResult(result);
        } catch (error) {
            Alert.alert('Feil', 'Kunne ikke sjekke saldo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Custom Back Button for clean layout */}
            <TouchableOpacity
                style={styles.backButtonAbsolute}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerSpacer} />

                    {/* Visual Card Preview */}
                    <View style={styles.heroSection}>
                        <VirtualCard amount={mode === 'buy' ? amount : 0} />
                    </View>

                    {/* Mode Switcher */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, mode === 'buy' && styles.activeTab]}
                            onPress={() => setMode('buy')}
                        >
                            <Text style={[styles.tabText, mode === 'buy' && styles.activeTabText]}>Kjøp nytt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, mode === 'check' && styles.activeTab]}
                            onPress={() => setMode('check')}
                        >
                            <Text style={[styles.tabText, mode === 'check' && styles.activeTabText]}>Sjekk saldo</Text>
                        </TouchableOpacity>
                    </View>

                    {mode === 'buy' ? (
                        <View style={styles.formContainer}>
                            <Text style={styles.sectionHeader}>Velg beløp</Text>
                            <View style={styles.chipGrid}>
                                {PRESET_AMOUNTS.map((a) => (
                                    <AmountChip
                                        key={a}
                                        amount={a}
                                        selected={amount === a}
                                        onPress={(val: number) => {
                                            setAmount(val);
                                            setCustomAmount('');
                                        }}
                                    />
                                ))}
                            </View>
                            <PremiumInput
                                label="Eller valgfritt beløp"
                                value={customAmount}
                                onChangeText={(t: string) => {
                                    setCustomAmount(t);
                                    setAmount(Number(t));
                                }}
                                placeholder="0"
                                keyboardType="numeric"
                            />

                            <View style={styles.divider} />

                            <Text style={styles.sectionHeader}>Mottaker</Text>
                            <PremiumInput
                                label="Navn"
                                value={recipientName}
                                onChangeText={setRecipientName}
                                placeholder="Ola Nordmann"
                            />
                            <PremiumInput
                                label="E-post"
                                value={recipientEmail}
                                onChangeText={setRecipientEmail}
                                placeholder="ola@eksempel.no"
                                keyboardType="email-address"
                            />

                            <View style={styles.divider} />

                            <Text style={styles.sectionHeader}>Fra</Text>
                            <PremiumInput
                                label="Ditt navn"
                                value={senderName}
                                onChangeText={setSenderName}
                                placeholder="Ditt navn"
                            />
                            <PremiumInput
                                label="Hilsen (valgfritt)"
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Din melding..."
                                multiline
                            />

                            <TouchableOpacity style={styles.ctaButton} onPress={handlePurchase}>
                                {isBuying ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.ctaButtonText}>Gå til betaling</Text>
                                )}
                            </TouchableOpacity>
                            <Text style={styles.disclaimer}>
                                Du blir videresendt til vår sikre betalingsløsning.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <Text style={styles.sectionHeader}>Sjekk saldo</Text>
                            <PremiumInput
                                label="Gavekortkode"
                                value={code}
                                onChangeText={setCode}
                                placeholder="12345678"
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.secondaryButton} onPress={handleCheckBalance}>
                                {loading ? (
                                    <ActivityIndicator color={Colors.primary.deep} />
                                ) : (
                                    <Text style={styles.secondaryButtonText}>Sjekk saldo</Text>
                                )}
                            </TouchableOpacity>

                            {balanceResult && (
                                <View style={[
                                    styles.resultCard,
                                    { backgroundColor: balanceResult.isValid ? '#E8F5E9' : '#FFF3E0' }
                                ]}>
                                    <Ionicons
                                        name={balanceResult.isValid ? "checkmark-circle" : "alert-circle"}
                                        size={32}
                                        color={balanceResult.isValid ? "#2E7D32" : "#E65100"}
                                        style={{ marginBottom: 8 }}
                                    />
                                    <Text style={styles.resultTitle}>
                                        {balanceResult.statusText}
                                    </Text>
                                    {balanceResult.isValid && balanceResult.balance !== undefined && (
                                        <>
                                            <Text style={styles.resultAmount}>
                                                {balanceResult.balance} NOK
                                            </Text>
                                            <Text style={styles.resultExpire}>
                                                {balanceResult.expires ? `Utløper: ${new Date(balanceResult.expires).toLocaleDateString()}` : ''}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    backButtonAbsolute: {
        position: 'absolute',
        top: 60, // Safe Area estimate
        left: 24,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        paddingBottom: 50,
        // Ensure no overlap with header if absolute, but GradientHeader usually handles it.
        // Adding top padding just in case of overlay issues.
        paddingTop: 0,
    },
    headerSpacer: {
        height: 80, // Space for the absolute back button area
    },
    heroSection: {
        width: '100%',
        alignItems: 'center',
        padding: 24,
        paddingTop: 10,
        backgroundColor: '#F8F9FA', // Seamless background
    },
    virtualCard: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        padding: 24,
        justifyContent: 'space-between',
        // Shadow for premium pop
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardBody: {
        marginTop: 20,
    },
    cardLabel: {
        color: '#D4AF37', // Gold title
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    cardValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '300', // Thin/Light
        letterSpacing: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cardSub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 16,
    },
    tab: {
        marginRight: 32,
        paddingBottom: 12,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.primary.deep,
    },
    tabText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '600',
    },
    activeTabText: {
        color: Colors.primary.deep,
    },
    formContainer: {
        padding: 24,
        paddingTop: 0,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
        marginTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 24,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    amountChip: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        minWidth: 85,
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountChipSelected: {
        backgroundColor: Colors.primary.deep,
        borderColor: Colors.primary.deep,
    },
    amountChipText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    amountChipTextSelected: {
        color: '#fff',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    inputField: {
        backgroundColor: '#fff',
        height: 60, // Taller inputs
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        height: 120,
        paddingTop: 16,
        textAlignVertical: 'top',
    },
    ctaButton: {
        backgroundColor: Colors.primary.deep,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        shadowColor: Colors.primary.deep,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    ctaButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.primary.deep,
        marginTop: 16,
    },
    secondaryButtonText: {
        color: Colors.primary.deep,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 16,
    },
    resultCard: {
        marginTop: 24,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    resultAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginVertical: 4,
    },
    resultExpire: {
        fontSize: 14,
        color: '#666',
    },
});
