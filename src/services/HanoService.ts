import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PriceCategory, PriceItem } from '../constants/Prices';
import { Service, Department, AvailableSlot } from '../types/HanoTypes';
import { LOCAL_ASSET_MAP } from '../constants/LocalAssets';

// --- Configuration ---
const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY || '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
export const DEPARTMENT_ID = parseInt(process.env.EXPO_PUBLIC_HANO_TENANT_ID || '1', 10);

// Toggle for development/testing
const USE_MOCK = false;

// --- Types ---
export interface Appointment {
    Id: number;
    Service: string;
    Start: string;
    End: string;
    Status: 'Confirmed' | 'Cancelled';
}

export interface CreateBookingPayload {
    departmentId: number;
    serviceId: number;
    start: string; // ISO
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        comment?: string;
    };
}

export interface HanoServiceItem {
    Id: number;
    Name: string;
    Price: number;
    Duration: number; // in seconds? or minutes? Hano typically V2 uses seconds or duration string. hanoClient had Duration: '00:30:00'.
    // Let's align with what V2 usually returns for /Service. hanoClient used string.
    // However, existing HanoService used `Duration: number`.
    // We will handle safe parsing.
    Description?: string;
}

export interface HanoServiceGroup {
    Id: number;
    Name: string;
    Services: HanoServiceItem[];
}

// --- Client Setup ---
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

// Interceptor for debugging
client.interceptors.request.use(config => {
    // console.log('[HanoService] Request:', config.method?.toUpperCase(), config.url);
    return config;
});

// --- Mock Data ---
export const mockTreatments: Service[] = [
    { Id: 1, Name: 'Konsultasjon - Hudlege', Duration: '00:30:00', Price: 500, CategoryId: 'cat1', CategoryName: 'Konsultasjon' },
    { Id: 2, Name: 'Rynkebehandling 1 område', Duration: '00:30:00', Price: 2500, CategoryId: 'cat2', CategoryName: 'Injeksjoner' },
    { Id: 3, Name: 'Filler Lepper (0.5ml)', Duration: '00:45:00', Price: 3000, CategoryId: 'cat2', CategoryName: 'Injeksjoner' },
    { Id: 4, Name: 'Dermapen Full Ansikt', Duration: '01:00:00', Price: 2200, CategoryId: 'cat3', CategoryName: 'Hudforbedring' },
    { Id: 5, Name: 'Kjemisk Peeling', Duration: '00:30:00', Price: 1500, CategoryId: 'cat3', CategoryName: 'Hudforbedring' },
    { Id: 6, Name: 'Laser Hårfjerning (Armhuler)', Duration: '00:20:00', Price: 1200, CategoryId: 'cat4', CategoryName: 'Laser' },
    { Id: 7, Name: 'Fettfjerning (Mage)', Duration: '01:00:00', Price: 5000, CategoryId: 'cat5', CategoryName: 'Kropp' },
];

const mockSlots: AvailableSlot[] = [
    { Start: "2025-12-20T09:00:00", End: "2025-12-20T09:30:00", EmployeeId: 1, EmployeeName: "Dr. Hansen" },
    { Start: "2025-12-20T10:00:00", End: "2025-12-20T10:30:00", EmployeeId: 1, EmployeeName: "Dr. Hansen" },
    { Start: "2025-12-20T14:00:00", End: "2025-12-20T14:30:00", EmployeeId: 2, EmployeeName: "Sykepleier Kari" }
];

export let mockAppointments: Appointment[] = [
    { Id: 101, Service: 'Rynkebehandling', Start: '2025-12-28T10:00:00', End: '2025-12-28T10:30:00', Status: 'Confirmed' },
    { Id: 102, Service: 'Konsultasjon', Start: '2026-01-05T14:00:00', End: '2026-01-05T14:30:00', Status: 'Confirmed' }
];

