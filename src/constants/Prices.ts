
export interface PriceItem {
    name: string;
    price: string;
    description?: string;
    fromPrice?: boolean;
}

export interface PriceCategory {
    id: string;
    title: string;
    keywords?: string[]; // Search synonyms
    icon?: string;
    image?: any; // Custom image asset
    items: {
        title?: string; // Subcategory title
        keywords?: string[]; // Subcategory synonyms
        data: PriceItem[];
    }[];
}

export const PRICES: PriceCategory[] = [
    {
        id: 'injeksjoner',
        title: 'Injeksjonsbehandlinger',
        keywords: ['botox', 'azzalure', 'dysport', 'rynker', 'linjer', 'svette', 'migrene', 'filler', 'juvederm', 'teosyal', 'lepper', 'lips', 'kinn', 'hake', 'kjeve', 'profhilo', 'skinbooster'],
        icon: 'medkit-outline',
        image: require('@/assets/images/icons/icon_injeksjoner_final.png'),
        items: [
            {
                title: 'Medisinske injeksjoner',
                keywords: ['botox', 'rynkebehandling', 'svettebehandling', 'migrene', 'tanngnissing'],
                data: [
                    { name: '1 område', price: '1950 kr' },
                    { name: '2 områder', price: '2950 kr' },
                    { name: '3 områder', price: '3700 kr' },
                    { name: '4 områder', price: '4250 kr' },
                    { name: 'Platysma (stramme halsbånd)', price: '2950 kr' },
                    { name: 'Munnviker (dao)', price: '1200 kr' },
                    { name: 'Linjer overleppe', price: '1200 kr' },
                    { name: 'Linjer nese', price: '1200 kr' },
                    { name: 'Linjer under øyne', price: '1200 kr' },
                    { name: 'Lipflip', price: '1200 kr' },
                    { name: 'Øyebrynsløft', price: '1950 kr' },
                    { name: 'Migrene', price: 'Pris på forespørsel' },
                ]
            },
            {
                title: 'Fillerbehandlinger',
                keywords: ['lepper', 'volum', 'contouring', 'teosyal', 'juvederm'],
                data: [
                    { name: 'Leppefiller (TM lips) 0,5 ml', price: '3000 kr' },
                    { name: 'Leppefiller (TM lips) 0,7 ml', price: '3500 kr' },
                    { name: 'Leppefiller (TM lips) 1 ml', price: '3600 kr' },
                    { name: 'Filler i linjer rundt munnen 1,2 ml', price: '3600 kr' },
                    { name: 'Filler munnviker 1,2 ml', price: '3600 kr' },
                    { name: 'Filler nasolabiale (nese til munn)', price: '3600 kr' },
                    { name: 'Filler nese 1,2 ml', price: '3600 kr' },
                    { name: 'Filler kinnben/kinn 1,2 ml', price: '3600 kr' },
                    { name: 'Filler kjeveparti 1,2 ml', price: '3600 kr' },
                    { name: 'Filler hake 1,2 ml', price: '3600 kr' },
                    { name: 'Tear trough (under øyne) 1 ml', price: '3900 kr' },
                    { name: 'Øyenbrynsløft med filler 1,2 ml', price: '3600 kr', fromPrice: true },
                    { name: 'Filler øreflipp', price: '3000 - 3600 kr' },
                    { name: 'Filler tinning (fra 1,2 ml)', price: '3600 kr' },
                    { name: 'Facelift med filler', price: '10 000 kr', fromPrice: true },
                    { name: 'Skinbooster', price: '2300 kr' },
                    { name: 'Profhilo Structura ansikt', price: '3500 kr' },
                    { name: 'Legemiddel for fjerning av filler', price: '1500 kr', fromPrice: true },
                ]
            },
            {
                title: 'Bio-stimulator',
                keywords: ['sculptra', 'radiesse', 'hudoppstramming', 'kollagen'],
                data: [
                    { name: 'Ansikt', price: '3500 kr' },
                    { name: 'Hals', price: '3500 kr' },
                    { name: 'Ansikt og hals (Pakkepris)', price: '5500 kr' },
                    { name: 'Ansikt (Kur x3)', price: '8500 kr' },
                    { name: 'Hals (Kur x3)', price: '8500 kr' },
                    { name: 'Ansikt og hals (Kur x3)', price: '13 500 kr' },
                    { name: 'Polynukleotider', price: '3500 kr' },
                    { name: 'Polynukleotider (Kur x3)', price: '8500 kr' },
                ]
            },
            {
                title: 'Spesialbehandlinger',
                data: [
                    { name: 'Tanngnissing / spent kjeve', price: '3200 kr' },
                    { name: 'Svettebehandling', price: 'Pris på forespørsel' },
                ]
            }
        ]
    },
    {
        id: 'laser',
        title: 'Laserbehandlinger',
        keywords: ['hårfjerning', 'ipl', 'fotona', 'pigment', 'kar', 'sprengte blodkar', 'tatovering', 'neglesopp', 'fotona'],
        icon: 'custom-laser', // Matches Home screen custom component
        // image: removed to enforce custom icon usage
        items: [
            {
                title: 'Hårfjerning Ansikt',
                data: [
                    { name: 'Overleppe', price: '800 kr' },
                    { name: 'Hake', price: '800 kr' },
                    { name: 'Hake + Overleppe', price: '1290 kr' },
                    { name: 'Kinnskjegg', price: '800 kr' },
                    { name: 'Skjeggkant (Menn)', price: '900 kr' },
                    { name: 'Hele ansiktet', price: '1700 kr' },
                    { name: 'Hele ansiktet + halve halsen', price: '1990 kr' },
                ]
            },
            {
                title: 'Hårfjerning Kropp',
                data: [
                    { name: 'Armhuler', price: '1300 kr' },
                    { name: 'Armer', price: '1900 kr' },
                    { name: 'Bikinilinjen', price: '1400 kr' },
                    { name: 'Brasiliansk (Kvinner)', price: '1900 kr' },
                    { name: 'Legger', price: '2100 kr' },
                    { name: 'Lår', price: '2300 kr' },
                    { name: 'Rygg (Menn)', price: '2400 kr' },
                    { name: 'Bryst (Menn)', price: '1900 kr' },
                    { name: 'Mage (Menn)', price: '1900 kr' },
                ]
            },
            {
                title: 'Hårfjerning Pakkepriser',
                data: [
                    { name: 'Armhuler + Bikini', price: '2300 kr' },
                    { name: 'Armhuler + Legger', price: '2900 kr' },
                    { name: 'Bikini + Legger', price: '2790 kr' },
                    { name: 'Armhuler + Bikini + Legger', price: '3790 kr' },
                    { name: 'Lår + Legger', price: '3490 kr' },
                    { name: 'Brasiliansk + Armhuler', price: '2690 kr' },
                    { name: 'Full pakke (Brasiliansk, Legg, Lår, Armhuler)', price: '4990 kr', description: 'Må utføres i 2 behandlinger' },
                ]
            },
            {
                title: 'Hudforbedring med Laser',
                keywords: ['pigmentfjerning', 'karfjerning', 'tatoveringsfjerning'],
                data: [
                    { name: 'Sprengte blodkar (Nese)', price: '900 kr' },
                    { name: 'Sprengte blodkar (Ansikt/Flere punkter)', price: '1600 kr' },
                    { name: 'Kar på ben (1 område)', price: '1000 kr' },
                    { name: 'Pigmentflekk', price: '1000 kr', fromPrice: true },
                    { name: 'Rødhet i ansiktet', price: '1200 kr', fromPrice: true },
                    { name: 'Tatoveringsfjerning Liten', price: '850 kr' },
                    { name: 'Tatoveringsfjerning Medium', price: '1250 kr' },
                    { name: 'Tatoveringsfjerning Stor', price: '1550 kr' },
                    { name: 'Neglesoppfjerning', price: '990 kr', fromPrice: true },
                    { name: 'Vortefjerning', price: '1500 kr', fromPrice: true },
                ]
            }
        ]
    },
    {
        id: 'peelinger',
        title: 'Peelinger',
        keywords: ['kjemisk peel', 'syre', 'meline', 'neostrata', 'elixir', 'akne', 'arr', 'glød'],
        icon: 'water-outline',
        image: require('@/assets/images/icons/icon_hud_final.png'),
        items: [
            {
                title: 'Medisinsk Peel',
                data: [
                    { name: 'Elixir Medisinsk Peel', price: '990 kr' },
                    { name: 'Inno Medisinsk Peel', price: '990 kr' },
                    { name: 'Neostrata Medisinsk Peel', price: '700 kr' },
                    { name: 'MeLine Ansikt', price: '1250 kr' },
                    { name: 'MeLine Intimpeel', price: '1250 kr' },
                    { name: 'MeLine Armhuler', price: '1250 kr' },
                    { name: 'MeLine Dark Circles (Øyne)', price: '900 kr' },
                    { name: 'Retinol Peeling', price: '990 kr' },
                    { name: 'Medisinsk Peel Rygg', price: '990 kr' },
                ]
            },
            {
                title: 'Annet',
                data: [
                    { name: 'Åpen peeling', price: '700 - 1250 kr' },
                    { name: 'Ungdomsbehandling (15-17 år)', price: '600 kr' },
                ]
            }
        ]
    },
    {
        id: 'ansikt',
        title: 'Ansiktsbehandlinger',
        keywords: ['hudpleie', 'rens', 'massasje', 'dermapen', 'microneedling', 'hydrafacial', 'mesoterapi', 'aquagold'],
        icon: 'sparkles-outline',
        image: require('@/assets/images/icons/icon_ansikt_final.png'),
        items: [
            {
                title: 'Klassisk',
                keywords: ['hudpleie', 'velvære'],
                data: [
                    { name: 'TM Relax hudpleie', price: '1300 kr' },
                    { name: 'TM Klassisk dyprens', price: '850 kr' },
                    { name: 'Hydrafacial Klassisk', price: '1750 kr' },
                    { name: 'Hydrafacial Avansert', price: '2150 kr' },
                    { name: 'Intensiv fuktighet (75 min)', price: '1490 kr' },
                    { name: 'Sothys sesongbehandling', price: '990 kr' },
                    { name: 'Fjerning av milier', price: '400 kr' },
                ]
            },
            {
                title: 'Medisinsk',
                keywords: ['dermapen', 'microneedling', 'mesoterapi'],
                data: [
                    { name: 'Mesoterapi', price: '1300 kr' },
                    { name: 'Dermapen / Microneedling', price: '1750 kr' },
                    { name: 'Dermapen + Medisinsk Peel', price: '2050 kr' },
                    { name: 'Dermapen + Mesoterapi', price: '2250 kr' },
                    { name: 'TM Glød (Hydrafacial + Dermapen)', price: '2890 kr' },
                    { name: 'Kombinasjon (Dermapen + Meso + Peel)', price: '2500 kr' },
                    { name: 'Arrbehandling med pixelnål', price: '1200 kr' },
                    { name: 'Fjerning av skintags (10 stk)', price: '1000 kr' },
                ]
            }
        ]
    },
    {
        id: 'kombinasjon',
        title: 'Kombinasjonsbehandlinger',
        keywords: ['pakke', 'kur', 'tilbud', 'dermapen', 'peel', 'filler'],
        icon: 'rose-outline',
        // image: require('@/assets/images/icons/icon_kombinasjoner_v3.png'), // Removing broken/inconsistent image
        items: [
            {
                title: 'Medisinsk injeksjon + Peel',
                data: [
                    { name: '1 område + Medisinsk peel', price: '2450 kr' },
                    { name: '2 områder + Medisinsk peel', price: '3400 kr' },
                    { name: '3 områder + Medisinsk peel', price: '4100 kr' },
                ]
            },
            {
                title: 'Dermapen + Bio-stimulator',
                data: [
                    { name: 'Dermapen + 1 område Bio-stimulator', price: '4550 kr' },
                    { name: 'Dermapen + 2 områder Bio-stimulator', price: '6500 kr' },
                    { name: 'Dermapen + Peel + 1 område Bio-stimulator', price: '4800 kr' },
                    { name: 'Dermapen + Peel + 2 områder Bio-stimulator', price: '6800 kr' },
                ]
            }
        ]
    },
    {
        id: 'vipper_bryn',
        title: 'Vipper og Bryn',
        keywords: ['bryn', 'vipper', 'løft', 'laminering', 'farging', 'forming', 'brow bomber'],
        icon: 'eye-outline',
        image: require('@/assets/images/icons/icon_bryn_final.png'),
        items: [
            {
                title: 'Styling',
                data: [
                    { name: 'Form bryn (uten farging)', price: '350 kr' },
                    { name: 'Brynsdesign (farge, voks, form)', price: '450 kr' },
                    { name: 'Farging av vipper', price: '290 kr' },
                    { name: 'Brynsdesign + Farging av vipper', price: '590 kr' },
                    { name: 'Brow Stain (m/ design)', price: '685 kr' },
                ]
            },
            {
                title: 'Løft og Laminering',
                data: [
                    { name: 'Vippeløft inkl. farging', price: '990 kr' },
                    { name: 'Vippeløft og brynsdesign', price: '1290 kr' },
                    { name: 'Vippeløft og brynslaminering', price: '1590 kr' },
                    { name: 'Brynslaminering (inkl. design)', price: '940 kr' },
                    { name: 'Brynslaminering + Farging av vipper', price: '1040 kr' },
                ]
            }
        ]
    },
    {
        id: 'voks',
        title: 'Voks',
        keywords: ['hårfjerning', 'voksing', 'brasiliansk', 'legger', 'rygg'],
        icon: 'leaf-outline',
        image: require('@/assets/images/icons/icon_kropp_final.png'), // Reusing body icon for Waxing
        items: [
            {
                title: 'Ansikt',
                data: [
                    { name: 'Overleppe', price: '240 kr' },
                    { name: 'Hake', price: '240 kr' },
                    { name: 'Overleppe og hake', price: '340 kr' },
                    { name: 'Kinn', price: '290 kr' },
                    { name: 'Nesehår', price: '290 kr' },
                    { name: 'Hele ansiktet', price: '490 kr' },
                ]
            },
            {
                title: 'Kropp',
                data: [
                    { name: 'Brasiliansk (1. gang)', price: '800 kr' },
                    { name: 'Brasiliansk (hver 4-5 uke)', price: '650 kr' },
                    { name: 'Bikinilinje', price: '450 kr' },
                    { name: 'Armhuler', price: '350 kr' },
                    { name: 'Halv arm', price: '420 kr' },
                    { name: 'Hel arm', price: '600 kr' },
                    { name: 'Legger', price: '550 kr' },
                    { name: 'Lår', price: '600 kr' },
                    { name: 'Hele ben', price: '950 kr' },
                    { name: 'Hele ben inkl. bikini', price: '1050 kr' },
                    { name: 'Rygg', price: '700 kr' },
                    { name: 'Brystkasse', price: '700 kr' },
                ]
            }
        ]
    },
    {
        id: 'kropp_massasje',
        title: 'Kropp & Massasje',
        keywords: ['massasje', 'velvære', 'aromaterapi', 'stress'],
        icon: 'body-outline',
        image: require('@/assets/images/icons/icon_kropp_final.png'),
        items: [
            {
                title: 'Massasje',
                data: [
                    { name: 'Aromaterapi (60 min)', price: '1050 kr' },
                    { name: 'Ansikt- og hodebunnsmassasje (30 min)', price: '490 kr' },
                    { name: 'TM Antistress (60 min)', price: '1100 kr' },
                ]
            }
        ]
    },
    {
        id: 'diverse',
        title: 'Diverse Behandlinger',
        keywords: ['tannbleking', 'lege', 'refusjon', 'migrene', 'plexr', 'øyelokk'],
        icon: 'apps-outline',
        image: require('@/assets/images/icons/icon_lege_final.png'),
        items: [
            {
                title: 'Estetikk',
                data: [
                    { name: 'Kosmetisk Tannbleking', price: '1100 kr' },
                    { name: 'Sminkeveiledning', price: '700 kr' },
                    { name: 'Plexr (ikke-kirurgisk løft)', price: '4000 kr', fromPrice: true },
                ]
            },
            {
                title: 'Lege & Helsetjenester',
                data: [
                    { name: 'Fjerning av piercingarr', price: '2500 kr' },
                    { name: 'Medisinsk injeksjon mot migrene', price: 'Pris på forespørsel' },
                ]
            }
        ]
    }
];
