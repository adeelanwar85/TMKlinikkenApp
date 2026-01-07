# AI Copilot Guide - TM Klinikken App

## Project Context
**App Name:** TM Klinikken
**Tech Stack:** React Native (Expo), TypeScript, Expo Router.
**Backend:** Hano API (Booking/Systems), WooCommerce (Web Shop for Products/Gift Cards).
**Design System:** "Premium/Clean". Deep Burgundy (`#A44E52` - `#502022`), Gold Accents (`#D4AF37`), White cleanliness.

## 🧠 Key Learnings & Patterns

### 1. Hano API Integration
*   **Balance Check:** `POST /Activity/giftcertificate/validate` works. Requires `DepartmentId` in the body.
*   **Purchase:** `POST /GiftCertificate` returns 500 errors. **DO NOT** attempt to implement direct API purchase again without new documentation. Use the WebView workaround.
*   **Customer Search:** `GET /customer/GetCustomerByMobile` is the most reliable lookup method.

### 2. WebView & Automation
*   **Approach:** For features blocking direct API access (like complex payments), use `react-native-webview`.
*   **Injection:** We use `injectedJavaScript` to auto-fill forms on the existing WordPress site.
*   **CORS:** Remember that script injection often fails in **Expo Web** due to Cross-Origin policies. Always verify automation logic on a physical simulator/device.

### 3. Design Standards (The "Premium" Look)
*   **Headers:** Avoid standard navigation bars where possible. Use custom, floating back buttons over full-screen content/hero sections.
*   **Inputs:** Use tall (>56px), distinct input fields with `borderRadius: 12` or `16`. Avoid default native inputs.
*   **Cards:** Use `LinearGradient` for backgrounds. Preferred gradients:
    *   **Dark (TM Glød):** `['#A44E52', '#3E1012']`
    *   **Logos:** Use `tm-symbol-white.png` (Symbol only) or clean text. Avoid logos with background boxes.

### 4. Code Patterns
*   **Navigation:** Use `router.push('/path')` from `expo-router`.
*   **Assets:** All icons in `assets/images/icons`. Use `LocalImageMap` if dynamic loading is needed.

## ⚠️ "Do Not Touch" Zones
*   **WebView Logic:** The success detection (`order-received`) and auto-fill scripts are finely tuned. Be careful changing the timing (currently 500ms intervals).
