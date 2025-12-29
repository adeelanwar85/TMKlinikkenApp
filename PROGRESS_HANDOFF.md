# Progressive Handoff & Context

**Date:** 29.12.2025
**Project:** TM Klinikken App (React Native / Expo)
**Last Action:** Implemented Real Booking Flow & Linked Prices.

## 🚨 Critical Context
1.  **Live Data Active**: `USE_MOCK` is set to `false` in `HanoService.ts`. The app requires valid API credentials in `.env` to function.
2.  **Booking Flow**:
    *   Price List (`prices.tsx`) acts as the primary entry point for booking specific treatments.
    *   `BookingContext` holds the state.
    *   `Id` and `Duration` are crucial for the mapping to work.

## 🏗️ Architecture Status
*   **Service Layer**: `HanoService.ts` is the single source of truth.
*   **UI Integration**: `PricesScreen` is now tightly coupled with `BookingContext` to drive the flow.

## 📝 Next Session Checklist
1.  **Verify Calendar**: Check that `date-select.tsx` correctly displays slots for the *specific* treatment ID passed from the price list.
2.  **User Details**: Verify `summary.tsx` captures user details correctly before submitting to Hano.
3.  **Error Handling**: Test what happens if Hano returns an error (e.g. invalid API key) - does the app degrade gracefully?

## 📂 Key Files
*   `src/services/HanoService.ts`
*   `app/(tabs)/prices.tsx`
*   `src/context/BookingContext.tsx`
