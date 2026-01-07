const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPT_ID = 1;

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function findAnyBooking() {
    try {
        console.log(`🔍 Searching for ANY recent bookings (last 30 days)...`);

        // Hano might require Mobile, but let's try without
        const activityRes = await client.get('/Activity/search', {
            params: {
                // mobile: ... omitted
                departmentId: DEPT_ID,
                from: '2025-12-01', // Recent history
                to: '2026-01-30'
            }
        });

        const appointments = activityRes.data;
        if (!Array.isArray(appointments) || appointments.length === 0) {
            console.log("⚠️ No generic appointments found (API might enforce mobile filter).");
        } else {
            console.log(`✅ Found ${appointments.length} appointments! Here are a few IDs to test:`);
            appointments.slice(0, 5).forEach(app => {
                const name = app.Customer ? `${app.Customer.FirstName} ${app.Customer.LastName}` : 'Unknown';
                console.log(`   🔸 Booking ID: ${app.Id} | ${name} | Paid: ${app.Paid}`);
            });
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
        if (e.response) {
            console.log("   API Response:", e.response.data);
        }
    }
}

findAnyBooking();