// --- Categories Logic (for Prices Screen) ---
const CATEGORY_MAPPING: Record<string, string> = {
    'injeksjoner': 'injeksjoner',
    'medisinske rynkebehandlinger': 'injeksjoner',
    'filler': 'injeksjoner',
    'hudforbedring': 'hudforbedring',
    'dermapen': 'hudforbedring',
    'kjemisk peel': 'hudforbedring',
    'hud': 'hudforbedring',
    'laser': 'laser',
    'hårfjerning': 'laser',
    'ipl': 'laser',
    'bryn': 'vipper-bryn',
    'vipper': 'vipper-bryn',
    'fotona': 'laser',
    'kropp': 'kropp',
    'massasje': 'kropp',
    'sklerosering': 'laser',
    'konsultasjon': 'konsultasjon',
    'gavekort': 'gavekort',
    'ansikt': 'ansikt',
    'syre': 'ansikt',
    'peeling': 'hudforbedring', // Catch 'Peelinger'
    'kårforbedring': 'hudforbedring',
    'kombinasjon': 'kombinasjon',
    'voks': 'voks',
    'lege': 'konsultasjon',
    'sykepleier': 'konsultasjon',
    'diverse': 'annet',
    'injeksjon': 'injeksjoner', // Catch 'injeksjonsbehandlinger'
};



// ... (existing imports)

// ...

const CATEGORY_META: Record<string, { title: string, icon: any, image?: any }> = {
    'injeksjoner': { title: 'Injeksjoner', icon: 'medkit-outline', image: LOCAL_ASSET_MAP['injeksjoner'] },
    'hudforbedring': { title: 'Hudforbedring', icon: 'water-outline', image: LOCAL_ASSET_MAP['peelinger'] }, // Using peelinger/hud icon
    'laser': { title: 'Laserbehandling', icon: 'flash-outline', image: LOCAL_ASSET_MAP['laser'] },
    'vipper-bryn': { title: 'Vipper & Bryn', icon: 'eye-outline', image: LOCAL_ASSET_MAP['vipper_bryn'] },
    'kropp': { title: 'Kropp & Massasje', icon: 'body-outline', image: LOCAL_ASSET_MAP['kropp_massasje'] },
    'ansikt': { title: 'Ansiktsbehandlinger', icon: 'happy-outline', image: LOCAL_ASSET_MAP['ansikt'] },
    'kombinasjon': { title: 'Kombinasjonsbehandlinger', icon: 'layers-outline', image: LOCAL_ASSET_MAP['kombinasjon'] },
    'voks': { title: 'Voksing', icon: 'cut-outline', image: LOCAL_ASSET_MAP['voks'] },
    'konsultasjon': { title: 'Konsultasjon', icon: 'chatbubbles-outline', image: LOCAL_ASSET_MAP['diverse'] }, // Using EKG icon
    'annet': { title: 'Annet', icon: 'apps-outline', image: LOCAL_ASSET_MAP['diverse'] }
};

// --- Helper: Local Storage for Mocks ---
const getStoredAppointments = async (): Promise<Appointment[]> => {
    try {
        const stored = await AsyncStorage.getItem('mockAppointments');
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load mock appointments", e);
    }
    return mockAppointments;
};

