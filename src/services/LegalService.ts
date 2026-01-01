import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type LegalType = 'terms' | 'privacy';

export interface LegalDocument {
    type: LegalType;
    title: string;
    content: string; // Markdown or simple text
    lastUpdated: number;
}

const LEGAL_COLLECTION = 'config'; // Storing in 'config' collection under document 'legal'
const LEGAL_DOC_ID = 'legal_texts';

// Default Content (Fallback / Seed)
const DEFAULT_PRIVACY = `
### 1. Innledning
TM Klinikken tar ditt personvern på alvor. Denne personvernerklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger når du bruker vår applikasjon og våre tjenester.

### 2. Ansvarlig for behandlingen
TM Klinikken er behandlingsansvarlig for personopplysningene som behandles i forbindelse med bruken av våre tjenester. Vi følger norsk personopplysningslov og EUs personvernforordning (GDPR).

### 3. Hvilke opplysninger behandler vi?
Vi kan behandle følgende kategorier av personopplysninger:
• Kontaktinformasjon: Navn, adresse, telefonnummer, e-post.
• Identifikasjon: Fødselsnummer (for sikker identifisering og journalføring).
• Helseopplysninger: Informasjon nødvendig for å yte helsehjelp. Disse lagres i vårt pasientjournalsystem (EG Hano).
• Tekniske data: Informasjon om din enhet og bruk av appen for å sikre drift og stabilitet.

### 4. Formålet med behandlingen
Vi behandler opplysningene for å:
• Yte forsvarlig helsehjelp og administrere timer.
• Kommunisere med deg om timebestillinger og prøvesvar.
• Oppfylle lovpålagte krav til journalføring.

### 5. Deling av opplysninger
Helseopplysninger behandles strengt konfidensielt og deles kun med autorisert helsepersonell. Vi deler ikke opplysninger med tredjeparter uten ditt samtykke, med mindre det er lovpålagt eller nødvendig for ytelse av helsehjelp (f.eks. til apotek for resept).

### 6. Dine rettigheter
Du har rett til innsyn i egne personopplysninger, samt krav på retting eller sletting i henhold til gjeldende lovverk. For spørsmål om journalinnsyn, ta kontakt med klinikken direkte.

### 7. Kontakt oss
Dersom du har spørsmål om personvern, kan du kontakte oss på:
E-post: post@tmklinikken.no
Telefon: 21 42 36 36
`;

const DEFAULT_TERMS = `
### 1. Om Tjenesten
TM Klinikken tilbyr medisinske og estetiske behandlinger. Vi tilstreber høyeste kvalitet og sikkerhet i alle våre tjenester.

### 2. Bestilling og Avbestilling
Avbestilling må skje minst 24 timer før timeavtale. Avbestilling gjøres enten per telefon 21 42 36 36 eller mail post@tmklinikken.no.
Hvis ikke, vil 30 % av behandlingsbeløpet faktureres. Ved ikke møtt/for sen avbestilling til gratis konsultasjon eller etterkontroll vil 300 kr faktureres.

### 3. Aldersgrense
Aldersgrensen for medisinsk rynkebehandling og fillere er 18 år. Vi sjekker legitimasjon.

### 4. Betaling
Betaling skjer i klinikken via kort, Vipps eller faktura etter endt behandling.

### 5. Personvern
Vi følger norsk lov om helsepersonell og personvern (GDPR). Din journal er taushetsbelagt og lagres trygt.
`;

export const LegalService = {
    async getLegalText(type: LegalType): Promise<LegalDocument> {
        try {
            const docRef = doc(db, LEGAL_COLLECTION, LEGAL_DOC_ID);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data[type]) {
                    return data[type] as LegalDocument;
                }
            }

            // Return default if not found
            return {
                type,
                title: type === 'privacy' ? 'Personvernerklæring' : 'Vilkår for bruk',
                content: type === 'privacy' ? DEFAULT_PRIVACY.trim() : DEFAULT_TERMS.trim(),
                lastUpdated: Date.now()
            };
        } catch (error) {
            console.error('Error fetching legal text:', error);
            // Fallback
            return {
                type,
                title: type === 'privacy' ? 'Personvernerklæring' : 'Vilkår for bruk',
                content: type === 'privacy' ? DEFAULT_PRIVACY.trim() : DEFAULT_TERMS.trim(),
                lastUpdated: Date.now()
            };
        }
    },

    async saveLegalText(type: LegalType, content: string) {
        const docRef = doc(db, LEGAL_COLLECTION, LEGAL_DOC_ID);
        const snapshot = await getDoc(docRef);

        const newDoc: LegalDocument = {
            type,
            title: type === 'privacy' ? 'Personvernerklæring' : 'Vilkår for bruk',
            content,
            lastUpdated: Date.now()
        };

        if (snapshot.exists()) {
            await updateDoc(docRef, {
                [type]: newDoc
            });
        } else {
            await setDoc(docRef, {
                [type]: newDoc
            });
        }
    }
};
