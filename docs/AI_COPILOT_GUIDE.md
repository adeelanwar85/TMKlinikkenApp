# AI Copilot Guide for TM Klinikken App 🤖

**Dette dokumentet er laget for å hjelpe fremtidige AI-agenter (som deg) med å forstå, vedlikeholde og utvide denne appen raskt og trygt.**

## 🏗 Prosjektstruktur & Teknologi
*   **Rammeverk:** React Native (Expo SDK 52)
*   **Språk:** TypeScript
*   **Navigasjon:** Expo Router (`app/` directory routing)
*   **Database:** Firebase Firestore
*   **State Management:** React Context (`AuthContext`, `BookingContext`) + Local Hooks

### Viktige Mapper
*   `app/(tabs)`: Hovednavigasjonen (Tabs). Skjulte "tabs" (som `treatment/[id]`) er også her.
*   `app/admin`: Hele admin-panelet. Ligger utenfor tabs for fullskjermvisning.
*   `src/services`: All forretningslogikk (Auth, Content, Notifications, Hano).
*   `src/components`: Gjenbrukbare UI-komponenter (sjekk `ServiceCard.tsx` og `Input.tsx`).
*   `src/theme`: Farger og typografi (`Theme.ts`). **Bruk alltid `Colors` herfra, ikke hardkodede hex-koder.**

---

## 🔑 Nøkkelfunksjoner & Logikk

### 1. Admin Tilgang (Secret Trigger)
Admin-panelet er skjult for vanlige brukere.
*   **Fil:** `app/(tabs)/profile.tsx`
*   **Metode:** `handleVersionTap` (5 trykk på versjonsnummeret).
*   **PIN:** Hardkodet til `1234` (mobil) eller `admin`/`admin123` (web login).

### 2. Dynamisk Innhold (ContentService)
Vi bruker en hybridmodell:
*   **Statisk meny:** Definert i `src/constants/Menu.ts` (fallback).
*   **Dynamiske overstyringer:** Hentes fra Firestore (`treatments`-kolleksjonen).
*   **Editor:** `app/admin/content-editor/[id].tsx` lar admin endre tekster/bilder.
    *   *Tips:* Hvis `details` er `undefined` og `url` er satt, rendres det som en ekstern lenke.
*   **Push-varsler:** Admin-panelet har en "Send Varsel"-fane for å teste eller sende manuelle beskjeder til alle (hvis backend støtter det). Lokale påminnelser kjører automatisk.

### 3. Booking & Hano Integrasjon
*   Vi bruker en **mock-klient** (`HanoService.ts`) som standard.
*   For å skru på ekte API, endre `USE_MOCK_DATA = false`.
*   Priser og behandlinger hentes fra `services/HanoService.ts`.
*   **NYTT (Funnet i Swagger):**
    *   `GET /customer/{id}/bonuspoints/balance`: Henter Hano-beregnede poeng.
    *   `POST /customer/SendOneTimePassword`: For SMS-innlogging (OTP).
    *   `GET /customer/GetCustomerByMobile`: For oppslag ved login.

### 4. Varslinger (NotificationService)
*   Bruker `expo-notifications`.
*   Støtter både 24t og 2t påminnelser.
*   Logikken håndterer nettleser-simulering (console log / alert) siden `scheduleNotificationAsync` ikke virker på web.

### 5. Lojalitet & Hano-Sikkerhet (LoyaltyService)
*   **Dual Logic:** Vi skiller nå strengt mellom **Stempler** og **Poeng**.
    *   **Stempler (Treatments):** Gis for behandlinger > 1500,- som *ikke* er produkter. Sjekkes mot `WELLNESS_CATEGORIES` i `LoyaltyConfig.ts`.
    *   **Poeng (Products):** Gis for produkter definert i `PRODUCT_CATEGORIES` (10% poeng).
        *   **NEW:** Vi bruker `POST /customer/search` (Email/Sms) + `GET /customer/{id}/history/products` for å hente faktisk kjøpshistorikk.
        *   **RESTRICTION:** Vi gir kun poeng for kjøp gjort de **siste 12 månedene** for å unngå retroaktiv "bonus-sjokk" ved første installasjon.
*   **Smart Sync:**
    *   Bookinger lagres lokalt som `UPCOMING`.
    *   `syncFullHistory` henter historikk fra Hano (`/Activity` + Produkter).
    *   Sikkerhet: Sjekker alltid `Paid: true` fra Hano før utdeling.
*   **VIP Status:** Beregnes basert på totalt forbruk (behandlinger + produkter) siste 12 mnd (>15k = Gull).

### 6. Hano API "Gullgruve" (Discovery 2026) 🕵️‍♂️
Vi har scannet Swagger UI og funnet følgende endepunkter vi BØR utnytte:

#### A. Gavekort (Gullgruve!)
*   `GET /GiftCertificate`: Søk/Hent gavekort.
*   `POST /GiftCertificate`: Kjøp nytt gavekort.
*   `POST /GiftCertificate/SendByEmail/{id}`: Send digitalt gavekort.
*   *Plan:* Implementer "Kjøp Gavekort" i appen (Min Side).

#### B. Produkter & Nettbutikk
*   `GET /Product`: Henter alle produkter (kan brukes til å lage "Butikk"-fane).
*   `POST /Purchase`: Handlekurv/kjøp.
*   `GET /product/search`: Søk.

#### C. Venteliste
*   `POST /customer/{customerId}/waitlist`: Sett kunde på venteliste ved fullbooket dag.
*   `POST /urgent/search`: "Først til mølla"-timer?

#### D. Lojalitet (Native)
*   `GET /customer/{id}/punchcard/details`: Hano har faktisk innebygd stempelkort! Vi bør sjekke om dette kan erstatte vår lokale logikk på sikt.

---

## 🛠 Vanlige Oppgaver (How-To)

### Hvordan legge til en ny side?
1.  Opprett filen i `app/`. Hvis den skal ha tab-bar, legg den i `app/(tabs)/`.
2.  Husk å legge den til i `app/(tabs)/_layout.tsx` hvis den skal være en tab (eller skjult tab).

### Hvordan endre en farge globalt?
1.  Gå til `src/theme/Theme.ts`.
2.  Endre verdien der. Alle komponenter som bruker `Colors.primary.deep` etc. vil oppdateres.

### Hvordan oppdatere Admin-menyen?
1.  Gå til `app/admin/index.tsx`.
2.  Legg til et nytt `MenuCard` som peker til din nye admin-rute.

---

## 🚨 Kjente "Quirks"
*   **Web vs Native:** Appen kjører i Chrome nå. Noen native-moduler (som `SecureStore`) har fallbacks til `localStorage` eller `AsyncStorage` på web. Sjekk alltid `Platform.OS === 'web'`.
*   **Text Import:** Husk å alltid importere `Text` fra `react-native`, *ikke* bruk browserens `Text`-konstruktør.

---

*Lykke til, Agent! 🫡*
