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
const DOC_INFO = 'clinic_info'; // ID for the config doc

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
            const docRef = doc(db, COLLECTION_TREATMENTS, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as treatmentMenuItem;
            }
            return null;
        } catch (error) {
            console.error("Error fetching treatment:", error);
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

    sendBroadcastNotification: async (title: string, body: string) => {
        try {
            await addDoc(collection(db, COLLECTION_NOTIFICATIONS), {
                title,
                body,
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

            console.log("Seeding Complete! ✅");
            return true;
        } catch (error) {
            console.error("Seeding Failed:", error);
            throw error;
        }
    }
};
