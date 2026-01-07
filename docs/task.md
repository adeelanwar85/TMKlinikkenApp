# Loyalty & Auth Overhaul

## 1. Loyalty Debug Panel
- [x] Create `LoyaltyDebugScreen` (`app/admin/loyalty-debug/index.tsx`)
- [x] Integrate checking `HanoService.getBonusPointsBalance`
- [x] Integrate checking `HanoService.getBooking` (paid status)
- [x] Add Debug Panel to `app/admin/index.tsx`
- [x] Fix Crash: Replace `Alert.prompt` with `TextInput` for Web compatibility
- [x] Retrieve Valid Booking ID (Found ActivityId: 441902 via Debug Script)

## 2. Authentication System (Email vs SMS)
- [x] Research Hano API Email Search Capability
- [x] Discover API Limitation: `/customer/search` by email is broken/unreliable
- [x] Decision: Revert detailed Email Auth plan; fallback to Mobile/SMS
- [x] Update `app/login.tsx` to prioritize Mobile/SMS flow
- [x] Verify Login Flow with User 'Adeel Anwar' (98697419) - Confirmed via Script

## 3. Loyalty Integration (Deep)
- [x] Update `LoyaltyService.ts` to check `Paid` flag from Hano
- [x] UI: Show Hano-native points in `app/(tabs)/profile.tsx`
- [x] Fix Service: Handle Hano API Paginated History Response (`Items` array)

## 4. Verification
- [x] Manual Test: Login with Mobile (98697419)
- [x] Manual Test: Check Loyalty Balance in Debug Panel
- [x] Script Verification: Confirmed history fetching and parsing logic.
