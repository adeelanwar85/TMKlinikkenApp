

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
            intro: "På TM er vårt helsepersonell utdannet injeksjonspesialister på høyeste nivå innen filler, medisinsk rynkebehandling og komplikasjoner. Vi har også utviklet egne injeksjonsteknikker.",
            subTreatments: [
                {
                    id: 'rynkebehandling',
                    title: 'Medisinsk Rynkebehandling',
                    subtitle: 'Glatte ut linjer og rynker',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
                    intro: 'Medisinsk rynkebehandling virker ved å få de små ansiktsmusklene til å slappe av, noe som jevner ut den overliggende huden og glatter ut rynker. Resultatet kommer etter noen dager og varer i flere måneder.',
                    content: [
                        {
                            title: 'Hvordan virker det?',
                            type: 'text',
                            content: "Medisinsk rynkebehandling virker på de små ansiktsmusklene og hindrer at disse trekker seg sammen. Dermed blir den overliggende huden jevnere og rynker glattes ut.\n\nBehandlingen settes med en tynn nål og gir lite ubehag. Effekten kommer etter noen dager, men for noen tar det opp til 14 dager før effekten kommer. For å vedlikeholde optimal effekt bør man beregne og gjenta behandlingen 2-3 ganger i året."
                        },
                        {
                            title: 'Resultater',
                            type: 'text',
                            content: "Resultater fra vitenskapelige studier tyder på at effekten varer lenger etter hver ny behandling. Sannsynligvis beror dette på at muskelen som blir behandlet etter hvert blir mindre aktiv og svakere som resultat av at den ikke brukes."
                        },
                        {
                            title: 'Hvem kan ikke behandles?',
                            type: 'text',
                            content: "Gravide, ammende og de med spesielle nevrologiske sykdommer kan ikke behandles. Aldersgrensen er 25 år."
                        },
                        {
                            title: 'Bivirkninger',
                            type: 'text',
                            content: "Det oppstår sjelden bivirkninger, men det kan skje. Den vanligste bivirkningen er ømhet eller en liten blodutredelse på innstikkstedet. I sjeldne tilfeller kan man få en forbigående svekkelse av nærliggende muskler (f.eks. tunge øyelokk i 1-2 uker)."
                        },
                        {
                            title: 'Områder',
                            type: 'list',
                            listItems: [
                                { label: "1 område" },
                                { label: "2 områder" },
                                { label: "3 områder" },
                                { label: "4 områder" },
                                { label: "Platysma (hals)" },
                                { label: "Munnviker / Linjer" },
                                { label: "Øyebrynsløft" }
                            ]
                        }
                    ]
                },
                {
                    id: 'filler',
                    title: 'Fillerbehandlinger',
                    subtitle: 'Lepper, kinn og kontur',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
                    intro: 'Filler (hyaluronsyre) er en gelé som injiseres under huden for å gjenopprette tapt volum, slette linjer, myke opp furer eller forbedre ansiktskonturer. Det gir umiddelbart resultat.',
                    content: [
                        {
                            title: 'Hva er filler?',
                            type: 'text',
                            content: "Hyaluronsyre er et sukkermolekyl (polysakkarid) som er til stede i kroppsvev, for eksempel i hud og brusk. I hud fungerer det blant annet som fyllstoff. Fra en alder av ca. 25 år begynner man å miste noe av hyaluronsyren i huden. Filler kan glatte ut rynker, gi fylde til lepper eller erstatte volumtap i for eksempel kinn og kinnben."
                        },
                        {
                            title: 'Varighet',
                            type: 'text',
                            content: "Varigheten avhenger av hvor på ansiktet eller kroppen hyaluronsyre injiseres. I lepper kan den vare i alt i fra 6-12 mnd. Rundt kinnbensområdet kan det vare i 12 – 18 mnd. Generelt sett, jo oftere man injiserer hyaluronsyre, jo lenger varer effekten."
                        },
                        {
                            title: 'Kvalitet & Sikkerhet',
                            type: 'text',
                            content: "TM klinikken benytter kun godt dokumenterte kvalitetsmerker som Teosyal og Juvèderm. Disse er fremstilt gjennom en ikke-animalsk prosess som nesten eliminerer allergiske reaksjoner. Hos TM klinikken er vi opptatte av at alle behandlinger som gjøres skal være naturlige og aldersproporsjonale."
                        },
                        {
                            title: 'Prisliste',
                            type: 'list',
                            listItems: [
                                { label: "Leppefiller (0.5 ml)", value: "3000 kr" },
                                { label: "Leppefiller (1 ml)", value: "3600 kr" },
                                { label: "Kinnben / Kinn", value: "3600 kr" },
                                { label: "Kjeveparti / Hake", value: "3600 kr" },
                                { label: "Tear Through (mørke ringer)", value: "3900 kr" },
                                { label: "Tinning", value: "3600 kr" },
                                { label: "Facelift med filler", value: "fra 10 000 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'biostimulator',
                    title: 'Bio-stimulator & Skinbooster',
                    subtitle: 'Fukt, glød og spenst',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
                    intro: 'Biostimulatorer stimulerer hudens egen kollagen- og elastinproduksjon, og gir en gradvis, naturlig hudforbedring.',
                    content: [
                        {
                            title: 'Hva er biostimulatorer?',
                            type: 'text',
                            content: "Biostimulatorer er injeksjonsbehandlinger som stimulerer hudens egen kollagen- og elastinproduksjon, og gir en gradvis, naturlig hudforbedring over tid. I motsetning til tradisjonelle fillere som gir øyeblikkelig volum, jobber biostimulatorer med huden innenfra og gir økt fasthet, spenst og glød."
                        },
                        {
                            title: 'Hvem passer behandlingen for?',
                            type: 'text',
                            content: "Biostimulatorer passer for deg som ønsker:\n• Glattere og fastere hud\n• Økt spenst i ansiktet\n• Forbedring av hudstruktur, linjer og slapphet\n• Et mer ungdommelig utseende\n\nKan også brukes på hals."
                        },
                        {
                            title: 'Behandlingen',
                            type: 'text',
                            content: "Biostimulatorene injiseres i underhuden, hvor de aktiverer fibroblastene til å produsere mer kollagen og elastin. Resultatet utvikles gradvis over uker til måneder, og forbedres ofte ytterligere ved flere behandlinger. Behandlingen tar vanligvis 20-30 minutter. Mild hevelse eller ømhet kan oppstå, men du kan som regel gå tilbake til hverdagen umiddelbart. Blåmerker er også vanlig."
                        },
                        {
                            title: 'Hvor mange behandlinger trengs?',
                            type: 'text',
                            content: "Dette avhenger av hudens utgangspunkt, alder og ønsket resultat. Som regel anbefales:\n• 2–3 behandlinger med 4–6 ukers mellomrom\n• Vedlikehold én gang i året for langvarig effekt"
                        },
                        {
                            title: 'Bivirkninger og sikkerhet',
                            type: 'text',
                            content: "Biostimulatorer er godt dokumentert og regnes som trygge når de utføres korrekt.\nVanlige og milde bivirkninger inkluderer:\n• Ømhet og hevelse\n• Små blåmerker\n• Klumper (sjelden og oftest midlertidig)"
                        },
                        {
                            title: 'Hvem kan ikke behandles?',
                            type: 'text',
                            content: "Behandlingen anbefales ikke for:\n• Gravide eller ammende\n• Personer med aktive infeksjoner\n• Enkelte autoimmune sykdommer (vurderes individuelt)"
                        },
                        {
                            title: 'Priser',
                            type: 'list',
                            listItems: [
                                { label: "Skinbooster", value: "2300 kr" },
                                { label: "Profhilo Structura ansikt", value: "3500 kr" },
                                { label: "Bio-stimulator ansikt", value: "3500 kr" },
                                { label: "Bio-stimulator hals", value: "3500 kr" },
                                { label: "Pakkepris bio-stimulator (ansikt/hals)", value: "5500 kr" },
                                { label: "Bio-stimulator kur (3 beh. ansikt)", value: "8500 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'polynukleotider',
                    title: 'Polynukleotider',
                    subtitle: 'Reparerer og fornyer huden',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
                    intro: 'En ny generasjon biostimulerende injeksjonsbehandling som reparerer, fornyer og revitaliserer huden fra innsiden.',
                    content: [
                        {
                            title: 'Hva er polynukleotider?',
                            type: 'text',
                            content: "Polynukleotider er en ny generasjon biostimulerende injeksjonsbehandlinger som reparerer, fornyer og revitaliserer huden fra innsiden. Behandlingen består av DNA-fragmenter utvunnet fra laks eller andre naturlige kilder, som er svært biokompatible og trygge for menneskekroppen.\n\nDisse fragmentene virker som «byggesteiner» for huden, og stimulerer til:\n• Økt cellefornyelse\n• Bedre fuktbalanse\n• Forbedret elastisitet og spenst\n• Reduksjon av fine linjer"
                        },
                        {
                            title: 'Hvordan fungerer polynukleotider?',
                            type: 'text',
                            content: "Polynukleotider jobber på cellenivå ved å:\n• Aktivere fibroblaster (kollagen- og elastinproduserende celler)\n• Forbedre mikrosirkulasjon og hudens oksygentilførsel\n• Redusere oksidativt stress og betennelsestilstander i huden\n\nResultatet er en forbedret hudkvalitet som kommer gradvis og naturlig – helt uten å endre ansiktsformen eller mimikken."
                        },
                        {
                            title: 'Hva kan behandles?',
                            type: 'text',
                            content: "Polynukleotid-behandlinger er ideelle for:\n• Slapp og trett hud\n• Fine linjer og begynnende rynker\n• Tap av glød og fukt\n• Tynn og sensitiv hud, også under øynene (tear trough)\n• Akne-arr og ujevn hudstruktur\n• Hals, bryst, hender og andre områder med aldringstegn"
                        },
                        {
                            title: 'Behandlingen',
                            type: 'text',
                            content: "1. Konsultasjon: Med ansvarlig behandler (lege eller autorisert helsepersonell).\n2. Injeksjon: Små mengder polynukleotider injiseres med tynn nål eller kanyle i huden.\n3. Tid: Selve behandlingen tar ca. 20–30 minutter.\n4. Etterpå: Du kan oppleve lett hevelse, rødhet eller blåmerker i noen timer til dager. Du kan vanligvis gå tilbake til daglige aktiviteter rett etterpå."
                        },
                        {
                            title: 'Når ser man resultat?',
                            type: 'text',
                            content: "Resultatet kommer gradvis, med synlig forbedring etter 2–4 uker. Full effekt ses ofte etter 3 behandlinger, med ca. 2–4 ukers mellomrom. Vedlikeholdsbehandling anbefales hver 6.–12. måned."
                        },
                        {
                            title: 'Er behandlingen trygg?',
                            type: 'text',
                            content: "Ja. Polynukleotider er svært godt tolerert og trygge når de brukes riktig. Bivirkninger er sjeldne og ofte milde. Vanlige reaksjoner:\n• Midlertidig hevelse, ømhet eller blåmerker\n• Lett kløe eller rødhet i injeksjonsområdet"
                        },
                        {
                            title: 'Hvem passer ikke for behandlingen?',
                            type: 'text',
                            content: "Behandlingen er ikke anbefalt for:\n• Gravide eller ammende\n• Personer med aktiv infeksjon eller hudsykdom i området\n• Pasienter med alvorlige autoimmune tilstander (vurderes individuelt)"
                        },
                        {
                            title: 'Priser',
                            type: 'list',
                            listItems: [
                                { label: "Polynukleotider", value: "3500 kr" },
                                { label: "Polynukleotider kur (3 beh)", value: "8500 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'sklerosering',
                    title: 'Sklerosering',
                    subtitle: 'Fjerning av synlige blodkar',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
                    intro: 'Sklerosering er en trygg og effektiv injeksjonsbehandling som brukes for å fjerne synlige blodkar og spindelårer på ben.',
                    content: [
                        {
                            title: 'Hva er sklerosering?',
                            type: 'text',
                            content: "Sklerosering er en trygg og effektiv injeksjonsbehandling som brukes for å fjerne synlige blodkar og spindelårer (også kalt teleangiektasier), vanligvis på bein og legger. Behandlingen utføres ved at en medisinsk løsning injiseres direkte i det aktuelle blodkaret, noe som får det til å trekke seg sammen og gradvis forsvinne."
                        },
                        {
                            title: 'Hvem passer sklerosering for?',
                            type: 'text',
                            content: "Sklerosering passer for deg som:\n• Har synlige, overfladiske blodkar på beina\n• Ønsker et estetisk penere resultat\n• Er plaget av svie, tyngdefølelse eller kosmetisk ubehag\n• Er frisk ellers og ikke har alvorlige sirkulasjonsproblemer\n\nBehandlingen egner seg ikke for større åreknuter, disse må vurderes for annen type behandling (f.eks. kirurgi)."
                        },
                        {
                            title: 'Behandlingen',
                            type: 'text',
                            content: "En tynn nål brukes til å injisere en liten mengde skleroserende væske (ofte et medikament som polidokanol) inn i blodåren. Dette får karveggen til å 'klistre seg sammen', slik at blodet slutter å strømme gjennom, og karet brytes gradvis ned av kroppen. Behandlingen tar vanligvis 30–45 minutter."
                        },
                        {
                            title: 'Etter behandlingen',
                            type: 'text',
                            content: "Du kan gjenoppta normale aktiviteter samme dag. Bruk av kompresjonsstrømper anbefales i 1–2 uker etter behandling for best mulig resultat. Unngå hard trening, varme bad og direkte sollys på området de første dagene."
                        },
                        {
                            title: 'Hvor mange behandlinger trenger man?',
                            type: 'text',
                            content: "Antall behandlinger varierer, men mange trenger 1–3 behandlinger per område med 4–6 ukers mellomrom mellom hver behandling. Resultatet er gradvis – karene kan falme over flere uker etter behandling."
                        },
                        {
                            title: 'Bivirkninger',
                            type: 'text',
                            content: "Vanlige og milde bivirkninger:\n• Ømhet, rødhet eller blåmerker\n• Lett hevelse eller kløe i området\n• Midlertidig misfarging av huden\n\nSjeldne bivirkninger:\n• Hudirritasjon eller sår\n• Allergisk reaksjon (svært sjelden)\n• Blodpropp (ekstremt sjelden ved riktig seleksjon og teknikk)"
                        },
                        {
                            title: 'Hvem kan ikke behandles?',
                            type: 'text',
                            content: "Sklerosering anbefales ikke for deg som:\n• Er gravid eller ammer\n• Har kjent blodproppsykdom eller dårlig sirkulasjon\n• Har infeksjon i området som skal behandles\n• Har allergi mot virkestoffene som brukes"
                        }
                    ]
                },
                {
                    id: 'medisinsk',
                    title: 'Medisinske Indikasjoner',
                    subtitle: 'Tanngnissing, svette og migrene',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-34.jpg',
                    intro: 'Vi tilbyr behandling mot medisinske tilstander som tanngnissing, overdreven svette og migrene.',
                    content: [
                        {
                            title: 'Behandling',
                            type: 'text',
                            content: 'Vi tilbyr behandling mot medisinske tilstander som tanngnissing, overdreven svette og migrene. Ta kontakt for konsultasjon.'
                        }
                    ]
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
            subTreatments: [
                {
                    id: 'hårfjerning',
                    title: 'Permanent Hårfjerning',
                    subtitle: 'Alexandrite & Nd:YAG',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-59.jpg',
                    intro: 'Vi bruker de seneste laserne på markedet innen permanent hårreduksjon. Ingen andre laserteknologier kan måle seg med Alexandrite og Nd:YAG per dags dato når det gjelder varig hårreduksjon.',
                    content: [
                        {
                            title: 'Om Laserbehandling',
                            type: 'text',
                            content: "Uønsket hårvekst er noe mange opplever som plagsomt, og laserbehandling er en trygg metode som kan benyttes mot dette. Hos TM klinikken brukes avansert laserteknologi innen varig hårreduskjon.\n\nAlle kunder vil få en individuell konsultasjon før behandling. Konsultasjon laser er gratis."
                        },
                        {
                            title: 'Hårvekst og behandling',
                            type: 'text',
                            content: "Hårvekst påvirkes av flere faktorer, som alder, vitaminer, mineraler, hormoner, visse medisiner og arveanlegg. Videre påvirkes hårvekst av hårets syklus: om hårsekkene er aktive eller i hvile, hvor mange som er aktive og hvor tett sammen de sitter – alt dette er med på å bestemme hvor mye hår man har. For at laserbehandlingen skal fungere, er håret nødt til å være i en vekstfase, og siden ikke alle hårene er i denne fasen samtidig, er det ikke mulig å få fjernet alt hår på én behandling."
                        },
                        {
                            title: 'Behandlingen med Alexandrite- og Nd:YAG-laser',
                            type: 'text',
                            content: "Hårreduksjon med Alexandrite- og Nd:YAG-laser fungerer ved at lysglimt fra laseren absorberes i hårets mørke pigmenter og omdannes til varme. Denne varmen videreføres til hårsekken, noe som medfører at hårsekken dør. Ettersom laserglimtene tiltrekkes av fargepigmenter, vil behandlingen fungere best på mørke hår, og kombinasjonen mørkt hår på lys hud vil være ideell. Lyseblondt hår egner seg ikke like godt for laserbehandling, men kan la seg behandle ved gjentatte behandlinger hvis det er noe fargede pigmenter i håret. Hvitt hår kan ikke behandles med laser fordi det mangler pigmentstoff. Alexandrite er best på lys hud, mens Nd:YAG egner seg bedre for mørkere hudtyper.\n\nIngen andre laserteknologier kan måle seg med Alexandrite og Nd:YAG per dags dato når det gjelder varig hårreduksjon. Dette innebærer at antall behandlinger reduseres i forhold til andre lasertyper som ofte krever flere behandlingsrunder."
                        },
                        {
                            title: 'Smerte og sikkerhet',
                            type: 'text',
                            content: "Noe ubehag kan kjennes under behandlingen, men de fleste opplever dette kun som at laserpulsene «stikker litt», og vil fort venne seg til følelsen. I forhold til andre typer hårreduksjon, er smerten som oppleves, betraktelig mindre. Det er ingen farlig stråling forbundet med denne behandlingen, og den kan ikke være kreftfremkallende."
                        },
                        {
                            title: 'Tips før behandling',
                            type: 'text',
                            content: "• Det anbefales å avstå fra soling 3 uker før og etter behandlingen. Mørke hår mot lys hud anses som optimalt for laserbehandling, og brun hud vil kunne gi et dårligere utgangspunkt for effektiv behandling.\n• Barbering av området skal skje 1-2 dager før behandling. Ved kraftig hårvekst bør barbering gjøres samme dag som behandling. Napping og voksing skal unngås 4 uker før behandling\n• Bruk ikke bodylotion før laserbehandling."
                        },
                        {
                            title: 'Populære områder (Dame)',
                            type: 'list',
                            listItems: [
                                { label: "Overleppe", value: "800 kr" },
                                { label: "Hake + Overleppe", value: "1290 kr" },
                                { label: "Armhuler", value: "1300 kr" },
                                { label: "Bikinilinje", value: "1400 kr" },
                                { label: "Brasiliansk", value: "1900 kr" },
                                { label: "Legger", value: "2100 kr" },
                                { label: "Lår + Legger", value: "3490 kr" }
                            ]
                        },
                        {
                            title: 'Populære områder (Mann)',
                            type: 'list',
                            listItems: [
                                { label: "Rygg", value: "2400 kr" },
                                { label: "Bryst", value: "1900 kr" },
                                { label: "Mage", value: "1900 kr" },
                                { label: "Skjeggkant", value: "900 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'ipl',
                    title: 'IPL & Karfjerning',
                    subtitle: 'Blodkar, pigment og rødhet',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-59.jpg',
                    intro: 'Vi fjerner sprengte blodkar og pigmentflekker effektivt med laser og IPL.',
                    content: [
                        {
                            title: 'Om behandlingen',
                            type: 'text',
                            content: "Ved fjerning av blodkar brukes Nd:YAG og/eller IPL. Behandlingen utføres av autorisert helsepersonell.\n\nTips før behandling:\n• Unngå soling 3 uker før.\n• Bruk ikke bodylotion før behandling."
                        },
                        {
                            title: 'Smerte og sikkerhet',
                            type: 'text',
                            content: "Noe ubehag kan kjennes, som små 'stikk', men de fleste venner seg raskt til det. Det er ingen farlig stråling forbundet med behandlingen."
                        },
                        {
                            title: 'Priser',
                            type: 'list',
                            listItems: [
                                { label: "Sprengte blodkar (nese)", value: "900 kr" },
                                { label: "Sprengte blodkar (flere punkter)", value: "1600 kr" },
                                { label: "Pigmentflekk", value: "fra 1000 kr" },
                                { label: "Rødhet i ansiktet", value: "fra 1200 kr" },
                                { label: "Kar på ben (1 område)", value: "1000 kr" },
                                { label: "Funn (ett enkelt punkt)", value: "500 kr" },
                                { label: "Funn (flere punkter)", value: "1000 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'tatovering',
                    title: 'Tatoveringsfjerning',
                    subtitle: 'Q-switched Nd:YAG-laser',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-59.jpg',
                    intro: 'Vi fjerner tatoveringer effektivt med Q-switched Nd:YAG-laser. Antall behandlinger varierer.',
                    content: [
                        {
                            title: 'Konsultasjon & Behandling',
                            type: 'text',
                            content: "Ved tatoveringsfjerning benyttes Q-switched Nd:YAG-laser. Antall behandlinger varierer.\nDu kan sende inn bilde av tatoveringen din til post@tmklinikken.no for en vurdering.\n\nTips:\n• Unngå soling 3 uker før behandling.\n• Bacimycin er en salve som skal brukes på områdene som er laserbehandlet (fås kjøpt reseptfritt)."
                        },
                        {
                            title: 'Priser',
                            type: 'list',
                            listItems: [
                                { label: "Liten (ca 2x2 cm)", value: "850 kr" },
                                { label: "Medium (ca 5x5 cm)", value: "1250 kr" },
                                { label: "Stor (ca 10x10 cm)", value: "1550 kr" }
                            ]
                        }
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
            subTreatments: [
                {
                    id: 'klassisk_hudpleie',
                    title: 'Klassiske Ansiktsbehandlinger',
                    subtitle: 'Velvære, dyprens og fukt',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-50.jpg',
                    intro: 'Avslappende og rensende behandlinger for en sunn hud. Våre hudterapeuter skreddersyr behandlingen til din hud.',
                    content: [
                        {
                            title: 'Behandlinger',
                            type: 'list',
                            listItems: [
                                { label: "TM Relax hudpleie", value: "1300 kr" },
                                { label: "TM Klassisk dyprens", value: "850 kr" },
                                { label: "Hydrafacial klassisk", value: "1750 kr" },
                                { label: "Hydrafacial avansert", value: "2150 kr" },
                                { label: "Fjerning av milier", value: "400 kr" },
                                { label: "Intensiv fuktighets behandling ansikt – 75 min", value: "1490 kr" },
                                { label: "Sothys sesong ansiktsbehandling – 45 min", value: "990 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'medisinsk_ansikt',
                    title: 'Medisinske Ansiktsbehandlinger',
                    subtitle: 'Dermapen, Mesoterapi og Plexr',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-50.jpg',
                    intro: 'Avanserte behandlinger utført av spesialisert helsepersonell for dypere hudforbedring.',
                    content: [
                        {
                            title: 'Priser',
                            type: 'list',
                            listItems: [
                                { label: "Mesoterapi", value: "1300 kr" },
                                { label: "Dermapen/ microneedling", value: "1750 kr" },
                                { label: "Dermapen + medisinsk peel", value: "2050 kr" },
                                { label: "Dermapen + behandling mot svette, porer og blankhet", value: "2550 kr" },
                                { label: "Dermapen + mesoterapi", value: "2250 kr" },
                                { label: "Kombinasjonsbehandling: Dermapen, mesoterapi og peel", value: "2500 kr" },
                                { label: "TM Glød – Hydrafacial + Dermapen", value: "2890 kr" },
                                { label: "Fjerning av milier med plexr (plasmapen)", value: "1000 kr" },
                                { label: "Fjerning av skintags 10 stk med plexr (plasmapen)", value: "1000 kr" },
                                { label: "Fjerning av skintags over 10 stk med plexr (plasmapen)", value: "1500 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'arrbehandling',
                    title: 'Arrbehandling',
                    subtitle: 'Pixelnål',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-50.jpg',
                    intro: 'Behandling av arr for en jevnere hudstruktur.',
                    content: [
                        {
                            title: 'Priser',
                            type: 'list',
                            listItems: [
                                { label: "Arrbehandling med pixelnål", value: "1200 kr" }
                            ]
                        }
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
            subTreatments: [
                {
                    id: 'kombi_pop',
                    title: 'Populære Kombinasjoner',
                    subtitle: 'Optimaliserte pakker',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2025/02/3U7A9762.jpg',
                    intro: 'Se våre mest populære kombinasjonsbehandlinger.',
                    content: [
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
            subTreatments: [
                {
                    id: 'vipper',
                    title: 'Vipper & Bryn',
                    subtitle: 'Løft, laminering og farging',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/vipper-og-bryn.jpg',
                    intro: "Velstelte bryn og vipper er med på å skape en ramme til ansiktet ditt. Våre erfarne vippe- og brynseksperter har flere kurs og sertifiseringer, og oppdaterer seg jevnlig på de nyeste metodene innenfor dette feltet. Bryn og vipper får farge og fasong tilpasset ditt ansikt og dine ønsker.",
                    content: [
                        {
                            title: 'Om Vipper & Bryn',
                            type: 'text',
                            content: "Velstelte bryn og vipper er med på å skape en ramme til ansiktet ditt. Våre erfarne vippe- og brynseksperter har flere kurs og sertifiseringer, og oppdaterer seg jevnlig på de nyeste metodene innenfor dette feltet. Bryn og vipper får farge og fasong tilpasset ditt ansikt og dine ønsker."
                        },
                        {
                            title: "Behandlinger & Priser",
                            type: 'list',
                            listItems: [
                                { label: "Farging av vipper", value: "290 kr" },
                                { label: "Vippeløft inkl. farging", value: "990 kr" },
                                { label: "Vippeløft og brynsdesign", value: "1290 kr" },
                                { label: "Vippeløft og brynslaminering", value: "1590 kr" },
                                { label: "Brynsdesign (inkl. farging, voksing og forming)", value: "450 kr" },
                                { label: "Form bryn (uten farging)", value: "350 kr" },
                                { label: "Brynsdesign + farging av vipper", value: "590 kr" },
                                { label: "Brow stain (inkl. brynsdesign med voks/pinsett)", value: "685 kr" },
                                { label: "Brynslaminering (inkl. farging, voksing og forming)", value: "940 kr" },
                                { label: "Brynslaminering + farging av vipper", value: "1040 kr" },
                                { label: "Brynslaminering og brow stain", value: "1090 kr" }
                            ]
                        }
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
            intro: "Voksing er en populær, rask og effektiv hårfjerningsmetode med et langvarig resultat, opptil opptil 3-4 uker. Vi bruker voks av høy kvalitet og som er skånsom for huden. Våre voksspesialister utfører behandlingen skånsomt og effektivt. Voksingen avsluttes med en beroligende og mykgjørende olje.",
            subTreatments: [
                {
                    id: 'voks_kropp',
                    title: 'Kroppsvoks',
                    subtitle: 'Ben, rygg og bikini',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-29.jpg',
                    intro: 'Effektiv fjerning av uønsket kroppshår.',
                    content: [
                        {
                            title: 'Priser Kropp',
                            type: 'list',
                            listItems: [
                                { label: "Voks brasiliansk 1. gang", value: "800 kr" },
                                { label: "Voks brasiliansk hver 4-5. uke", value: "650 kr" },
                                { label: "Voks bikinilinje", value: "450 kr" },
                                { label: "Voks halv arm", value: "420 kr" },
                                { label: "Voks hel arm", value: "600 kr" },
                                { label: "Voks armhuler", value: "350 kr" },
                                { label: "Voks av lår", value: "600 kr" },
                                { label: "Voks legger", value: "550 kr" },
                                { label: "Voks hele ben", value: "950 kr" },
                                { label: "Voks hele ben (inkl. bikini)", value: "1050 kr" },
                                { label: "Voks rygg", value: "700 kr" },
                                { label: "Voks brystkasse", value: "700 kr" }
                            ]
                        }
                    ]
                },
                {
                    id: 'voks_ansikt',
                    title: 'Ansiktsvoks',
                    subtitle: 'Overleppe, hake og bryn',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-29.jpg',
                    intro: 'Skånsom voksing av ansiktshår.',
                    content: [
                        {
                            title: 'Priser Ansikt',
                            type: 'list',
                            listItems: [
                                { label: "Voks overleppe", value: "240 kr" },
                                { label: "Voks hake", value: "240 kr" },
                                { label: "Voks overleppe og hake", value: "340 kr" },
                                { label: "Voks kinn", value: "290 kr" },
                                { label: "Voks nesehår", value: "290 kr" },
                                { label: "Vokse hele ansiktet", value: "490 kr" }
                            ]
                        }
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
            intro: "Ønsker du egen tid og en deilig kroppsbehandling? Da har vi behandlingen du trenger!",
            subTreatments: [
                {
                    id: 'kropp_behandling',
                    title: 'Kroppsbehandling',
                    subtitle: 'Massasje og velvære',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-29.jpg',
                    intro: "Ønsker du egen tid og en deilig kroppsbehandling? Da har vi behandlingen du trenger!",
                    content: [
                        {
                            title: "Om Kroppsbehandling",
                            type: 'text',
                            content: "Ønsker du egen tid og en deilig kroppsbehandling? Da har vi behandlingen du trenger!\nVi tilbyr aromaterapi, antistress-behandling og deilig massasje av ansikt og hodebunn."
                        },
                        {
                            title: "Priser",
                            type: 'list',
                            listItems: [
                                { label: "Aromaterapi – 60 min", value: "1050 kr" },
                                { label: "TM antistress – 60 min", value: "1100 kr" },
                                { label: "Ansikt- og hodebunnsmassasje – 30 min", value: "490 kr" }
                            ]
                        }
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
            intro: "Enkelte behandlinger krever medisinsk helsepersonell for å få utført. Vi har legespesialist som underviser i ulike prosedyrer og sykepleiere som også har fordypning i disse behandlingene. Her er du i de tryggeste hender.",
            subTreatments: [
                {
                    id: 'lege_tjenester',
                    title: 'Lege- og sykepleiertjenester',
                    subtitle: 'Spesialistbehandlinger',
                    heroImage: 'https://tmklinikken.no/wp-content/uploads/2024/11/Ny-hjemmeside-53.jpg',
                    intro: 'Medisinske tjenester utført av spesialister.',
                    content: [
                        {
                            title: "Om tjenestene",
                            type: 'text',
                            content: "Enkelte behandlinger krever medisinsk helsepersonell for å få utført. Vi har legespesialist som underviser i ulike prosedyrer og sykepleiere som også har fordypning i disse behandlingene. Her er du i de tryggeste hender."
                        },
                        {
                            title: "Priser",
                            type: 'list',
                            listItems: [
                                { label: "Legemiddel for fjerning av filler", value: "fra 1500 kr" },
                                { label: "Fjerning av piercingarr må bookes i resepsjonen", value: "2500 kr" },
                                { label: "Medisinsk injeksjon mot migrene", value: "Pris på forespørsel" }
                            ]
                        }
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
