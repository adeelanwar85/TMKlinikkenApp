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
     * Fetches entire history from Hano (Treatments + Products) and:
     * 1. Awards GOLD status if > 15,000 kr spend in last 12 months.
     * 2. Awards Points (10% on Products) and Stamps (Treatments > 1500 kr).
     */
    syncFullHistory: async (userId: string, phoneNumber: string, email?: string) => {
        try {
            console.log(`[Loyalty] Starting Full Sync for ${phoneNumber} (Email: ${email || 'N/A'})...`);

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

            // --- 1. FETCH & PROCESS APPOINTMENTS ---
            const appointments = await HanoService.getCustomerAppointments(phoneNumber);
            if (appointments.length > 0) {
                for (const appt of appointments) {
                    const apptDate = new Date(appt.Start);
                    const isPaid = appt.Paid === true;
                    const price = appt.Price || 0;

                    // VIP Spend
                    if (isPaid && apptDate >= twelveMonthsAgo && apptDate <= now) {
                        total12MonthSpend += price;
                    }

                    // --- 2. POINTS & STAMPS (Wellness Only + Not Processed) ---
                    // Skip if not paid or already processed
                    const categoryId = String(appt.CategoryId || '');
                    const isProduct = isLoyaltyProduct(categoryId);
                    // Treatment check: Must be eligible AND NOT a product
                    const isTreatment = isLoyaltyEligible(categoryId, price) && !isProduct;

                    // RESTRICTION: Only award points/stamps for activity in the last 12 months
                    // This prevents users getting rewards for very old history upon first install
                    const isRecent = apptDate >= twelveMonthsAgo;

                    if (isPaid && isRecent && !processedIds.has(appt.Id)) {
                        let awardedAny = false;
                        let p = 0;

                        // A. PRODUCT POINTS
                        if (isProduct) {
                            console.log(`[Loyalty] Product Found: ${appt.Service} (${price} kr)`);
                            p = Math.floor(price / 10); // 10% points on products
                            newPoints += p; // Update newPoints for return value
                            awardedAny = true;
                        }

                        // B. TREATMENT STAMPS
                        if (isTreatment) {
                            console.log(`[Loyalty] Treatment Found: ${appt.Service}`);
                            // Stamps logic
                            if (price >= LOYALTY_RULES.MIN_PRICE_FOR_STAMP) {
                                newStamps += 1; // Update newStamps for return value
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
            }

            // --- 2. FETCH & PROCESS PRODUCTS ---
            // Only if we can match a Customer ID
            const customerId = await HanoService.findCustomerId(phoneNumber, email);
            if (customerId) {
                console.log(`[Loyalty] Found Hano Customer ID: ${customerId}. Fetching products...`);
                const products = await HanoService.getCustomerProductHistory(customerId);

                for (const prod of products) {
                    const prodDate = new Date(prod.Purchased);
                    const price = prod.Price || 0;

                    // Generate unique ID for log (Prefix to avoid collision with appts)
                    const uniqueId = `prod-${prod.Id}`;

                    // VIP Spend & Recency Check
                    const isRecent = prodDate >= twelveMonthsAgo;

                    if (isRecent && prodDate <= now) {
                        total12MonthSpend += price;
                    }

                    // Product Points (10%) - Only if recent
                    if (isRecent && !processedIds.has(uniqueId)) {
                        console.log(`[Loyalty] Product Found: ${prod.Name} (${price} kr)`);
                        const p = Math.floor(price / 10);
                        newPoints += p;
                        updates++;

                        // Log
                        await setDoc(doc(logsRef, uniqueId), {
                            hanoId: uniqueId,
                            service: prod.Name,
                            date: prod.Purchased,
                            price: price,
                            pointsAwarded: p,
                            isProduct: true,
                            isTreatment: false,
                            processedAt: Date.now()
                        });
                    }
                }
            } else {
                console.log("[Loyalty] Could not resolve Hano Customer ID. Skipping product points.");
            }

            // --- 3. APPLY UPDATES ---
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

            stamps += newStamps;
            points += newPoints;

            // Check Rewards
            while (stamps >= LOYALTY_RULES.STAMPS_REQUIRED_FOR_REWARD) {
                stamps -= LOYALTY_RULES.STAMPS_REQUIRED_FOR_REWARD;
                const newVoucher = `FREE-FACIAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                activeVouchers = [...(activeVouchers || []), newVoucher];
                console.log("[Loyalty] Reward Earned: Free Facial!");
                updates++;
            }

            // Check VIP
            const isGoldQualified = total12MonthSpend >= LOYALTY_RULES.VIP_QUALIFYING_AMOUNT;
            let newTier = 'bronse';
            if (isGoldQualified) newTier = 'gull';
            else if (points > LOYALTY_RULES.TIER_LIMITS.SILVER) newTier = 'sølv';

            if (newTier !== tier) {
                console.log(`[Loyalty] Tier Change: ${tier} -> ${newTier} (Spend 12m: ${total12MonthSpend})`);
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
