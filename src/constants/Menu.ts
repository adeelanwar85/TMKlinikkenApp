
export interface TreatmentSection {
    title?: string;
    content?: string;
    listItems?: { label: string; value?: string; url?: string }[];
    type: 'text' | 'list' | 'links';
}

export interface treatmentMenuItem {
    id: string;
    title: string;
    subtitle: string;
    url: string;
    image?: any;
    icon?: string;
    details?: {
        heroImage?: any;
        intro?: string;
        sections: TreatmentSection[];
    }
}

export const TREATMENT_MENU: treatmentMenuItem[] = [
    {
        id: 'injeksjoner',
        title: 'Injeksjonsbehandlinger',
        subtitle: 'Filler, rynkebehandling og skinbooster',
        url: 'https://www.tmklinikken.no/behandlinger/injeksjonsbehandlinger',
        image: require('@/assets/images/icons/icon_injeksjoner_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
            intro: "Vårt helsepersonell er utdannede injeksjonspesialister på høyeste nivå innen filler, medisinsk rynkebehandling og komplikasjoner.",
            sections: [
                {
                    title: "Medisinsk rynkebehandling",
                    type: 'text',
                    content: "Medisinsk rynkebehandling virker på de små ansiktsmusklene og hindrer at disse trekker seg sammen. Dermed blir den overliggende huden jevnere og rynker glattes ut. Medisinsk rynkebehandling kan også settes i armhuler, i hendene og under føttene for å hindre ubehagelig svetting."
                },
                {
                    title: "Behandlingen",
                    type: 'text',
                    content: "Settes med en tynn nål og gir lite ubehag. Effekten kommer etter noen dager, men for noen tar det opp til 14 dager før effekten kommer. For å vedlikeholde optimal effekt bør man beregne og gjenta behandlingen 2-3 ganger i året."
                },
                {
                    title: "Fillerbehandlinger",
                    type: 'text',
                    content: "Hyaluronsyre er et sukkermolekyl som finnes naturlig i kroppen. Det binder vann og gir huden fuktighet og volum. Vi benytter kun godt dokumenterte kvalitetsmerker som Teosyal og Juvéderm."
                },
                {
                    title: "Hvem skal ikke behandles?",
                    type: 'text',
                    content: "Gravide, ammende og de med spesielle nevrologiske sykdommer. Aldersgrensen på medisinsk rynkebehandling er 25 år."
                }
            ]
        }
    },
    {
        id: 'laser',
        title: 'Laserbehandlinger',
        subtitle: 'Hårfjerning, kar og pigmentering',
        url: 'https://www.tmklinikken.no/behandlinger/laserbehandlinger',
        // image: require('@/assets/images/icons/icon_laser_beam_v2.png'),
        icon: 'custom-laser', // Triggers custom component in ServiceCard
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-59.jpg',
            intro: "Vi har de seneste laserne på markedet innen permanent hårreduksjon, blodkar, pigmenteringfjerning og tatoveringsfjerning.",
            sections: [
                {
                    title: "Våre behandlinger",
                    type: 'list',
                    listItems: [
                        { label: "IPL-behandling", url: "https://www.tmklinikken.no/behandlinger/laserbehandlinger/ipl-behandling/" },
                        { label: "Permanent hårfjerning" },
                        { label: "Fjerning av sprengte blodkar" },
                        { label: "Fjerning av pigmentflekker" },
                        { label: "Tatoveringsfjerning" }
                    ]
                }
            ]
        }
    },
    {
        id: 'ansikt',
        title: 'Ansiktsbehandlinger',
        subtitle: 'Medisinsk hudpleie og velvære',
        url: 'https://www.tmklinikken.no/behandlinger/ansiktsbehandlinger',
        image: require('@/assets/images/icons/icon_ansikt_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-50.jpg',
            intro: "Vi tilbyr en rekke medisinske velvære- og ansiktsbehandlinger, utført av autorisert helsepersonell og erfarne hudterapeuter.",
            sections: [
                {
                    title: "Behandlingsmeny",
                    type: 'list',
                    listItems: [
                        { label: "TM Relax" },
                        { label: "TM Klassisk Dyprens" },
                        { label: "Intensiv fuktighetsbehandling" },
                        { label: "Dermapen / Microneedling" },
                        { label: "Mesoterapi" },
                        { label: "Hydrafacial" },
                        { label: "Fjerning av milier (Plexr)" }
                    ]
                }
            ]
        }
    },
    {
        id: 'hud',
        title: 'Hud & Peelinger',
        subtitle: 'Dermapen, kjemisk peel og mesoterapi',
        url: 'https://www.tmklinikken.no/behandlinger/peelinger',
        image: require('@/assets/images/icons/icon_hud_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9747.jpg',
            intro: "En peeling er en effektiv metode for å fjerne døde hudceller og stimulere til ny cellevekst.",
            sections: [
                {
                    title: "Våre Peelinger",
                    type: 'list',
                    listItems: [
                        { label: "MeLine medisinsk peel", value: "fra 1250 kr" },
                        { label: "Neostrata Peel", value: "700 kr" },
                        { label: "Inno medisinsk peel", value: "990 kr" },
                        { label: "Retinol peeling", value: "990 kr" },
                        { label: "Ungdomsbehandling (15-17 år)", value: "600 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'kropp',
        title: 'Kropp & Massasje',
        subtitle: 'Figurforming og massasje',
        url: 'https://www.tmklinikken.no/behandlinger/kroppsbehandling-og-massasje',
        image: require('@/assets/images/icons/icon_kropp_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-29.jpg',
            intro: "Ønsker du egen tid og en deilig kroppsbehandling? Da har vi behandlingen du trenger!",
            sections: [
                {
                    title: "Massasje",
                    type: 'list',
                    listItems: [
                        { label: "Aromaterapi (60 min)", value: "1050 kr" },
                        { label: "TM Antistress (60 min)", value: "1100 kr" },
                        { label: "Ansikt- og hodebunnsmassasje (30 min)", value: "490 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'vipper_bryn',
        title: 'Vipper og Bryn',
        subtitle: 'Løft, laminering og design',
        url: 'https://www.tmklinikken.no/behandlinger/vipper-og-bryn',
        image: require('@/assets/images/icons/icon_bryn_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/vipper-og-bryn.jpg',
            intro: "Velstelte vipper og bryn skaper en ramme til ansiktet ditt. Våre eksperter oppdaterer seg jevnlig på de nyeste metodene.",
            sections: [
                {
                    title: "Priser",
                    type: 'list',
                    listItems: [
                        { label: "Vippeløft inkl. farging", value: "990 kr" },
                        { label: "Vippeløft og brynsdesign", value: "1290 kr" },
                        { label: "Brynsdesign", value: "450 kr" },
                        { label: "Brynslaminering", value: "940 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'kombinasjonsbehandlinger',
        title: 'Kombinasjonsbehandlinger',
        subtitle: 'Optimaliserte behandlingspakker',
        url: 'https://www.tmklinikken.no/behandlinger', // Generic fallback
        // image: require('@/assets/images/icons/icon_kombinasjoner_v3.png'),
        icon: 'rose-outline', // Using a vector icon for perfect transparency
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9762.jpg',
            intro: "Vi skreddersyr behandlingsprogrammer der vi kombinerer ulike kosmetiske behandlinger for å oppnå mye mer for huden din.",
            sections: [
                {
                    title: "Hvorfor velge kombinasjonsbehandling?",
                    type: 'text',
                    content: "Ved å kombinere behandlinger som f.eks. Dermapen, kjemisk peel og injeksjoner, kan vi jobbe i ulike hudlag samtidig og oppnå raskere og bedre resultater."
                },
                {
                    title: "Populære kombinasjoner",
                    type: 'list',
                    listItems: [
                        { label: "Dermapen + Medical Peel", value: "fra 2500 kr" },
                        { label: "Dermapen + Bio-stimulator", value: "fra 4550 kr" },
                        { label: "Medisinsk injeksjon + Peel", value: "fra 2450 kr" },
                        { label: "TM Glød (Hydrafacial + Dermapen)", value: "2890 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'lege',
        title: 'Lege & Sykepleier',
        subtitle: 'Medisinske tjenester',
        url: 'https://www.tmklinikken.no/behandlinger/lege-og-sykepleiertjenester',
        icon: 'pulse-outline',
        image: require('@/assets/images/illustrations/doctor_v2.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-53.jpg',
            intro: "Vi har legespesialist og flere sykepleiere med fordypning i ulike prosedyrer.",
            sections: [
                {
                    title: "Tjenester",
                    type: 'list',
                    listItems: [
                        { label: "Fjerning av filler", value: "fra 1500 kr" },
                        { label: "Fjerning av piercingarr", value: "2500 kr" },
                        { label: "Medisinsk injeksjon mot migrene", value: "Pris på forespørsel" }
                    ]
                }
            ]
        }
    },
    {
        id: 'priser',
        title: 'Prisliste',
        subtitle: 'Se våre priser',
        url: 'https://tmklinikken.no/behandlinger/#priser',
        icon: 'cash-outline',
        image: require('@/assets/images/illustrations/doctor_v2.png'),
    },
    {
        id: 'bestill',
        title: 'Bestill time',
        subtitle: 'Finn en tid som passer',
        url: 'https://tmklinikken.bestille.no/OnCust2/#!/ ',
        icon: 'calendar-outline',
        image: require('@/assets/images/illustrations/doctor_v2.png'),
    }
];

export const MAIN_TABS = ['Behandlinger', 'Bestill time', 'Om oss', 'Kontakt', 'TM Klinikken'];
