import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { TREATMENT_MENU, treatmentMenuItem } from '../constants/Menu';
import { CAMPAIGNS, Campaign } from '../constants/Campaigns';
import { EMPLOYEES, Employee } from '../constants/Employees';
import { MENU_ORDER } from '../constants/LocalAssets';
// Collection References
const COLLECTION_TREATMENTS = 'content_treatments';
const COLLECTION_CAMPAIGNS = 'content_campaigns';
const COLLECTION_EMPLOYEES = 'content_employees';
const COLLECTION_NOTIFICATIONS = 'content_notifications';
const COLLECTION_CONFIG = 'content_config';
const COLLECTION_PAGES = 'content_pages';
const DOC_INFO = 'clinic_info'; // ID for the config doc
const DOC_LOYALTY = 'loyalty';

// --- Types ---

// Re-export Campaign/Employee types to be used by app
export type { Campaign } from '../constants/Campaigns';
export type { Employee } from '../constants/Employees';
export type { SubTreatment } from '../constants/Menu';
export type { treatmentMenuItem } from '../constants/Menu';

export interface ClinicConfig {
    openingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    contact: {
        phone: string;
        email: string;
        address: string;
    };
    alertBanner: {
        active: boolean;
        message: string;
        level: 'info' | 'warning' | 'critical';
    };
    minAppVersion: string;
}

export interface BroadcastMessage {
    id?: string;
    title: string;
    body: string;
    date: number;
    sentBy?: string;
    image?: string | null;
}

export interface LoyaltyContent {
    intro: {
        title: string;
        body: string;
        joinTitle: string;
        joinText: string;
    };
    card: {
        subtitle: string;
    };
    sections: {
        glowCard: {
            title: string;
            body: string;
            bullets: { title: string; text: string }[];
            disclaimer: string;
        };
        points: {
            title: string;
            body: string;
            bullets: { title: string; text: string }[];
            disclaimer: string;
        };
        vip: {
            title: string;
            body: string;
            bullets: { title: string; text: string }[];
            disclaimer: string;
        };
    };
    faq: { question: string; answer: string }[];
}

// --- Default Data for Config ---
const DEFAULT_CONFIG: ClinicConfig = {
    openingHours: {
        monday: '10:00 - 16:00',
        tuesday: '10:00 - 16:00',
        wednesday: '10:00 - 16:00',
        thursday: '10:00 - 20:00',
        friday: '10:00 - 16:00',
        saturday: '11:00 - 15:00',
        sunday: 'Stengt',
    },
    contact: {
        phone: '21 42 36 36',
        email: 'post@tmklinikken.no',
        address: 'Nygaardsgata 36, 1607 Fredrikstad',
    },
    alertBanner: {
        active: false,
        message: '',
        level: 'info'
    },
    minAppVersion: '1.0.0'
};

