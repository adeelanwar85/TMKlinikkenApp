
import axios from 'axios';
import { PriceCategory, PriceItem } from '../constants/Prices';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

// Define Hano Types matching the API response
export interface HanoServiceItem {
    Id: number;
    Name: string;
    Price: number;
    Duration: number;
    Description?: string;
}

export interface HanoServiceGroup {
    Id: number;
    Name: string;
    Services: HanoServiceItem[];
}

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

// Mapping from Hano Group Names to App Categories
// Keys are Hano names (lowercase check), Values are App Category IDs
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
    'sklerosering': 'laser', // eller injeksjoner? Laser is safer bucket usually
    'konsultasjon': 'konsultasjon',
    'gavekort': 'gavekort',
    // Catch-all fallbacks handled in logic
};

// Helper for standard category images/icons
const CATEGORY_META: Record<string, { title: string, icon: any, image?: any }> = {
    'injeksjoner': {
        title: 'Injeksjoner',
        icon: 'medkit-outline',
        image: require('@/assets/images/icons/icon_injeksjoner_final.png')
    },
    'hudforbedring': {
        title: 'Hudforbedring',
        icon: 'water-outline',
        image: require('@/assets/images/icons/icon_hud_final.png')
    },
    'laser': {
        title: 'Laserbehandling',
        icon: 'flash-outline',
        // No image for laser, fall back to icon
    },
    'vipper-bryn': {
        title: 'Vipper & Bryn',
        icon: 'eye-outline',
        image: require('@/assets/images/icons/icon_bryn_final.png')
    },
    'kropp': {
        title: 'Kropp & Massasje',
        icon: 'body-outline',
        image: require('@/assets/images/icons/icon_kropp_final.png')
    },
    'konsultasjon': {
        title: 'Konsultasjon',
        icon: 'chatbubbles-outline',
        image: require('@/assets/images/icons/icon_lege_final.png')
    },
    'annet': {
        title: 'Annet',
        icon: 'apps-outline',
        image: require('@/assets/images/icons/icon_lege_final.png')
    }
};

export const HanoService = {
    getTreatmentList: async (): Promise<PriceCategory[]> => {
        try {
            console.log("Fetching services from Hano...");
            const response = await client.get<HanoServiceGroup[]>('/ServiceGroup');
            const groups = response.data;

            // Map: AppCategoryID -> List of PriceItems
            const mappedCategories: Record<string, PriceItem[]> = {};

            groups.forEach(group => {
                const groupName = group.Name.toLowerCase();
                let appCatId = 'annet';

                // Find matching category
                for (const key in CATEGORY_MAPPING) {
                    if (groupName.includes(key)) {
                        appCatId = CATEGORY_MAPPING[key];
                        break;
                    }
                }

                // If no items, skip
                if (!group.Services || group.Services.length === 0) return;

                if (!mappedCategories[appCatId]) {
                    mappedCategories[appCatId] = [];
                }

                // Convert items
                group.Services.forEach(service => {
                    mappedCategories[appCatId].push({
                        name: service.Name || 'Ukjent behandling',
                        price: service.Price ? `${service.Price},-` : 'Pris på forespørsel',
                        description: service.Description || ''
                    });
                });
            });

            // Convert map to Array
            const result: PriceCategory[] = Object.keys(mappedCategories).map(catId => {
                const meta = CATEGORY_META[catId] || CATEGORY_META['annet'];
                return {
                    id: catId,
                    title: meta.title,
                    subtitle: `${mappedCategories[catId].length} behandlinger`,
                    image: meta.image,
                    icon: meta.icon,
                    items: [
                        {
                            title: '', // No subcategory title needed for broad groups
                            data: mappedCategories[catId]
                        }
                    ]
                };
            });

            // Specific Request: Order Categories
            const sortOrder = ['injeksjoner', 'hudforbedring', 'laser', 'vipper-bryn', 'kropp', 'konsultasjon', 'annet'];
            return result.sort((a, b) => {
                return sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id);
            });

        } catch (error) {
            console.error("Hano API Error:", error);
            return [];
        }
    }
};
