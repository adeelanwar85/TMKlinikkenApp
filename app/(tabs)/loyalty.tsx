import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H1, H2, Body, H3, Caption } from '@/src/theme/Typography';
import { GlowCard } from '@/src/components/GlowCard';
import { useAuth } from '@/src/context/AuthContext';
import { ContentService, LoyaltyContent } from '@/src/services/ContentService';

// Default content for instant render (identical to current hardcoded text)
const INITIAL_CONTENT: LoyaltyContent = {
    intro: {
        title: "Velkommen til TM Kundeklubb",
        body: "Vi ønsker å belønne deg som velger TM Klinikken for din hudhelse og velvære. Gjennom vårt fordelsprogram får du faste fordeler, bonuspoeng på favorittprodukter og eksklusive VIP-goder.",
        joinTitle: "Hvordan blir jeg medlem?",
        joinText: "Det er helt gratis! Last ned og registrer deg i TM-appen."
    },
    card: {
        subtitle: "Samle 5 stempler – få en belønning!"
    },
    sections: {
        glowCard: {
            title: "1. TM Glød Kort – Ditt digitale klippekort",
            body: "Ta vare på huden din og bli belønnet! Med vårt digitale klippekort i appen samler du stempler på hud- og velværebehandlinger.",
            bullets: [
                { title: "Slik fungerer det:", text: "Du får 1 stempel for hver hudbehandling over 1500 kr" },
                { title: "", text: "Gjelder for populære behandlinger som Hydrafacial, Dermapen og klassiske ansiktsbehandlinger" },
                { title: "", text: "Når du har samlet 5 stempler, får du din 6. behandling gratis!" }
            ],
            disclaimer: "*Merk: TM Glød Kort gjelder kun hudpleiebehandlinger, ikke medisinske injeksjoner iht. lovverk.*"
        },
        points: {
            title: "2. TM Poeng – Bonus på alle produkter",
            body: "Vi vil at det skal lønne seg å handle hudpleie lokalt. Derfor får du alltid bonuspoeng når du kjøper produkter hos oss.",
            bullets: [
                { title: "10 % bonuspoeng:", text: "Du får 10 % bonuspoeng på alle fysiske produkter (gjelder ikke reseptbelagte varer)" },
                { title: "", text: "Poengene kan brukes som betaling på ditt neste produktkjøp" },
                { title: "", text: "Poengene er gyldige i 12 måneder fra kjøpsdato" }
            ],
            disclaimer: "*Vi sender deg en vennlig påminnelse i appen før poengene dine utløper, slik at du rekker å bruke dem!*"
        },
        vip: {
            title: "3. VIP-Status: Gull-medlem",
            body: "For våre mest lojale kunder har vi en egen VIP-status som gir deg det lille ekstra.",
            bullets: [
                { title: "Slik blir du Gull-medlem:", text: "Handler du for over 15 000 kr i løpet av et år, blir du automatisk Gull-medlem. Alt du kjøper hos oss teller – også injeksjonsbehandlinger." },
                { title: "Dine Gull-fordeler:", text: "Prioritert booking: Få tilgang til timer før alle andre" },
                { title: "", text: "Gratis hudanalyse: Én grundig hudanalyse i året inkludert" },
                { title: "", text: "Eksklusive invitasjoner: Bli prioritert til våre populære kundekvelder og arrangementer" },
                { title: "", text: "Ekstra lang poenggyldighet: Dine TM Poeng varer i 24 måneder (dobbelt så lenge som vanlige medlemmer)" }
            ],
            disclaimer: "*Har du spørsmål om kundeklubben? Kontakt oss eller spør ved din neste behandling!*"
        }
    },
    faq: [
        { question: "Hvor lenge er mine TM Poeng gyldige?", answer: "Dine opptjente bonuspoeng er gyldige i 12 måneder fra kjøpsdatoen. Vi sender deg en vennlig påminnelse i appen før poengene dine utløper, slik at du rekker å bruke dem på dine favorittprodukter!" },
        { question: "Utløper alle poengene mine samtidig?", answer: "Nei! Hvert kjøp har sin egen utløpsdato (12 måneder fra kjøpsdato). Dette betyr at poengene dine utløper rullerende, ikke alle på én gang." },
        { question: "Hva skjer med min Gull-status etter ett år?", answer: "Din Gull-status fornyes automatisk hvis du handler for over 15 000 kr i løpet av de siste 12 månedene. Vi varsler deg i appen når du nærmer deg fornyelse." },
        { question: "Kan jeg kombinere TM Poeng med gratis behandling fra TM Glød Kort?", answer: "Ja! Du kan bruke TM Poeng på produktkjøp selv om du løser inn en gratis behandling." },
        { question: "Utløper stemplene mine på TM Glød Kort?", answer: "Hvert stempel i ditt digitale TM Glød Kort er gyldig i 12 måneder fra den datoen behandlingen ble utført. Vi ønsker å hjelpe deg med å oppnå de beste resultatene for din hud, og anbefaler derfor jevnlige behandlinger for å holde gløden ved like!" }
    ]
};

