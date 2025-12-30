

export interface TreatmentSection {
    title?: string;
    content?: string;
    listItems?: { label: string; value?: string; url?: string }[];
    type: 'text' | 'list' | 'links';
}

export interface SubTreatment {
    id: string;
    title: string;
    subtitle?: string;
    url?: string;
    heroImage?: any;
    intro?: string;
    content: TreatmentSection[];
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
        intro?: string; // General category intro
        subTreatments?: SubTreatment[]; // Nested treatments
        sections?: TreatmentSection[]; // Legacy/General sections if no sub-treatments
    }
}

export const TREATMENT_MENU: treatmentMenuItem[] = [
    {
        id: 'injeksjoner',
        title: 'Injeksjonsbehandlinger',
        subtitle: 'Filler, rynkebehandling og skinbooster',
        url: 'https://www.tmklinikken.no/behandlinger/injeksjonsbehandlinger',
        image: require('@/assets/images/icons/icon_injeksjoner_final_v7.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
            intro: "På TM er vårt helsepersonell utdannet injeksjonspesialister på høyeste nivå innen filler, medisinsk rynkebehandling og komplikasjoner. Vi har også utviklet egne injeksjonsteknikker på TM klinikken.",
            sections: [
                {
                    title: "Medisinsk Rynkebehandling",
                    type: 'text',
                    content: "Medisinsk rynkebehandling virker på de små ansiktsmusklene og hindrer at disse trekker seg sammen. Dermed blir den overliggende huden jevnere og rynker glattes ut. Medisinsk rynkebehandling kan også settes i armhuler, i hendene og under føttene for å hindre ubehagelig svetting.\n\nSettes med en tynn nål og gir lite ubehag. Effekten kommer etter noen dager, men for noen tar det opp til 14 dager før effekten kommer. For å vedlikeholde optimal effekt bør man beregne og gjenta behandlingen 2-3 ganger i året."
                },
                {
                    title: "Hvem skal ikke behandles?",
                    type: 'text',
                    content: "Gravide, ammende og de med spesielle nevrologiske sykdommer. Aldersgrensen på medisinsk rynkebehandling er 25 år."
                },
                {
                    title: "Bivirkninger (Rynkebehandling)",
                    type: 'text',
                    content: "Det oppstår sjelden bivirkninger, men det kan skje. Den vanligste bivirkningen er ømhet eller en liten blodutredelse på innstikkstedet. I sjeldne tilfeller kan man få en forbigående svekkelse av nærliggende muskler (f.eks. tunge øyelokk i 1-2 uker). Fordi effekten er forbigående, er også bivirkningene forbigående."
                },
                {
                    title: "Fillerbehandlinger (Hyaluronsyre)",
                    type: 'text',
                    content: "Hyaluronsyre er et sukkermolekyl som finnes naturlig i kroppen. Det binder vann og gir huden fuktighet og volum. Vi benytter kun godt dokumenterte kvalitetsmerker som Teosyal og Juvéderm. Filler kan glatte ut rynker, gi fylde til lepper eller erstatte volumtap i kinn og kinnben."
                },
                {
                    title: "Varighet av Filler",
                    type: 'text',
                    content: "Varigheten avhenger av område. I lepper kan den vare 6-12 mnd, mens kinnbensområdet kan vare 12 – 18 mnd. Generelt sett, jo oftere man injiserer hyaluronsyre, jo lenger varer effekten."
                },
                {
                    title: "Bivirkninger Ved Filler",
                    type: 'text',
                    content: "Vanlige: Hevelse, rødhet, blåmerke, ømhet og ubehag rundt behandlingsområdet.\nMindre vanlige: Forbigående misfarging, asymmetri, teksturforandringer.\nSjeldne/alvorlige: Infeksjon, allergisk reaksjon, vaskulær blokade."
                }
            ]
        }
    },
    {
        id: 'laser',
        title: 'Laserbehandlinger',
        subtitle: 'Hårfjerning, IPL og karfjerning',
        url: 'https://www.tmklinikken.no/behandlinger/laserbehandlinger',
        image: require('@/assets/images/icons/icon_laser_final_v13.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-59.jpg',
            intro: "Vi har de seneste laserne på markedet innen permanent hårreduksjon, blodkar, pigmenteringfjerning og tatoveringsfjerning. Behandlingene utføres kun av autorisert helsepersonell.",
            sections: [
                {
                    title: "IPL-behandling",
                    type: 'text',
                    content: "IPL står for Intense Pulsed Light og benytter bredspektret lys for å stimulere huden. Lyset absorberes av pigment og blodkar, noe som reduserer pigmentflekker, rosacea, rødhet, synlige blodkar og fine linjer."
                },
                {
                    title: "Om IPL-prosessen",
                    type: 'text',
                    content: "IPL krever vanligvis en serie på 3–8 behandlinger med 6-8 ukers intervaller. Etter behandling kan man oppleve lett rødhet og varmefølelse. Unngå direkte sollys og bruk SPF 30+ i behandlingsperioden."
                },
                {
                    title: "Permanent Hårfjerning",
                    type: 'text',
                    content: "Vi bruker medisinsk laser for permanent reduksjon av hårvekst. Laseren sender energi ned i hårsekken og ødelegger den, slik at håret ikke vokser ut igjen. Det kreves flere behandlinger da hårene vokser i ulike faser."
                },
                {
                    title: "Behandlingsmeny Laser",
                    type: 'list',
                    listItems: [
                        { label: "IPL-behandling" },
                        { label: "Permanent hårfjerning (Ansikt/Kropp)" },
                        { label: "Fjerning av sprengte blodkar" },
                        { label: "Fjerning av pigmentflekker" },
                        { label: "Tatoveringsfjerning" },
                        { label: "Neglesoppbehandling" }
                    ]
                }
            ]
        }
    },
    {
        id: 'peelinger',
        title: 'Peelinger',
        subtitle: 'MeLine, Neostrata og medisinske peelinger',
        url: 'https://www.tmklinikken.no/behandlinger/peelinger',
        image: require('@/assets/images/icons/icon_hud_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9747.jpg',
            intro: "En peeling er en effektiv metode for å fjerne døde hudceller. Hver dag dør det og produseres det nye hudceller. For å unngå opphopning av disse, så anbefaler vi å peele huden din jevnlig. Vi tilbyr mange ulike peelinger for både ansikt og kropp. Helt fra førstegangspeeling til mer avanserte peilinger. Vi tilpasser behandlingen etter din hudtype.",
            subTreatments: [
                {
                    id: 'meline',
                    title: 'MeLine Medisinsk Peel',
                    subtitle: 'Spesialist på pigmentering',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9747.jpg',
                    intro: 'Meline® er en medisinsk peel spesielt utviklet for å behandle hyperpigmentering, ujevn hudtone og solskader – både i ansiktet og på kroppen. Det er den første og eneste serien med kjemiske peelinger skreddersydd for ulike hudtyper og hudtoner, inkludert mørkere hudtyper (Fitzpatrick IV–VI). Behandlingen kombinerer kjemisk peeling med tilpasset hjemmeprogram, og gir svært gode resultater på både melasma, postinflammatorisk hyperpigmentering (PIH), solskader, akne og aldringstegn.',
                    content: [
                        {
                            title: "Hvorfor velge MeLine?",
                            type: 'text',
                            content: "Meline skiller seg ut ved å:\n• Være spesialdesignet for pigmentflekker\n• Tilpasses både lyse og mørkere hudtoner\n• Kombinere klinisk behandling med hjemmeprodukter for langvarig effekt\n• Redusere risikoen for tilbakefall av pigmentering\n• Forbedre hudkvaliteten generelt – både struktur, glød og spenst"
                        },
                        {
                            title: "Behandlingen",
                            type: 'text',
                            content: "Behandlingen passer både kvinner og menn, og består av:\n\n1. Peel-behandling i klinikk: En spesialtilpasset kjemisk peel påføres huden, og virker i en gitt tidsperiode.\n\n2. Hjemmebehandling: Etter klinikkbehandlingen følger et nøye tilpasset program med Meline hjemmeprodukter som brukes i flere uker. Dette er avgjørende for resultatet.\n\n3. Oppfølging: Behandlingen kan gjentas med jevne mellomrom og tilpasses etter hvordan huden responderer.\n\nDe fleste ser synlige forbedringer etter 2–4 uker, med gradvis reduksjon av pigmentering og jevnere hudtone. Full effekt oppnås vanligvis etter 1–3 behandlinger, kombinert med korrekt bruk av hjemmeprodukter."
                        },
                        {
                            title: "Hvem passer det for?",
                            type: 'list',
                            listItems: [
                                { label: "Melasma" },
                                { label: "Solskader og aldersflekker" },
                                { label: "Postinflammatorisk hyperpigmentering (etter f.eks. akne)" },
                                { label: "Ujevn hudtone" },
                                { label: "Akne og aknearr" },
                                { label: "Tegn på hudaldring" }
                            ]
                        },
                        {
                            title: "Etter behandlingen",
                            type: 'text',
                            content: "• Lett rødhet og flassing er vanlig de første dagene etter behandlingen.\n• Det er viktig å følge anbefalt hudpleieprogram og beskytte huden med solfaktor daglig for å oppnå best mulig resultat og unngå bivirkninger."
                        }
                    ]
                },
                {
                    id: 'meline_intimate',
                    title: 'MeLine Intimate Peel',
                    subtitle: 'For intime områder',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9747.jpg', // Fallback to working image
                    intro: "MELINE® Intimate er en spesialutviklet kjemisk peel designet for å lysne og jevne ut hudtonen i intime områder. Den er trygg, effektiv og tilpasset sensitiv hud.",
                    content: [
                        {
                            title: "Hva er MELINE® Intimate Peel?",
                            type: 'text',
                            content: "Behandlingen er utviklet med aktive ingredienser som reduserer ujevn pigmentering, forbedrer hudkvaliteten og gir et jevnere og lysere utseende – på en skånsom og medisinsk trygg måte.\n\nDen brukes for å behandle hyperpigmentering i områder som:\n• Ytre kjønnslepper\n• Lysken\n• Indre lår"
                        },
                        {
                            title: "Hvorfor får man mørkere hud i intime områder?",
                            type: 'text',
                            content: "Mørkere hud i intime områder er helt normalt og kan skyldes:\n• Hormoner (f.eks. etter graviditet eller ved P-pillebruk)\n• Friksjon (fra klær eller barbering)\n• Aldring\n• Betennelser eller irritasjon (post-inflammatorisk hyperpigmentering)\n\nMELINE® Intimate er utviklet nettopp for å behandle disse pigmentforandringene på en trygg og effektiv måte."
                        },
                        {
                            title: "Hvordan foregår behandlingen?",
                            type: 'text',
                            content: "1. Peel-behandling: En spesialtilpasset peeling påføres huden i det aktuelle området. Dette tar 20–30 minutter.\n\n2. Etterbehandling hjemme: Du får med deg et hjemmeprogram med produkter fra MELINE® som skal brukes daglig for optimal effekt.\n\n3. Oppfølging: Ny vurdering etter 3–4 uker for å evaluere resultat og eventuelt gjenta behandlingen."
                        },
                        {
                            title: "Viktig informasjon",
                            type: 'list',
                            listItems: [
                                { label: "Unngå barbering og samleie 2–3 dager før og etter behandling" },
                                { label: "Unngå soling eller bruk av solarium i behandlingsperioden" },
                                { label: "Bruk alltid anbefalt intimpleie og solbeskyttelse" }
                            ]
                        }
                    ]
                },
                {
                    id: 'neostrata',
                    title: 'Neostrata Peel',
                    subtitle: 'Retinol og AHA peel',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9747.jpg',
                    intro: 'NeoStrata ProSystem Retinol og AHA peel er en avansert medisinsk hudbehandling utviklet av hudleger for å forbedre hudens kvalitet, struktur og utseende. Behandlingen benytter fruktsyrer (AHA) eller retinol for å eksfoliere huden, stimulere cellefornyelsen og redusere ulike hudproblemer som ujevn hudtone, aldringstegn, akne og pigmentering.',
                    content: [
                        {
                            title: "Om Behandlingen",
                            type: 'text',
                            content: "NeoStrata-peelinger benytter alfahydroksysyrer (AHA) som glykolsyre, melkesyre og sitronsyre, og i noen tilfeller retinol, for å fjerne døde hudceller og stimulere til fornyelse i de dypere hudlagene.\n\n1. Renser og eksfolierer huden i dybden\n2. Stimulerer produksjonen av kollagen og elastin\n3. Øker hudens evne til å ta opp aktive ingredienser\n4. Gir langvarige forbedringer ved jevnlig bruk"
                        },
                        {
                            title: "Fordeler med NeoStrata peel",
                            type: 'list',
                            listItems: [
                                { label: "Forbedrer hudens tekstur og gir en jevnere hudtone" },
                                { label: "Reduserer fine linjer" },
                                { label: "Minimerer porer og regulerer fet hud" },
                                { label: "Reduserer pigmentering og solskader" },
                                { label: "Motvirker akne og forbedrer aknearr" },
                                { label: "Gir huden en friskere glød og mer spenst" }
                            ]
                        },
                        {
                            title: "Hvem passer NeoStrata peel for?",
                            type: 'text',
                            content: "NeoStrata er et godt valg for deg som:\n• Har ujevn hudtone, solskader eller pigmentering\n• Ønsker å redusere fine linjer og forbedre hudens spenst\n• Sliter med akne eller uren hud\n• Har gusten eller livløs hud og ønsker en ny glød\n• Vil forebygge og behandle tidlige aldringstegn\n\nBehandlingen passer for de fleste hudtyper og kan også kombineres med andre medisinske behandlinger for økt effekt."
                        },
                        {
                            title: "Praktisk info",
                            type: 'text',
                            content: "En behandling tar ca. 30 minutter og gir vanligvis ingen eller minimal nedetid. Du kan oppleve lett rødhet eller flassing i noen dager etter behandlingen, avhengig av hvilken peel som brukes. Mange opplever forbedret glød og hudtekstur etter første behandling, men best og mest varige resultater oppnås etter en kur på 4–6 behandlinger, med ca. 2–4 ukers mellomrom."
                        }
                    ]
                },
                {
                    id: 'inno',
                    title: 'Inno Medisinsk Peel',
                    subtitle: 'Dypere hudforbedring',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9747.jpg',
                    intro: 'INNOAESTHETICS (Inno Peel) er en serie avanserte medisinske kjemiske peelinger utviklet av farmasøyter og leger for effektiv behandling av ulike hudproblemer – både i ansiktet og på kroppen. Behandlingene inneholder en kombinasjon av syrer, aktive ingredienser og antioksidanter, og tilpasses individuelt for å gi målrettede og trygge resultater. INNO peel gir en kontrollert mikroekfoliering av huden, noe som styrker hudbarrieren og forbedrer hudstrukturen uten nødvendigvis å skape store synlige reaksjoner.',
                    content: [
                        {
                            title: "Om Inno medisinske peelinger",
                            type: 'text',
                            content: "Behandlingene våre med Inno Peel består av nøye sammensatte protokoller som kombinerer behandling i klinikk med tilpasset hjemmebehandling. Hjemmeproduktene jobber i synergi med klinikkbehandlingen for å optimalisere resultatene, redusere risikoen for bivirkninger og opprettholde hudens helse.\n\nVi tilbyr flere ulike Inno-peelinger tilpasset ulike hudtilstander, for eksempel:\n\n• Skin Recovery: Behandler akne, fet hud, rosacea og røde arr.\n• Bio C: Gir umiddelbar glød, forebygger tidlig aldring og bedrer gusten hud (Askepott-behandling).\n• Whitening: Effektiv mot melasma, pigmentflekker og solskader.\n• Anti-Ageing: Reduserer fine linjer, rynker og slapp hud."
                        },
                        {
                            title: "Hvem passer behandlingen for?",
                            type: 'list',
                            listItems: [
                                { label: "Akne og uren hud" },
                                { label: "Rosacea og rødhet" },
                                { label: "Pigmentering og melasma" },
                                { label: "Solskadet hud" },
                                { label: "Fine linjer og rynker" },
                                { label: "Gusten og livløs hud" },
                                { label: "Arr og ujevn hudstruktur" }
                            ]
                        },
                        {
                            title: "Slik foregår behandlingen",
                            type: 'text',
                            content: "En behandling tar ca. 30–45 minutter. Huden renses grundig før peelingen påføres lagvis etter din huds tåleevne og behov. Du kan kjenne en varmende eller stikkende følelse, men behandlingen er ikke smertefull. Vi avslutter med beroligende produkter og solbeskyttelse.\n\nFor best resultat anbefales en kur på 3–4 behandlinger med 2–4 ukers mellomrom."
                        },
                        {
                            title: "Etter behandling",
                            type: 'text',
                            content: "Huden kan være litt rød og stram rett etter behandling. Avhengig av hvilken peeling som er brukt, kan du oppleve lett flassing etter 2–3 dager. Det er viktig å bruke anbefalte hjemmeprodukter og høy solfaktor (SPF 50) i tiden etterpå for å beskytte huden og sikre optimalt resultat."
                        }
                    ]
                },
            ]
        }
    },
    {
        id: 'ansikt',
        title: 'Ansiktsbehandlinger',
        subtitle: 'HydraFacial, Dermapen og velvære',
        url: 'https://www.tmklinikken.no/behandlinger/ansiktsbehandlinger',
        image: require('@/assets/images/icons/icon_ansikt_final.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-50.jpg',
            intro: "Vi tilbyr en rekke medisinske velvære- og ansiktsbehandlinger, utført av autorisert helsepersonell og erfarne hudterapeuter.",
            sections: [
                {
                    title: "HydraFacial",
                    type: 'text',
                    content: "HydraFacial er en avansert hudbehandling som kombinerer rens, peeling og hydrering. Et roterende munnstykke suger ut urenheter samtidig som det tilfører fukt og antioksidanter. Gir umiddelbar glød («Glow») uten nedetid."
                },
                {
                    title: "Dermapen / Microneedling",
                    type: 'text',
                    content: "Dermapen lager mikroskopiske kanaler i huden som stimulerer hudens naturlige produksjon av kollagen og elastin. Effektiv mot fine linjer, aknearr, store porer og ujevn hudstruktur. Huden blir glattere og strammere."
                },
                {
                    title: "Andre Ansiktsbehandlinger",
                    type: 'list',
                    listItems: [
                        { label: "TM Relax", value: "1300 kr" },
                        { label: "TM Klassisk Dyprens", value: "850 kr" },
                        { label: "Mesoterapi", value: "1300 kr" },
                        { label: "Sothys Sesongbehandling", value: "990 kr" },
                        { label: "Fjerning av milier (Plexr)", value: "400 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'kombinasjon',
        title: 'Kombinasjonsbehandlinger',
        subtitle: 'Optimaliserte behandlingspakker',
        url: 'https://www.tmklinikken.no/behandlinger/kombinasjonsbehandlinger',
        image: require('@/assets/images/icons/icon_kombinasjon_final_v15.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9762.jpg',
            intro: "Ved å kombinere behandlinger som f.eks. Dermapen, kjemisk peel og injeksjoner, kan vi jobbe i ulike hudlag samtidig og oppnå raskere og bedre resultater.",
            sections: [
                {
                    title: "Populære Kombinasjoner",
                    type: 'list',
                    listItems: [
                        { label: "Medisinsk injeksjon + Peel", value: "fra 2450 kr" },
                        { label: "Dermapen + Bio-stimulator", value: "fra 4550 kr" },
                        { label: "Dermapen + Peel + Bio-stimulator", value: "fra 4800 kr" },
                        { label: "TM Glød (Hydrafacial + Dermapen)", value: "2890 kr" },
                        { label: "Dermapen + Mesoterapi", value: "2250 kr" }
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
            intro: "Velstelte vipper og bryn er med på å skape en ramme til ansiktet ditt. Våre behandlinger inkluderer farging, forming, vippeløft og brynslaminering.",
            sections: [
                {
                    title: "Behandlinger & Priser",
                    type: 'list',
                    listItems: [
                        { label: "Vippeløft inkl. farging", value: "990 kr" },
                        { label: "Vippeløft og brynsdesign", value: "1290 kr" },
                        { label: "Brynslaminering (inkl. design)", value: "940 kr" },
                        { label: "Brynslaminering + Vippefarge", value: "1040 kr" },
                        { label: "Brow Stain (m/ design)", value: "685 kr" },
                        { label: "Brynsdesign (farge, voks, form)", value: "450 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'voks',
        title: 'Voks',
        subtitle: 'Skånsom hårfjerning',
        url: 'https://www.tmklinikken.no/behandlinger/voks',
        image: require('@/assets/images/icons/icon_voks_final_v7.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-29.jpg',
            intro: "Voksing er en populær og effektiv hårfjerningsmetode med langvarig resultat (3-4 uker). Vi bruker voks av høy kvalitet.",
            sections: [
                {
                    title: "Kroppsvoks",
                    type: 'list',
                    listItems: [
                        { label: "Brasiliansk (1. gang)", value: "800 kr" },
                        { label: "Brasiliansk (vedlikehold)", value: "650 kr" },
                        { label: "Bikinilinje", value: "450 kr" },
                        { label: "Armhuler", value: "350 kr" },
                        { label: "Legger", value: "550 kr" },
                        { label: "Hele ben", value: "950 kr" },
                        { label: "Rygg", value: "700 kr" }
                    ]
                },
                {
                    title: "Ansiktsvoks",
                    type: 'list',
                    listItems: [
                        { label: "Overleppe", value: "240 kr" },
                        { label: "Hake", value: "240 kr" },
                        { label: "Hele ansiktet", value: "490 kr" },
                        { label: "Nesehår", value: "290 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'kropp_massasje',
        title: 'Kropp & Massasje',
        subtitle: 'Velvære og avslapning',
        url: 'https://www.tmklinikken.no/behandlinger/kroppsbehandling-og-massasje',
        image: require('@/assets/images/icons/icon_kropp_final_v7.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-29.jpg',
            intro: "Vi tilbyr avslappende massasjer for å redusere stress, løse opp muskelspenninger og øke ditt velvære.",
            sections: [
                {
                    title: "Behandlinger",
                    type: 'list',
                    listItems: [
                        { label: "Aromaterapi (60 min)", value: "1050 kr" },
                        { label: "TM Antistress (60 min)", value: "1100 kr" },
                        { label: "Ansikt- og hodebunnsmassasje", value: "490 kr" }
                    ]
                }
            ]
        }
    },
    {
        id: 'diverse',
        title: 'Lege og sykepleietjenester',
        subtitle: 'Medisinske tjenester',
        url: 'https://www.tmklinikken.no/behandlinger/lege-og-sykepleiertjenester',
        image: require('@/assets/images/icons/icon_lege_ekg_final_v7.png'),
        details: {
            heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-53.jpg',
            intro: "TM Klinikken tilbyr også medisinske konsultasjoner og diverse estetiske behandlinger.",
            sections: [
                {
                    title: "Tjenester",
                    type: 'list',
                    listItems: [
                        { label: "Kosmetisk tannbleking", value: "1100 kr" },
                        { label: "Sminkeveiledning", value: "700 kr" },
                        { label: "Fjerning av piercingarr", value: "2500 kr" },
                        { label: "Fjerning av filler", value: "fra 1500 kr" },
                        { label: "Legemiddel mot migrene", value: "Pris på forespørsel" }
                    ]
                }
            ]
        }
    },
    {
        id: 'priser',
        title: 'Prisliste',
        subtitle: 'Se komplett prisliste',
        url: 'https://tmklinikken.no/behandlinger/#priser',
        icon: 'cash-outline',
        image: require('@/assets/images/illustrations/doctor_v2.png'),
    },
    {
        id: 'bestill',
        title: 'Bestill time',
        subtitle: 'Finn tid som passer',
        url: 'https://tmklinikken.bestille.no/OnCust2/#!/ ',
        icon: 'calendar-outline',
        image: require('@/assets/images/illustrations/doctor_v2.png'),
    }
];

export const MAIN_TABS = ['Bestill time', 'Om oss', 'Kontakt', 'TM Klinikken'];
