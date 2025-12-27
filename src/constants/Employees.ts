export interface Employee {
    name: string;
    title: string;
    image: any;
    bio?: string;
}

export const EMPLOYEES: Employee[] = [
    {
        name: 'Ine Møller Anwar',
        title: 'Eier og kosmetisk dermatologisk sykepleier',
        image: require('@/assets/images/employees/ine.webp'),
        bio: "Utdannet sykepleier ved Høgskolen i Østfold. Videreutdanning i kosmetisk dermatologisk sykepleie ved Hudpleieakademiet. Ine har en stor lidenskap for faget og har blant annet utviklet egne teknikker innen insjeksjonsbehandlinger. Sertifisert injeksjonsbehandler på høyeste nivå hos Teoxane og Juvederm.\n\nIne underviser i medisinsk injeksjonsbehandlinger for InciDerm, og i fillerbehandlinger og injeksjonsbehandlinger for Teoxane – et av verdens største fillerselskaper.",
    },
    {
        name: 'Adeel Anwar',
        title: 'Eier og ansvarlig lege',
        image: require('@/assets/images/employees/adeel.webp'),
        bio: "Spesialist i estetisk medisin og ansvarlig lege hos TM. Utdannet ved Universitetet i Oslo, overlege i indremedisin og akuttmedisin på akuttmottaket Kalnes. Dr. Anwar har flere videregående kurs innenfor de fleste estetiske behandlinger og er sertifisert injeksjonsbehandler på høyeste nivå hos Teoxane og Juvederm.\n\nDr. Anwar underviser i fillerbehandlinger og injeksjonsbehandlinger for InciDerm og for Teoxane – et av verdens største fillerselskaper.",
    },
    {
        name: 'Ida Marie Strømnes',
        title: 'Sykepleier og klinikkleder',
        image: require('@/assets/images/employees/ida.webp'),
        bio: "Ida ble ferdig utdannet sykepleier i 2020, og har jobbet ved hjerteavdelingen og overvåkningen på Kalnes sykehus. Hun har også en bachelore i ernæring, og hun har tidligere jobbet som ernæringsfysiolog ved en overvektsklinikk. Ida er en sporty dame som også jobber som senterleder og trener ved XT Fredrikstad.\n\nIda har stor interesse for hud og hudhelse, og hennes mål er å fremheve de naturlige trekkene hos mennesker.",
    },
    {
        name: 'Susann Lindèn Fejzulai',
        title: 'Kosmetisk dermatologisk sykepleier',
        image: require('@/assets/images/employees/susann.webp'),
        bio: "Susann ble ferdigutdannet sykepleier i 2010. Hun har erfaring innen både psykiatri, somatikk og prehospital tjeneste. Hun har flere behandling og produktkurs og er godt kurset av TM´s ansvarlige lege. Hun har også en rekke kurs innen akuttmedisin, deriblant akuttmedisinsk grunnkurs, så hos Susann er du i trygge hender.\n\nSusann har god estetisk sans og er opptatt av den naturlige skjønnheten i hvert enkelt menneske.",
    },
    {
        name: 'Frank Wallin Nilsen',
        title: 'Kosmetisk dermatologisk sykepleier',
        image: require('@/assets/images/employees/frank.webp'),
        bio: "Frank er utdannet sykepleier via Høgskolen i Østfold. Han har jobbet innen psykisk helsevern siden 2004. Frank jobber med injeksjoner og laser på TM og han har stor interesse for faget. Han er kurset gjennom Teoxane academy Norway, TM akademiet og han har tatt utdanning innen avansert hudpleie. Frank er presis og har et godt estetisk blikk, og ikke minst en veldig trivelig fyr!",
    },
    {
        name: 'Zahra Banki',
        title: 'Kosmetisk dermatologisk sykepleier',
        image: require('@/assets/images/employees/zahra.webp'),
        bio: "Zahra ble ferdig utdannet sykepleier i 2013 ved Høgskolen i Østfold. Hun har jobbet med flere områder innen helse, blant annet eldreomsorgen, flyktningshelsetjeneste og som sykepleier på infeksjonsavdelingen på sykehuset i Østfold.\n\nZahra har et brennende interesse for hud-, og laserbehandlinger og er godt kurset innen fagfeltet.\n\nZahra snakker kurdisk flytende og behersker arabisk godt.",
    },
    {
        name: 'Naomi Thorgaard',
        title: 'Resepsjonist',
        image: require('@/assets/images/employees/naomi.webp'),
        bio: "Naomi er utdannet make-up-artist og er opptatt av velvære og trening. Hun har tidligere jobbet med administrasjon og ledelse. Er det noe Naomi er opptatt av, er det å gi kunden en god opplevelse og yte god service. Her på TM Klinikken møter du hennes varme, brede smil i resepsjonen.",
    },
    {
        name: 'Tonje Bøe',
        title: 'Hudterapeut',
        image: require('@/assets/images/employees/tonje.webp'),
        bio: "Vår hudterapeut Tonje er utdannet Makeup Artist hos NISS (nordisk institutt for scene og studio) i 2004. Hun har også videreutdannet seg i spesial effects hos NISS i 2005.\n\nTonje elsker å jobbe med vippe- og brynsbehandlinger og er kurset i dette jevnlig siden første kurset i 2013. I 2022 ble hun ferdig utdannet hudterapeut og en av Tonje`s store lidenskaper er hudbehandlinger. Hun har også 15 års arbeidserfaringen innen salg, salgsopplærinqg, ledelse, kursing og coaching.\n\nTonje er kursholder på HiBrow lamination og HiBrow brynstyling og lashlift. Hos Tonje får du en god opplevelse uansatt hvilken behandling du går til. Hun er rolig, nøye og en dame med glimt i øyet. Hun gir deg en nydelig avbrekk fra en travel hverdag.",
    },
    {
        name: 'Magdalena Wojcik',
        title: 'Hud- og Kroppsterapeut',
        image: require('@/assets/images/employees/magdalena.webp'),
        bio: "Magdalena er utdannet hud – og kroppsterapeut i Krakow, Polen, i 2003. Magdalena har over 20 års erfaring i bransjen.\n\nMagdalena`s store lidenskap er hudbehandlinger, og aromaterapi. Hun veileder deg gjerne innenfor hud og hudpleie til hjemmebruk.\n\nHos oss vil du møte Magdalena i ulike behandlinger som vippe – og brynsbehandlinger, velværebehandlinger, kroppsbehandlinger og hudbehandlinger.",
    },
    {
        name: 'Ingrid Schwer',
        title: 'Kosmetisk dermatologisk sykepleier',
        image: require('@/assets/images/employees/ingrid.webp'),
        bio: "Ingrid er utdannet sykepleier ved høgskolen i Oslo, 2011. Hun har jobbet innen eldreomsorg, nevrologi og slagbehandling. Hun startet som kosmetisk Dermatologisk sykepleier i 2018 og har videreutdanning innen injeksjonsbehandlinger fra Amabilis Academy og kosmetisk Dermatologisk sykepleie ved senzie akademiet.\n\nHun er kurset via flere ledende leverandører innen estetiske behandlinger.\n\nIngrid er en engasjert kosmetisk sykepleier som brenner for faget. Hun har et estetisk blikk og er svært nøye i behandlingene hun utfører. Hun har en ekstra stor lidenskap for leppebehandlinger og kombinasjonebehandlinger med dermapen og peelinger.",
    },
];
