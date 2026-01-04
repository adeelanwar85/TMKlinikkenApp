# TM Klinikken App - Task List

- [x] **Research & Initialization** <!-- id: 0 -->
    - [x] Scrape `www.tmklinikken.no` for color palette, theme, and structure <!-- id: 1 -->
    - [x] **DEEP SCRAPE v2** <!-- id: 17 -->
        - [x] Extract full menu hierarchy (Main > Sub > Page) <!-- id: 18 -->
        - [x] Download logos and key assets locally <!-- id: 19 -->
        - [x] Map out all treatment categories and texts <!-- id: 20 -->
    - [x] **Visual Overhaul & Polish** <!-- id: 21 -->
        - [x] **COLOR CORRECTION**: Extract exact colors from uploaded logo/site (Burgundy/Charcoal) and update `Theme.ts` <!-- id: 22 -->
        - [x] **LOGO**: Replace `tm-logo.png` with new wide logo asset (1024x235) <!-- id: 23 -->
        - [x] **ANIMATION**: Implement subtle, aesthetic micro-interactions on Cards <!-- id: 24 -->
        - [x] **MENU**: Add "Priser" and "Bestill time" explicit options <!-- id: 25 -->
        - [x] **ASSETS**: Download relevant images from scraped URLs for the cards <!-- id: 26 -->
    - [x] **Content & Features Expansion** <!-- id: 27 -->
        - [x] **WELCOME SCREEN**: Fix logo transparency and branding <!-- id: 28 -->
        - [x] **DASHBOARD**: Replace 'Video' with 'Butikk' (WebView), remove 'Leger' link <!-- id: 29 -->
        - [x] **ABOUT US**: Scrape `tmklinikken.no/om-oss` (Text + Employees) and rebuild `about.tsx` <!-- id: 30 -->
        - [x] **LEGAL**: Update Privacy/Terms to TM Klinikken <!-- id: 31 -->
        - [x] **ICONS**: Generated & Implemented **Custom Series V3** (White/Transparent, Bold Uniform Line Art) <!-- id: 35 -->

- [x] **Implementation & Porting** <!-- id: 4 -->
    - [x] Copy core directory structure (`app/`, `src/`) from reference app <!-- id: 5 -->
    - [x] Copy and adapt `AuthContext.tsx` and navigation logic <!-- id: 6 -->
    - [x] Implement new Theme based on scraped data <!-- id: 7 -->
    - [x] Refactor content labels (Legetime -> Kosmetisk behandling) <!-- id: 8 -->

- [x] **Customization & Branding Overhaul** <!-- id: 12 -->
    - [x] Replace "TM Legetjenester" branding with "TM Klinikken" on Welcome Screen <!-- id: 13 -->
    - [x] Rebuild Dashboard Tabs to match scraped categories (Injeksjoner, Laser, etc.) <!-- id: 14 -->
    - [x] Replace Dashboard Cards with relevant aesthetic treatments <!-- id: 15 -->
    - [x] Fine-tune visual details (Fonts/Logos) to match website vibe <!-- id: 16 -->

- [ ] **Booking Flow & integration (EG Hano)** <!-- id: 41 -->
    - [x] **API**: Implement `hanoClient` with Mock Data toggle <!-- id: 42 -->
    - [x] **UI Polish**: Premium Gradient Headers, Custom Cards, Dynamic Icons <!-- id: 43 -->
        - [x] **Treatment List**: Mapped icons (Smiley, Drop, etc.) <!-- id: 44 -->
        - [x] **Calendar**: Fixed Web font (Sans-serif) <!-- id: 45 -->
    - [x] **Flow**: Navigation logic fixed (hiding native headers) <!-- id: 46 -->
    - [x] **Notifications**: Implement local notifications (Confirmed working via `summary.tsx` & `NotificationService`) <!-- id: 47 -->

- [ ] **Admin & Dynamic Content**
    - [x] Implement Admin CMS with Firestore integration
    - [x] Content Editor for Categories, Sub-treatments, and Blocks
    - [x] **Bug Fix**: Fix "Delete Treatment" functionality in Admin Panel
    - [x] **Bug Fix**: Fix "Delete Block" popup issue in Sub-treatment Editor
    - [x] **Bug Fix**: Fix "Delete Sub-treatment" inline confirmation in Parent Editor

- [ ] **Phase 3: Final Polish & User Requests (Batch 2)**
    - [ ] **Visual Polish**
        - [ ] **Splash Screen**: Create fun, animated splash (flashing icons under logo)
        - [ ] **Slogan**: Change "Din skjønnhet..." to "- Hud, laser og legetjenester" on Login/Welcome
        - [x] **Design Consistency**: Ensure all treatments match "Peelinger" pilot design (Intro Card Logic added for Hva/Hvordan/Om/Hvorfor)
    - [ ] **Functionality**
        - [ ] **Booking**: Swap "Avbestill" and "Flytt time" button positions
        - [x] **Hano**: Sync patient details (create customer) to Hano API on booking (Implemented lookup for Loyalty)
        - [x] **Loyalty**: Full Hano Integration (Treatments + Products) ✅
        - [ ] **Admin**: Verify ability to add generic main menu buttons/elements
    - [ ] **Auth & Security**
        - [ ] **Superuser**: Document password recovery process
        - [ ] **Biometrics**: Verify FaceID/TouchID & PIN creation status
        - [ ] **Login UI**: Add optional Address and Postcode fields
        - [ ] **Login UI**: Add alternative login methods (PIN/Bio) to form

- [ ] **Critical Bug Fixes**
    - [/] **Routing**: Fix "Unmatched Route" error for sub-treatments (e.g., `(tabs)/index/treatment/...`)
    - [x] **Verification**: Ensure navigation works for both hardcoded and dynamic treatments
    - [x] **Infrastructure**: Restart server after substantial file changes

- [ ] **Next Steps (Future Agents)** <!-- id: 37 -->
    - [ ] **Remaining Icons**: Generate "V3" style icons for "Lege" and "Bestill time" cards <!-- id: 38 -->
    - [ ] **Mobile Testing**: Verify safe areas and gradients on iOS/Android Simulators <!-- id: 39 -->
    - [ ] **Mobile Testing**: Verify safe areas and gradients on iOS/Android Simulators <!-- id: 39 -->
    - [x] **Deployment Config**: `app.json` configured with correct Bundle ID and Display Name. <!-- id: 40 -->
