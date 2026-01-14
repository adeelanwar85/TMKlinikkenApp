# TM Klinikken App - Roadmap & Tasks

## 1. Authentication & Loyalty (Completed ✅)
- [x] **Email OTP Implementation**
  - [x] Research Hano API for Email support (`SendPasswordReminder`).
  - [x] Update `HanoService.sendOTP` to prioritize Email.
  - [x] Update `LoginScreen` to pass email param.
- [x] **Login Stability**
  - [x] Fix `handleRegister` & `handleOtpSubmit` crash (implemented missing functions).
  - [x] Verify `handleDateChange` logic.
- [x] **Tab Bar UI**
  - [x] Fix text cutoff (Height: 85px, Padding: 24px).
  - [x] Verified on Web & Mobile simulation.
- [x] **Loyalty Logic**
  - [x] Verified Hano Sync (10% products, Stamps for >1500,-).

## 2. Admin & Content (Completed ✅)
- [x] **Campaigns System** (`app/admin/campaigns`)
  - [x] Connect to Firestore for CRUD operations.
  - [x] Implement "Create Campaign" (Verified Push Integration).
- [x] **Push Notifications** (`app/admin/push`)
  - [x] Verified integration.
- [x] **Loyalty Manual Override** (`app/admin/loyalty-debug`)
  - [x] Implement Manual Stamp/Points assignment.

## 3. Gift Cards (Partial)
- [ ] **Gift Card Polish**
  - [ ] Review `GiftCardService` purchase flow (currently WebView).
  - [ ] Investigate replacement with native API (if documentation allows).

## 4. Postponed / Backlog
- [ ] **Product Shop** (Postponed by request).
- [ ] Native Payment Integration (Vipps/Stripe).