const DEFAULT_LOYALTY_CONTENT: LoyaltyContent = {
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

export const ContentService = {

    // --- 1. TREATMENTS (Menu) ---

    getAllTreatments: async (): Promise<treatmentMenuItem[]> => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTION_TREATMENTS));
            if (snapshot.empty) return [];



            // ... (inside getAllTreatments)
            const list = snapshot.docs.map(doc => doc.data() as treatmentMenuItem);

            // Sort by defined order
            list.sort((a, b) => {
                const indexA = MENU_ORDER.indexOf(a.id);
                const indexB = MENU_ORDER.indexOf(b.id);
                // If not found, put at the end
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            return list;
        } catch (error) {
            console.error("Error fetching treatments:", error);
            return [];
        }
    },

    getTreatmentById: async (id: string): Promise<treatmentMenuItem | null> => {
        try {
            // 1. Try direct lookup (Top Level)
            const docRef = doc(db, COLLECTION_TREATMENTS, id);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                return snapshot.data() as treatmentMenuItem;
            }

            // 2. If not found, search in all treatments (Deep Search for Sub ID)
            const allDocs = await ContentService.getAllTreatments();
            for (const t of allDocs) {
                if (t.details?.subTreatments?.some(sub => sub.id === id)) {
                    return t; // Return the PARENT
                }
            }

            // 3. Fallback to constant menu (Direct)
            const menuMatch = TREATMENT_MENU.find(t => t.id === id);
            if (menuMatch) return menuMatch;

            // 4. Fallback to constant menu (Deep Search)
            for (const t of TREATMENT_MENU) {
                if (t.details?.subTreatments?.some(sub => sub.id === id)) {
                    return t;
                }
            }

            return null;
        } catch (error) {
            console.error("Error fetching treatment:", error);
            // Fallback to local
            const menuMatch = TREATMENT_MENU.find(t => t.id === id);
            if (menuMatch) return menuMatch;
            // Deep fallback local
            for (const t of TREATMENT_MENU) {
                if (t.details?.subTreatments?.some(sub => sub.id === id)) {
                    return t;
                }
            }
            return null;
        }
    },

    saveTreatment: async (treatment: treatmentMenuItem) => {
        try {
            await setDoc(doc(db, COLLECTION_TREATMENTS, treatment.id), treatment);
        } catch (error) {
            console.error("Error saving treatment:", error);
            throw error;
        }
    },

    deleteTreatment: async (id: string) => {
        try {
            await deleteDoc(doc(db, COLLECTION_TREATMENTS, id));
        } catch (error) {
            console.error("Error deleting treatment:", error);
            throw error;
        }
    },

    // --- 2. CAMPAIGNS ---

    getAllCampaigns: async (): Promise<Campaign[]> => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTION_CAMPAIGNS));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            return [];
        }
    },

    saveCampaign: async (campaign: Campaign) => {
        try {
            // Ensure ID exists
            if (!campaign.id) campaign.id = Date.now().toString();
            await setDoc(doc(db, COLLECTION_CAMPAIGNS, campaign.id), campaign);
        } catch (error) {
            console.error("Error saving campaign:", error);
            throw error;
        }
    },

    deleteCampaign: async (id: string) => {
        try {
            await deleteDoc(doc(db, COLLECTION_CAMPAIGNS, id));
        } catch (error) {
            console.error("Error deleting campaign:", error);
            throw error;
        }
    },

    // --- 3. EMPLOYEES ---

    getAllEmployees: async (): Promise<Employee[]> => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTION_EMPLOYEES));
            // Firestore doesn't guarantee order, but we can sort by name client-side
            return snapshot.docs.map(doc => doc.data() as Employee);
        } catch (error) {
            console.error("Error fetching employees:", error);
            return [];
        }
    },

    // We use Name as ID for simplicity in this MVP, or generate a random one
    saveEmployee: async (employee: Employee, originalName?: string) => {
        try {
            // If renaming, delete old doc
            if (originalName && originalName !== employee.name) {
                await deleteDoc(doc(db, COLLECTION_EMPLOYEES, originalName));
            }
            await setDoc(doc(db, COLLECTION_EMPLOYEES, employee.name), employee);
        } catch (error) {
            console.error("Error saving employee:", error);
            throw error;
        }
    },

    deleteEmployee: async (name: string) => {
        try {
            await deleteDoc(doc(db, COLLECTION_EMPLOYEES, name));
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    },

    // --- 4. CONFIG (Clinic Info, Alerts, etc) ---

    getConfig: async (): Promise<ClinicConfig> => {
        try {
            const docRef = doc(db, COLLECTION_CONFIG, DOC_INFO);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as ClinicConfig;
            }
            return DEFAULT_CONFIG;
        } catch (error) {
            console.error("Error fetching config:", error);
            return DEFAULT_CONFIG;
        }
    },
    // Alias for consistency
    getAppConfig: async () => ContentService.getConfig(),

    saveConfig: async (config: ClinicConfig) => {
        try {
            await setDoc(doc(db, COLLECTION_CONFIG, DOC_INFO), config);
        } catch (error) {
            console.error("Error saving config:", error);
            throw error;
        }
    },
    saveAppConfig: async (config: ClinicConfig) => ContentService.saveConfig(config),

    // Listen to config changes in real-time (for Alert Banner)
    subscribeToConfig: (callback: (config: ClinicConfig) => void) => {
        return onSnapshot(doc(db, COLLECTION_CONFIG, DOC_INFO), (doc) => {
            if (doc.exists()) {
                callback(doc.data() as ClinicConfig);
            } else {
                callback(DEFAULT_CONFIG);
            }
        });
    },

    // --- 5. NOTIFICATIONS (Broadcast) ---

    sendBroadcastNotification: async (title: string, body: string, image?: string) => {
        try {
            await addDoc(collection(db, COLLECTION_NOTIFICATIONS), {
                title,
                body,
                image: image || null,
                date: Date.now(),
                sentBy: 'admin'
            });
            console.log("Broadcast notification saved to DB");
        } catch (error) {
            console.error("Error sending broadcast:", error);
            throw error;
        }
    },

    getRecentBroadcasts: async (): Promise<BroadcastMessage[]> => {
        try {
            const q = query(collection(db, COLLECTION_NOTIFICATIONS), orderBy('date', 'desc')); // Limit if needed
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BroadcastMessage));
        } catch (error) {
            console.error("Error fetching broadcasts:", error);
            return [];
        }
    },

    subscribeToNotifications: (callback: (messages: BroadcastMessage[]) => void) => {
        // Listen to the last 5 notifications to detect new ones
        const q = query(collection(db, COLLECTION_NOTIFICATIONS), orderBy('date', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BroadcastMessage));
            callback(messages);
        });
    },

    // --- 6. PAGE CONTENT (Loyalty, etc) ---

    getLoyaltyContent: async (): Promise<LoyaltyContent> => {
        try {
            const docRef = doc(db, COLLECTION_PAGES, DOC_LOYALTY);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as LoyaltyContent;
            }
            return DEFAULT_LOYALTY_CONTENT;
        } catch (error) {
            console.error("Error fetching loyalty content:", error);
            return DEFAULT_LOYALTY_CONTENT;
        }
    },

    saveLoyaltyContent: async (content: LoyaltyContent) => {
        try {
            await setDoc(doc(db, COLLECTION_PAGES, DOC_LOYALTY), content);
        } catch (error) {
            console.error("Error saving loyalty content:", error);
            throw error;
        }
    },

    // --- SEEDING / MIGRATION ---

    seedAllData: async () => {
        console.log("Starting Data Seeding...");

        // Helper to sanitize data (remove local require assets)
        const sanitize = (obj: any): any => {
            if (!obj) return obj;
            if (Array.isArray(obj)) return obj.map(sanitize);
            if (typeof obj === 'object') {
                const newObj: any = {};
                for (const key in obj) {
                    const val = obj[key];
                    // Check logic: If key implies image/icon and val is not string, it's likely a require()
                    if ((key === 'image' || key.includes('Image') || key === 'icon') && typeof val !== 'string') {
                        // We cannot store local assets in Firestore. 
                        // We set it to null or a placeholder flag.
                        newObj[key] = null;
                    } else {
                        newObj[key] = sanitize(val);
                    }
                }
                return newObj;
            }
            return obj;
        };

        try {
            // 1. Treatments
            console.log("Seeding Treatments...");
            for (const item of TREATMENT_MENU) {
                const safeItem = sanitize(item);
                await setDoc(doc(db, COLLECTION_TREATMENTS, safeItem.id), safeItem);
            }

            // 2. Campaigns
            console.log("Seeding Campaigns...");
            for (const camp of CAMPAIGNS) {
                const safeCamp = sanitize(camp);
                await setDoc(doc(db, COLLECTION_CAMPAIGNS, safeCamp.id), safeCamp);
            }

            // 3. Employees
            console.log("Seeding Employees...");
            for (const emp of EMPLOYEES) {
                const safeEmp = sanitize(emp);
                await setDoc(doc(db, COLLECTION_EMPLOYEES, safeEmp.name), safeEmp);
            }

            // 4. Config
            console.log("Seeding Config...");
            const currentConfig = await getDoc(doc(db, COLLECTION_CONFIG, DOC_INFO));
            if (!currentConfig.exists()) {
                await setDoc(doc(db, COLLECTION_CONFIG, DOC_INFO), DEFAULT_CONFIG);
            }

            // 5. Pages (Loyalty)
            console.log("Seeding Pages...");
            const currentLoyalty = await getDoc(doc(db, COLLECTION_PAGES, DOC_LOYALTY));
            if (!currentLoyalty.exists()) {
                await setDoc(doc(db, COLLECTION_PAGES, DOC_LOYALTY), DEFAULT_LOYALTY_CONTENT);
            }

            console.log("Seeding Complete! ✅");
            return true;
        } catch (error) {
            console.error("Seeding Failed:", error);
            throw error;
        }
    }
};