export default function LoyaltyScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const [content, setContent] = useState<LoyaltyContent>(INITIAL_CONTENT);

    useEffect(() => {
        const fetchContent = async () => {
            const data = await ContentService.getLoyaltyContent();
            if (data) setContent(data);
        };
        fetchContent();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Header Title (Left Aligned) */}
                <View style={styles.topHeader}>
                    <Caption style={styles.topTagline}>DINE FORDELER</Caption>
                    <H1 style={styles.pageTitle}>Kundeklubb</H1>
                </View>

                {/* 2. Welcome & Logo (Centered) */}
                <View style={styles.welcomeSection}>
                    <Image
                        source={require('@/assets/images/tm-logo.png')}
                        style={styles.brandLogo}
                        resizeMode="contain"
                    />
                    <H2 style={styles.title}>{content.intro.title}</H2>
                </View>

                {/* 3. The Card */}
                <View style={styles.cardContainer}>
                    <GlowCard stamps={user?.loyalty?.stamps ?? 0} subtitle={content.card.subtitle} />
                </View>

                {/* 4. Stats Row */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Body style={styles.statLabel}>DINE POENG</Body>
                        <H2 style={styles.statValue}>{user?.loyalty?.points ?? 0}</H2>
                        <Caption style={styles.conversionText}>Verdi: {Math.floor((user?.loyalty?.points ?? 0) / 10)},- NOK</Caption>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statBox}>
                        <Body style={styles.statLabel}>MEDLEMSKAP</Body>
                        <H2 style={[styles.statValue, { color: Colors.primary.main }]}>
                            {(user?.loyalty?.tier ?? 'Bronse').toUpperCase()}
                        </H2>
                        <Caption style={styles.conversionText}>Neste nivå: Sølv</Caption>
                    </View>
                </View>

                {/* 5. Intro Content (Moved Below) */}
                <View style={styles.contentBody}>
                    <Body style={styles.introText}>
                        {content.intro.body}
                    </Body>

                    <View style={styles.joinContainer}>
                        <Body style={styles.joinTitle}>{content.intro.joinTitle}</Body>
                        <Body style={styles.joinText}>{content.intro.joinText}</Body>
                    </View>
                </View>

                {/* Section 1: GLØD KORT */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.iconCircle}><Body style={{ fontSize: 20 }}>✨</Body></View>
                        <H3 style={styles.sectionTitle}>{content.sections.glowCard.title}</H3>
                    </View>

                    <Body style={styles.sectionBody}>
                        {content.sections.glowCard.body}
                    </Body>

                    {content.sections.glowCard.bullets.map((bullet, index) => (
                        <View key={index} style={styles.bulletPoint}>
                            {bullet.title ? <Body style={styles.bulletTitle}>{bullet.title}</Body> : null}
                            <Body style={styles.bulletText}>{bullet.title ? `• ${bullet.text}` : `• ${bullet.text}`}</Body>
                        </View>
                    ))}

                    <Caption style={styles.disclaimer}>
                        {content.sections.glowCard.disclaimer}
                    </Caption>
                </View>

                {/* Section 2: POENG */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.iconCircle}><Body style={{ fontSize: 20 }}>💰</Body></View>
                        <H3 style={styles.sectionTitle}>{content.sections.points.title}</H3>
                    </View>

                    <Body style={styles.sectionBody}>
                        {content.sections.points.body}
                    </Body>

                    {content.sections.points.bullets.map((bullet, index) => (
                        <View key={index} style={styles.bulletPoint}>
                            {bullet.title ? <Body style={styles.bulletTitle}>{bullet.title}</Body> : null}
                            <Body style={styles.bulletText}>{bullet.title ? `• ${bullet.text}` : `• ${bullet.text}`}</Body>
                        </View>
                    ))}

                    <Caption style={styles.disclaimer}>
                        {content.sections.points.disclaimer}
                    </Caption>
                </View>

                {/* Section 3: VIP */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.iconCircle}><Body style={{ fontSize: 20 }}>🏆</Body></View>
                        <H3 style={styles.sectionTitle}>{content.sections.vip.title}</H3>
                    </View>

                    <Body style={styles.sectionBody}>
                        {content.sections.vip.body}
                    </Body>

                    {content.sections.vip.bullets.map((bullet, index) => (
                        <View key={index} style={styles.bulletPoint}>
                            {bullet.title ? <Body style={styles.bulletTitle}>{bullet.title}</Body> : null}
                            <Body style={styles.bulletText}>
                                {bullet.title ? `• ` : `• `}
                                {bullet.title && <Body style={{ fontWeight: '700' }}>{bullet.title} </Body>}
                                {bullet.text}
                            </Body>
                        </View>
                    ))}

                    <Caption style={styles.disclaimer}>
                        {content.sections.vip.disclaimer}
                    </Caption>
                </View>

                {/* FAQ SECTION */}
                <View style={[styles.section, { borderBottomWidth: 0 }]}>
                    <H2 style={[styles.sectionTitle, { textAlign: 'center', fontSize: 22, marginTop: Spacing.s, marginBottom: Spacing.xl }]}>Ofte stilte spørsmål om TM Kundeklubb</H2>

                    {content.faq.map((item, index) => (
                        <View key={index} style={styles.faqItem}>
                            <Body style={styles.faqQuestion}>{item.question}</Body>
                            <Body style={styles.faqAnswer}>{item.answer}</Body>
                        </View>
                    ))}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background.main, // Clean off-white
    },
    scrollContent: {
        padding: Spacing.l,
        paddingBottom: 40,
    },
    topHeader: {
        marginBottom: Spacing.l,
        marginTop: Spacing.s,
        alignItems: 'flex-start',
    },
    topTagline: {
        color: Colors.neutral.darkGray,
        letterSpacing: 2,
        fontWeight: 'bold',
        fontSize: 10,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    pageTitle: {
        fontSize: 36,
        color: Colors.primary.deep, // Brand color title
        letterSpacing: -0.5,
    },
    welcomeSection: {
        marginBottom: Spacing.l,
        alignItems: 'center',
    },
    brandLogo: {
        width: 140,
        height: 35,
        opacity: 0.9,
        marginBottom: Spacing.m,
    },
    cardContainer: {
        marginVertical: Spacing.m,
        alignItems: 'center',
    },
    contentBody: {
        marginVertical: Spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        color: Colors.neutral.charcoal,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    introText: {
        textAlign: 'center',
        color: Colors.neutral.darkGray,
        lineHeight: 24,
        fontSize: 15,
        marginBottom: Spacing.m,
        maxWidth: 340, // Ensure it doesn't get too wide on tablets, but fills phone
    },
    joinContainer: {
        marginBottom: Spacing.xl,
        alignItems: 'center',
        backgroundColor: Colors.primary.light,
        padding: Spacing.m,
        borderRadius: 12,
        width: '100%',
        maxWidth: 340,
    },
    joinTitle: {
        fontWeight: '700',
        color: Colors.primary.deep,
        marginBottom: 4,
        fontSize: 16
    },
    joinText: {
        textAlign: 'center',
        color: Colors.primary.deep,
        lineHeight: 20,
    },
    section: {
        marginBottom: Spacing.xxl,
        paddingBottom: Spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
        marginBottom: Spacing.m,
        fontWeight: '700',
    },
    sectionBody: {
        fontSize: 15,
        color: Colors.neutral.darkGray,
        lineHeight: 22,
        marginBottom: Spacing.m,
    },
    bulletPoint: {
        marginTop: Spacing.s,
        marginBottom: Spacing.m,
        backgroundColor: Colors.neutral.cream,
        padding: Spacing.m,
        borderRadius: 12,
    },
    bulletTitle: {
        fontWeight: '700',
        color: Colors.neutral.charcoal,
        marginBottom: 6,
        fontSize: 15,
    },
    bulletText: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        lineHeight: 22,
        marginBottom: 4,
    },
    disclaimer: {
        fontStyle: 'italic',
        color: Colors.neutral.mediumGray,
        marginTop: Spacing.s,
        fontSize: 13,
    },
    cardContainer: {
        marginVertical: Spacing.m,
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.neutral.cream,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    divider: {
        width: 1,
        backgroundColor: Colors.neutral.lightGray,
        marginHorizontal: Spacing.s,
    },
    statLabel: {
        fontSize: 10,
        color: Colors.neutral.mediumGray,
        marginBottom: 6,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    statValue: {
        fontSize: 26,
        color: Colors.primary.deep,
        marginBottom: 2,
        fontWeight: '600'
    },
    conversionText: {
        fontSize: 11,
        color: Colors.neutral.mediumGray,
    },
    faqItem: {
        marginBottom: Spacing.m,
        paddingBottom: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.neutral.charcoal,
        marginBottom: 4,
    },
    faqAnswer: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        lineHeight: 20,
    },
    joinContainer: {
        marginTop: Spacing.m,
        alignItems: 'center',
    }
});
