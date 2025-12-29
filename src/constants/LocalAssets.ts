export const LOCAL_ASSET_MAP: Record<string, any> = {
    'injeksjoner': require('@/assets/images/icons/icon_injeksjoner_final.png'),
    'laser': null, // This one uses a custom icon component (LaserIcon) via 'custom-laser' string
    'peelinger': require('@/assets/images/icons/icon_hud_final.png'),
    'ansikt': require('@/assets/images/icons/icon_ansikt_final.png'),
    // 'kombinasjon' uses 'rose-outline' icon string, so no image needed
    'vipper_bryn': require('@/assets/images/icons/icon_bryn_final.png'),
    'voks': require('@/assets/images/icons/icon_kropp_final.png'),
    'kropp_massasje': require('@/assets/images/icons/icon_kropp_final.png'),
    // 'diverse' uses 'apps-outline' icon string
    'priser': require('@/assets/images/illustrations/doctor_v2.png'),
    'bestill': require('@/assets/images/illustrations/doctor_v2.png'),
};

export const MENU_ORDER = [
    'injeksjoner',
    'laser',
    'peelinger',
    'ansikt',
    'kombinasjon',
    'vipper_bryn',
    'voks',
    'kropp_massasje',
    'diverse',
    'priser',
    'bestill'
];
