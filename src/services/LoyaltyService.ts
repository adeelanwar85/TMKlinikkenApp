import { db } from './firebaseConfig';
import { setDoc, doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { isLoyaltyEligible, LOYALTY_RULES } from '../constants/LoyaltyConfig';
import { HanoService } from './HanoService';

export const LoyaltyService = {

    /**
     * registerPendingBooking
     * Stores a shadow record of the booking.
     */
    registerPendingBooking: async (userId: string, booking: {
        serviceId: number;
        serviceName: string;
        categoryId: string;
        price: number;
        date: string;
        hanoId?: number;
    }) => {
        try {
            const bookingsRef = collection(db, 'users', userId, 'bookings');
            await addDoc(bookingsRef, {
                ...booking,
                status: 'UPCOMING',
                createdAt: Date.now()
            });
            console.log("[Loyalty] Registered pending booking:", booking.serviceName);
        } catch (e) {
            console.error("[Loyalty] Failed to register booking:", e);
        }
    },

    /**
     * syncPoints
     * Checks for UPCOMING bookings that have passed their date.
     * Verifies status with Hano (No-Show check) before awarding.
     */
    syncPoints: async (userId: string) => {
        try {
            console.log("[Loyalty] Syncing points for:", userId);
            const bookingsRef = collection(db, 'users', userId, 'bookings');
            const q = query(bookingsRef, where('status', '==', 'UPCOMING'));
            const snap = await getDocs(q);

            if (snap.empty) return { updated: false };

            const now = new Date();
            let newPoints = 0;
            let newStamps = 0;
            let updates = 0;

            const userRef = doc(db, 'users', userId);
            let userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    username: userId,
                    createdAt: Date.now(),
                    loyalty: { stamps: 0, points: 0, tier: 'bronse', activeVouchers: [] }
                });
                userSnap = await getDoc(userRef);
            }

            let currentLoyalty = userSnap.data()?.loyalty || { stamps: 0, points: 0, tier: 'bronse', activeVouchers: [] };
            let { stamps, points, tier, activeVouchers } = currentLoyalty;

            for (const docSnap of snap.docs) {
                const booking = docSnap.data();
                const bookingDate = new Date(booking.date);

                // If booking time has passed
                if (bookingDate < now) {

                    // --- HANO VERIFICATION ---
                    if (booking.hanoId) {
                        try {
                            const hanoBooking = await HanoService.getAppointment(booking.hanoId);
                            if (hanoBooking) {
                                const status = (hanoBooking.Status || '').toLowerCase();


                                // 1. Check Attendance (Negative Check)
                                if (status.includes('cancel') || status.includes('slett') || status === 'noshow' || status === 'ikke møtt') {
                                    console.log(`[Loyalty] Denied: User did not show up (Status: ${hanoBooking.Status})`);
                                    await updateDoc(docSnap.ref, { status: 'CANCELLED_BY_HANO', processedAt: Date.now() });
                                    continue;
                                }

                                // 2. Check Payment (Strict Check based on Swagger API Docs)
                                // Swagger says: "Paid": { "type": "boolean" }
                                if (hanoBooking.Paid === true) {
                                    // Verified! Proceed to award points.
                                    console.log(`[Loyalty] Verified: Appointment PAID. Awards authorized.`);
                                } else {
                                    console.log(`[Loyalty] Pending: Appointment NOT PAID (Paid: ${hanoBooking.Paid}).`);
                                    // Do NOT award points.
                                    continue;
                                }
                            }
                        } catch (err) {
                            console.warn("[Loyalty] Hano check failed, assuming innocent:", err);
                        }
                    }
                    // -------------------------

                    console.log(`[Loyalty] Completing booking: ${booking.serviceName}`);
                    await updateDoc(docSnap.ref, { status: 'COMPLETED', processedAt: Date.now() });

                    if (isLoyaltyEligible(booking.categoryId, booking.price)) {
                        const p = Math.floor(booking.price / 10);
                        points += p;
                        stamps += 1;
                        newPoints += p;
                        newStamps += 1;
                        updates++;

                        if (stamps >= LOYALTY_RULES.STAMPS_REQUIRED_FOR_REWARD) {
                            stamps = 0;
                            const newVoucher = `FREE-FACIAL-${Date.now()}`;
                            activeVouchers = [...(activeVouchers || []), newVoucher];
                        }
                    }
                }
            }

            if (updates > 0) {
                if (points >= LOYALTY_RULES.TIER_LIMITS.GOLD) tier = 'gull';
                else if (points >= LOYALTY_RULES.TIER_LIMITS.SILVER) tier = 'sølv';

                await updateDoc(userRef, {
                    loyalty: { stamps, points, tier, activeVouchers }
                });
                return { updated: true, newPoints, newStamps };
            }
            return { updated: false };

        } catch (e) {
            console.error("[Loyalty] Sync Error:", e);
            return { updated: false, error: e };
        }
    },

    /**
     * Get discount percentage
     */
    getDiscountPercentage: (tier: string) => {
        switch (tier?.toLowerCase()) {
            case 'gull': return 0.10;
            case 'sølv': return 0.05;
            default: return 0;
        }
    }
};
