# Progressive Handoff & Context

**Date:** 02.01.2026
**Project:** TM Klinikken App (React Native / Expo)
**Last Action:** Fixed Critical Routing Bug & Started Debugging Admin Delete.

## 🚨 Critical Context (Current Session)
1.  **Routing Issue Resolved**: 
    - The "Unmatched Route" error preventing navigation to sub-Treatments is **FIXED**.
    - Solution involved removing a conflicting `app/(tabs)/index.tsx` file and correcting absolute paths in `app/(tabs)/index/index.tsx` and `app/(tabs)/index/treatment/[id]/index.tsx`.
    - Validated in browser: full flow from Dashboard -> Treatment -> Sub-treatment works.

2.  **Admin Delete Bug (Unsolved)**: 
    - **Issue**: Clicking "Slett hele denne kategorien" in Admin Panel does not work reliably. 
    - **Current State**: Replaced native `alert/confirm` with a custom in-UI confirmation view to bypass platform issues. 
    - **Blocker**: User reports an "Uncaught error" even with the new UI. Added logging to `performDelete` but haven't seen the specific error trace yet.
    - **Next Step**: Debug the "Uncaught error" in `app/admin/content-editor/[id].tsx`.

## 🧠 Permanent Context (From Previous Sessions)
1.  **Admin CMS Details**:
    - **URL**: `/admin`
    - **PIN**: `1234`
    - **Capabilities**: Create/Delete Categories, Sub-Treatments, and Content Blocks.
2.  **Data Architecture**:
    - **Source of Truth**: Firestore.
    - **Local Backup**: `src/constants/Menu.ts`.
    - **Sync Rule**: Use the "Seed" function in Admin to push local `Menu.ts` changes to cloud. Edits in Admin update Firestore directly.
3.  **App Structure**:
    - `app/(tabs)/index/`: Dashboard stack (User facing).
    - `app/admin/content-editor/`: Admin CMS.

## 📝 Next Session Checklist
1.  **Debug Admin Delete**: 
    - Open `app/admin/content-editor/[id].tsx` and investigate the "Uncaught error". 
    - Verify `ContentService.deleteTreatment` logic.
2.  **Deployment Prep**: Configure `app.json` bundle IDs and prepare for App Store/Play Store.
3.  **Mobile Testing**: Verify layout on true mobile simulators (iOS/Android).

## 📂 Key Files
*   `app/admin/content-editor/[id].tsx` (Focus for debugging delete)
*   `src/services/ContentService.ts`
*   `app/(tabs)/index/index.tsx` (Fixed routing)
