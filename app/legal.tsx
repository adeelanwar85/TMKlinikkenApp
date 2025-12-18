import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: 'privacy' | 'terms' }>();

    const isPrivacy = type === 'privacy';
    const title = isPrivacy ? 'Personvernerklæring' : 'Vilkår for bruk';

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
                {isPrivacy ? <PrivacyContent /> : <TermsContent />}
            </ScrollView>
        </SafeAreaView>
    );
}

function PrivacyContent() {
    return (
        <View>
            <Body style={styles.paragraph}>
                Sist oppdatert: 17.12.2025
            </Body>

            <H3 style={styles.heading}>1. Innledning</H3>
            <Body style={styles.paragraph}>
                TM Legetjenester tar ditt personvern på alvor. Denne personvernerklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger når du bruker vår applikasjon og våre tjenester.
            </Body>

            <H3 style={styles.heading}>2. Ansvarlig for behandlingen</H3>
            <Body style={styles.paragraph}>
                TM Legetjenester er behandlingsansvarlig for personopplysningene som behandles i forbindelse med bruken av våre tjenester. Vi følger norsk personopplysningslov og EUs personvernforordning (GDPR).
            </Body>

            <H3 style={styles.heading}>3. Hvilke opplysninger behandler vi?</H3>
            <Body style={styles.paragraph}>
                Vi kan behandle følgende kategorier av personopplysninger:
                {'\n'}• Kontaktinformasjon: Navn, adresse, telefonnummer, e-post.
                {'\n'}• Identifikasjon: Fødselsnummer (for sikker identifisering og journalføring).
                {'\n'}• Helseopplysninger: Informasjon nødvendig for å yte helsehjelp. Disse lagres i vårt pasientjournalsystem (Pasientsky).
                {'\n'}• Tekniske data: Informasjon om din enhet og bruk av appen for å sikre drift og stabilitet.
            </Body>

            <H3 style={styles.heading}>4. Formålet med behandlingen</H3>
            <Body style={styles.paragraph}>
                Vi behandler opplysningene for å:
                {'\n'}• Yte forsvarlig helsehjelp og administrere timer.
                {'\n'}• Kommunisere med deg om timebestillinger og prøvesvar.
                {'\n'}• Oppfylle lovpålagte krav til journalføring.
            </Body>

            <H3 style={styles.heading}>5. Deling av opplysninger</H3>
            <Body style={styles.paragraph}>
                Helseopplysninger behandles strengt konfidensielt og deles kun med autorisert helsepersonell. Vi deler ikke opplysninger med tredjeparter uten ditt samtykke, med mindre det er lovpålagt eller nødvendig for ytelse av helsehjelp (f.eks. til apotek for resept).
            </Body>

            <H3 style={styles.heading}>6. Dine rettigheter</H3>
            <Body style={styles.paragraph}>
                Du har rett til innsyn i egne personopplysninger, samt krav på retting eller sletting i henhold til gjeldende lovverk. For spørsmål om journalinnsyn, ta kontakt med klinikken direkte.
            </Body>

            <H3 style={styles.heading}>7. Kontakt oss</H3>
            <Body style={styles.paragraph}>
                Dersom du har spørsmål om personvern, kan du kontakte oss på:
                {'\n'}E-post: post@tmklinikken.no
                {'\n'}Telefon: 21 42 36 36
            </Body>
        </View>
    );
}

function TermsContent() {
    return (
        <View>
            <Body style={styles.paragraph}>
                Gjeldende fra: 18.12.2025
            </Body>

            <H3 style={styles.heading}>1. Om Tjenesten</H3>
            <Body style={styles.paragraph}>
                TM Klinikken tilbyr medisinske og estetiske behandlinger. Vi tilstreber høyeste kvalitet og sikkerhet i alle våre tjenester.
            </Body>

            <H3 style={styles.heading}>2. Bestilling og Avbestilling</H3>
            <Body style={styles.paragraph}>
                Timebestilling er bindende. Avbestilling må skje senest **24 timer** før avtalt tid.
                {'\n'}
                Ved manglende oppmøte eller for sen avbestilling vil timen faktureres i sin helhet.
            </Body>

            <H3 style={styles.heading}>3. Aldersgrense</H3>
            <Body style={styles.paragraph}>
                Aldersgrensen for medisinsk rynkebehandling og fillere er 18 år. Vi sjekker legitimasjon.
            </Body>

            <H3 style={styles.heading}>4. Betaling</H3>
            <Body style={styles.paragraph}>
                Betaling skjer i klinikken via kort, Vipps eller faktura etter endt behandling.
            </Body>

            <H3 style={styles.heading}>5. Personvern</H3>
            <Body style={styles.paragraph}>
                Vi følger norsk lov om helsepersonell og personvern (GDPR). Din journal er taushetsbelagt og lagres trygt.
            </Body>
        </View>
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
        marginBottom: Spacing.s,
        marginTop: Spacing.l,
        color: Colors.primary.deep,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.neutral.charcoal,
        marginBottom: Spacing.s,
    },
});
