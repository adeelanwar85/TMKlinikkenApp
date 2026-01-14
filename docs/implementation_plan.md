# Admin Panel Verification & Fix Plan

## Goal
Ensure the Admin Panel is fully functional for managing the business, specifically focusing on:
1.  **Campaigns**: Creating campaigns and triggering push notifications.
2.  **Loyalty**: Viewing/Editing customer points and stamps.
3.  **Push Notifications**: Sending manual alerts.

## 1. Campaigns & Push Integration
**Files to Verify:**
*   `app/admin/campaigns/[id].tsx` (Create/Edit logic)
*   `src/services/ContentService.ts` (Firebase implementation)

**Tasks:**
- [ ] Verify `handleSave` in `[id].tsx` calls `ContentService.saveCampaign`.
- [ ] **Feature:** Add checkbox "Send Push Notification" when creating a new campaign.
- [ ] **Logic:** largely if `sendPush` is true -> call `NotificationService.sendBroadcast()`.

## 2. Loyalty Administration
**Files to Verify:**
*   `app/admin/loyalty-debug/index.tsx` (Current "Loyalty Debug" tool)
*   `src/services/LoyaltyService.ts`

**Tasks:**
- [ ] The user asks "hvordan man gir ut stempler". Currently, this is automated via Hano.
- [ ] **Feature:** We need a manual "Give Stamp / Give Points" override in the Admin Panel for manual corrections.
- [ ] **Action:** Enhance `LoyaltyDebugger` or create `AdminCustomerDetail` to allow manual edits (protected by Admin PIN).

## 3. Push Notifications (Standalone)
**Files to Verify:**
*   `app/admin/push/index.tsx`

**Tasks:**
- [ ] Verify it connects to `ContentService.sendBroadcastNotification`.
- [ ] Check if it actually triggers a standardized Expo Push Notification or just an in-app alert.

## Proposed Workflow
1.  **Fix Campaigns**: Ensure creation works + Add "Send Push" toggle.
2.  **Fix Push**: Ensure the push service works.
3.  **Enhance Loyalty**: Create a manual "Give Stamp" button for admins.
