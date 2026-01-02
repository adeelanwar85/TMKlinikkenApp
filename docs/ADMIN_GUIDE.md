# Admin Guide - TM Klinikken App

## 🔐 Tilgang til Admin-panelet

Appen har et skjult administrasjonspanel for redigering av innhold, ansatte og kampanjer.

### Hvordan åpne Admin-panelet:
1. Gå til **Profil** (Min Side) i appen.
2. Scroll helt nederst til du ser versjonsnummeret (f.eks. "Versjon 1.0.0").
3. **Trykk raskt 5 ganger** på versjonsnummeret.
4. En dialogboks vil dukke opp og be om PIN-kode.

### 🔑 Admin PIN-kode
Standard PIN-kode er: **1234**

*(Denne koden er hardkodet i appen for sikkerhet, og kan kun endres ved oppdatering av kildekoden).*

---

## 🆘 Glemt Passord / PIN

### For Administrator ("Superuser")
Hvis Admin PIN-koden (1234) ikke fungerer eller er glemt:
1. Siden koden er en del av selve app-koden, kan den ikke "nullstilles" via e-post.
2. Kontakt utvikler (Adeel) for å få bekreftet koden eller få den endret i en ny oppdatering av appen.

### For Vanlige Brukere (App-lås)
Hvis en vanlig bruker (kunde/ansatt) glemmer sin personlige PIN-kode til låseskjermen:
1. Det finnes ingen "Glemt kode"-knapp som sender SMS/e-post per i dag (av personvernhensyn lagres ikke koden sentralt).
2. Løsningen er å **slette appen og installere den på nytt**.
3. Ved reinstallasjon må brukeren logge inn / registrere seg på nytt, og kan da velge en ny PIN-kode.

---

## 🛠️ Funksjoner i Admin
- **Content Editor**: Rediger tekster, bilder og priser for behandlinger.
- **Kampanjer**: Legg til eller fjern "Fremhevede" kampanjer på forsiden.
- **Ansatte**: Oppdater liste over ansatte.
- **Push-varsel**: Send ut meldinger til alle brukere.

---

## 👨‍💻 Utvikler (Teknisk Gjenoppretting)

Siden du (Adeel) har tilgang til både kildekode og database, er du aldri utelåst.

### 1. Glemt Admin PIN-kode (App-lås)
Koden ligger i klartekst i filen: `app/(tabs)/profile.tsx`.
Søk etter strengen: `if (item === "1234")`

### 2. Glemt Superadmin Passord (Innlogging)
Passordet er lagret kryptert (hashed) i Firebase Firestore, så du kan ikke "se" det.
**Løsning:** Nullstill til standard (admin123).

1. Gå til **Firebase Console** -> **Firestore Database**.
2. Finn samlingen `users`.
3. Slett dokumentet med ID `admin`.
4. Start appen på nytt (reload).
5. Appen vil oppdage at admin mangler og automatisk opprette brukeren på nytt med:
   *   Brukernavn: **admin**
   *   Passord: **admin123**
