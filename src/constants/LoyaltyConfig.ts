/**
 * Loyalty Program Configuration - "TM Kundeklubb" 💎
 * 
 * STRICT LEGAL REQUIREMENT (Helsepersonelloven):
 * - Medical services ("Helsehjelp") CANNOT earn points/stamps or receive discounts.
 * - Wellness services ("Velvære") CAN earn points/stamps.
 */

// Categories strictly defined as MEDICAL (No Loyalty)
export const MEDICAL_CATEGORIES = [
    'injeksjoner',
    'medisinske rynkebehandlinger',
    'filler',
    'konsultasjon',
    'lege',
    'sykepleier',
    'sklerosering',
    'svettebehandling'
];

// Categories eligible for WELLNESS (Earns Stamps/Points)
export const WELLNESS_CATEGORIES = [
    'hudforbedring',
    'dermapen',
    'kjemisk peel',
    'hud',
    'laser', // Laser hair removal is often cosmetic
    'hårfjerning',
    'ipl',
    'bryn',
    'vipper',
    'kropp',
    'massasje',
    'voks',
    'fotona', // Check if medical? Usually cosmetic laser.
    'ansikt',
    'peeling'
];

export const LOYALTY_RULES = {
    PROGRAM_NAME: 'TM Kundeklubb',
    STAMP_CARD_NAME: 'TM Glød Kort',
    CURRENCY_NAME: 'TM Poeng',

    // Tiers
    TIER_NAMES: ['Bronse', 'Sølv', 'Gull'],
    TIER_LIMITS: {
        BRONZE: 0,
        SILVER: 2500, // Points needed
        GOLD: 5000,
    },

    // Point Earning (Wellness Only)
    POINTS_PER_100_NOK: 10,

    // Stamp Rules (Wellness Only)
    MIN_PRICE_FOR_STAMP: 1500, // NOK
    STAMPS_REQUIRED_FOR_REWARD: 5,
    REWARD_NAME: 'Gratis Express Facial'
};

/**
 * Checks if a service is eligible for Loyalty Stamps/Points.
 * @param categoryId - The normalized category ID from HanoService (e.g., 'injeksjoner')
 * @param price - Service price
 */
export const isLoyaltyEligible = (categoryId: string, price: number): boolean => {
    const normalizedCat = categoryId.toLowerCase();

    // 1. Strict Medical Block
    if (MEDICAL_CATEGORIES.some(med => normalizedCat.includes(med))) {
        return false;
    }

    // 2. Wellness Allow-list + Price Check
    if (WELLNESS_CATEGORIES.some(well => normalizedCat.includes(well))) {
        return price >= LOYALTY_RULES.MIN_PRICE_FOR_STAMP;
    }

    return false; // Default to safe (no loyalty) if unknown
};
