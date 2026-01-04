import { db } from './firebaseConfig';
import { setDoc, doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { isLoyaltyEligible, isLoyaltyProduct, LOYALTY_RULES } from '../constants/LoyaltyConfig';
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
    },

    /**
     * syncFullHistory
     * Fetches entire history from Hano and:
     * 1. Awards GOLD status if > 15,000 kr spend in last 12 months (on ANY paid service).
     * 2. Awards Points/Stamps for NEW paid Wellness appointments.
     */
    syncFullHistory: async (userId: string, phoneNumber: string) => {
        try {
            console.log(`[Loyalty] Starting Full Sync for ${phoneNumber}...`);

            // 1. Fetch all appointments from Hano
            const allAppointments = await HanoService.getCustomerAppointments(phoneNumber);
            if (!allAppointments.length) {
                console.log("[Loyalty] No history found in Hano.");
                return { updated: false, detail: 'No history' };
            }

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

            // Get already processed Hano IDs to avoid double-dipping points
            // We store this in a sub-collection 'loyalty_log' or simplified array in user doc
            // For robustness, let's look at the 'loyalty_log' subcollection
            const logsRef = collection(db, 'users', userId, 'loyalty_log');
            const logSnap = await getDocs(logsRef);
            const processedIds = new Set(logSnap.docs.map(d => d.data().hanoId));

            const now = new Date();
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(now.getMonth() - 12);

            let total12MonthSpend = 0;
            let newPoints = 0;
            let newStamps = 0;
            let updates = 0;

            for (const appt of allAppointments) {
                const apptDate = new Date(appt.Start);
                const isPaid = appt.Paid === true;
                const price = appt.Price || 0;

                // --- 1. VIP CALCULATION (All Paid Apps) ---
                if (isPaid && apptDate >= twelveMonthsAgo && apptDate <= now) {
                    total12MonthSpend += price;
                }

                // --- 2. POINTS & STAMPS (Wellness Only + Not Processed) ---
                // Skip if not paid or already processed
                const categoryId = String(appt.CategoryId || '');
                const isProduct = isLoyaltyProduct(categoryId);
                // Treatment check: Must be eligible AND NOT a product
                const isTreatment = isLoyaltyEligible(categoryId, price) && !isProduct;

                if (isPaid && !processedIds.has(appt.Id)) {
                    let awardedAny = false;
                    let p = 0;

                    // A. PRODUCT POINTS
                    if (isProduct) {
                        console.log(`[Loyalty] Product Found: ${appt.Service} (${price} kr)`);
                        p = Math.floor(price / 10); // 10% points on products
                        points += p;
                        newPoints += p;
                        awardedAny = true;
                    }

                    // B. TREATMENT STAMPS
                    if (isTreatment) {
                        console.log(`[Loyalty] Treatment Found: ${appt.Service}`);
                        // Stamps logic
                        if (price >= LOYALTY_RULES.MIN_PRICE_FOR_STAMP) {
                            stamps += 1;
                            newStamps += 1;
                            awardedAny = true;
                        }
                    }

                    if (awardedAny) {
                        updates++;
                        // Log this transaction so we don't count it again
                        await setDoc(doc(logsRef, String(appt.Id)), {
                            hanoId: appt.Id,
                            service: appt.Service,
                            date: appt.Start,
                            price: price,
                            pointsAwarded: p, // Might be 0 if only stamp
                            isProduct,
                            isTreatment,
                            processedAt: Date.now()
                        });
                    }
                }
            }

            // --- 3. APPLY RULES ---

            // Check for Rewards (5 Stamps)
            while (stamps >= LOYALTY_RULES.STAMPS_REQUIRED_FOR_REWARD) {
                stamps -= LOYALTY_RULES.STAMPS_REQUIRED_FOR_REWARD;
                const newVoucher = `FREE-FACIAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                activeVouchers = [...(activeVouchers || []), newVoucher];
                console.log("[Loyalty] Reward Earned: Free Facial!");
                updates++;
            }

            // Check VIP Status
            // Logic: Spend > 15,000 in last 12 months = GOLD
            const isGoldQualified = total12MonthSpend >= LOYALTY_RULES.VIP_QUALIFYING_AMOUNT;

            // Allow upgrade, handle downgrade only if explicit logic (currently sticky or handled elsewhere usually)
            // For MVP, if they qualify now, set them to Gold. If not, we might downgrade if they were Gold?
            // User requested: "Handler du for over 15k... blir du automatisk Gull-medlem"
            // We'll stricter: Status reflects CURRENT 12-month value.
            let newTier = 'bronse';
            if (isGoldQualified) newTier = 'gull';
            else if (points > LOYALTY_RULES.TIER_LIMITS.SILVER) newTier = 'sølv'; // Fallback to points based

            if (newTier !== tier) {
                console.log(`[Loyalty] Tier Change: ${tier} -> ${newTier} (Spend: ${total12MonthSpend})`);
                tier = newTier;
                updates++;
            }

            if (updates > 0 || total12MonthSpend > 0) {
                await updateDoc(userRef, {
                    loyalty: { stamps, points, tier, activeVouchers },
                    lastSyncDetails: {
                        spend12m: total12MonthSpend,
                        syncedAt: Date.now()
                    }
                });
                return { updated: true, newPoints, newStamps, newTier };
            }

            return { updated: false, detail: 'No new updates' };

        } catch (e) {
            console.error("[Loyalty] Sync Full History Error:", e);
            return { updated: false, error: e };
        }
    }
};
