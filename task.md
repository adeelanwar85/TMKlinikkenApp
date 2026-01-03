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

- [x] **Admin Panel Features**
    - [x] **Generic Menu Support**: Add Support for "External Links" in Content Editor
    - [x] **Documentation**: Create ADMIN_GUIDE.md and admin_cheat_sheet.md
    - [x] **Access**: Verify PIN and Login logic (Admin vs Superuser)

- [x] **UI & UX Polish**
    - [x] **My Appointments**: Fix button order (Change Left, Cancel Right)
    - [x] **Treatment Details**: Verify V3 Design Consistency

- [ ] **Next Steps (Future Agents)** <!-- id: 37 -->
    - [ ] **Mobile Testing**: Verify safe areas and gradients on iOS/Android Simulators <!-- id: 39 -->
    - [ ] **Deployment**: Configure `app.json` bundle IDs and build standalone app <!-- id: 40 -->

- [x] **Booking Flow & integration (EG Hano)** <!-- id: 41 -->
    - [x] **API**: Implement `hanoClient` with Mock Data toggle <!-- id: 42 -->
    - [x] **UI Polish**: Premium Gradient Headers, Custom Cards, Dynamic Icons <!-- id: 43 -->
        - [x] **Treatment List**: Mapped icons (Smiley, Drop, etc.) <!-- id: 44 -->
        - [x] **Calendar**: Fixed Web font (Sans-serif) <!-- id: 45 -->
    - [x] **Flow**: Navigation logic fixed (hiding native headers) <!-- id: 46 -->
    - [x] **Notifications**: Implement local notifications (24h + 2h Reminders) <!-- id: 47 -->

- [x] **Sustainability & Handoff**
    - [x] **AI Guide**: Create `docs/AI_COPILOT_GUIDE.md` for future agents

- [x] **Roadmap: Kundeklubb (Loyalty)** 💎
    - [x] **Config**: Create `LoyaltyConfig.ts` to map Medical (No) vs Wellness (Yes)
    - [x] **Schema**: Add `stamps`, `points`, `vouchers` to User in Firestore
    - [x] **UI**: Build "Glow Card" (Stamp View) and "Min Lommebok"
    - [x] **Safety**: Implement Real-time Hano Check (Attendance + Payment 'Betalt av kunde').
    - [x] **Bug Fixes**: Resolve Bundler 500 Global Error (Syntax in `summary.tsx`).
    - [x] **GlowCard**: Fix crash due to missing `Small` import (replaced with `Caption`).

- [x] **Navigation Restructure (User Request)**:
  - [x] Replace 'Butikk' tab with 'Kundeklubb' (Loyalty).
  - [x] Move 'Butikk' to Top Header (Right Icon).