// --- Main Service Export ---
export const HanoService = {

    // --- PRICE LIST (Newer Logic) ---
    getTreatmentList: async (): Promise<PriceCategory[]> => {
        try {
            // console.log("Fetching services from Hano...");
            // Use /ServiceGroup to get hierarchy
            const response = await client.get<HanoServiceGroup[]>('/ServiceGroup');
            const groups = response.data;

            const mappedCategories: Record<string, PriceItem[]> = {};

            groups.forEach(group => {
                const groupName = group.Name.toLowerCase();
                let appCatId = 'annet';

                for (const key in CATEGORY_MAPPING) {
                    if (groupName.includes(key)) {
                        appCatId = CATEGORY_MAPPING[key];
                        break;
                    }
                }

                if (!group.Services || group.Services.length === 0) return;

                if (!mappedCategories[appCatId]) mappedCategories[appCatId] = [];

                group.Services.forEach(service => {
                    mappedCategories[appCatId].push({
                        name: service.Name || 'Ukjent behandling',
                        price: service.Price ? `${service.Price},-` : 'Pris på forespørsel',
                        description: service.Description || '',
                        id: service.Id,
                        duration: service.Duration
                    });
                });
            });

            const result: PriceCategory[] = Object.keys(mappedCategories).map(catId => {
                const meta = CATEGORY_META[catId] || CATEGORY_META['annet'];
                return {
                    id: catId,
                    title: meta.title,
                    subtitle: `${mappedCategories[catId].length} behandlinger`,
                    image: meta.image,
                    icon: meta.icon,
                    items: [{ title: '', data: mappedCategories[catId] }]
                };
            });

            const sortOrder = ['injeksjoner', 'laser', 'hudforbedring', 'ansikt', 'kombinasjon', 'vipper-bryn', 'voks', 'kropp', 'konsultasjon', 'annet'];
            return result.sort((a, b) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id));

        } catch (error) {
            console.error("Hano API (PriceList) Error:", error);
            return [];
        }
    },

    // --- BOOKING LOGIC (Migrated from hanoClient) ---

    getDepartments: async (): Promise<Department[]> => {
        try {
            const response = await client.get('/Department');
            return Array.isArray(response.data) ? response.data : [response.data];
        } catch (error) {
            if (USE_MOCK) return [{ Id: 1, Name: "TM Klinikken (Mock)", Description: "Mock Department" }];
            console.error('Error fetching departments:', error);
            throw error;
        }
    },

    getTreatments: async (): Promise<Service[]> => {
        try {
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return mockTreatments;
            }
            const response = await client.get('/Service');
            return response.data;
        } catch (error) {
            console.error('Error fetching treatments:', error);
            if (USE_MOCK) return mockTreatments;
            throw error;
        }
    },

    getAvailableSlots: async (treatmentId: number, date: string): Promise<AvailableSlot[]> => {
        try {
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return mockSlots.map(s => ({
                    ...s,
                    Start: s.Start.replace('2025-12-20', date),
                    End: s.End.replace('2025-12-20', date)
                }));
            }

            const from = `${date}T00:00:00`;
            const to = `${date}T23:59:59`;

            const response = await client.get('/time/search', {
                params: {
                    from,
                    to,
                    departmentId: DEPARTMENT_ID,
                    serviceId: treatmentId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching available slots:', error);
            return [];
        }
    },

    createAppointment: async (payload: CreateBookingPayload) => {
        try {
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const service = mockTreatments.find(t => t.Id === payload.serviceId)?.Name || 'Behandling';
                const newAppointment: Appointment = {
                    Id: Math.floor(Math.random() * 10000) + 200,
                    Service: service,
                    Start: payload.start,
                    End: new Date(new Date(payload.start).getTime() + 30 * 60000).toISOString(),
                    Status: 'Confirmed'
                };
                const currentList = await getStoredAppointments();
                currentList.push(newAppointment);
                mockAppointments = currentList;
                await AsyncStorage.setItem('mockAppointments', JSON.stringify(currentList));
                return { Success: true, Message: "Mock Booking Confirmed" };
            }

            const apiPayload = {
                DepartmentId: payload.departmentId,
                ServiceId: payload.serviceId,
                StartDate: payload.start,
                Customer: {
                    FirstName: payload.customer.firstName,
                    LastName: payload.customer.lastName,
                    Email: payload.customer.email,
                    Mobile: payload.customer.phone,
                },
                Comment: payload.customer.comment
            };

            const response = await client.post('/Activity/reservation/create', apiPayload);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    getUserAppointments: async (): Promise<Appointment[]> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const appointments = await getStoredAppointments();
            return appointments.filter(a => a.Status === 'Confirmed');
        }
        return [];
    },

    cancelAppointment: async (appointmentId: number): Promise<boolean> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 800));
            const currentList = await getStoredAppointments();
            const index = currentList.findIndex(a => a.Id === appointmentId);
            if (index !== -1) {
                currentList[index].Status = 'Cancelled';
                await AsyncStorage.setItem('mockAppointments', JSON.stringify(currentList));
                return true;
            }
            return false;
        }
        return true;
    }
};

export default HanoService;
