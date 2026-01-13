const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const CUSTOMER_ID = 642; // Adeel

const client = axios.create({
    baseURL: 'https://api.bestille.no/v2',
    headers: { 'Authorization': `Bearer ${API_KEY}` }
});

async function checkBonus() {
    console.log(`Checking Native Hano Bonus Points for ID ${CUSTOMER_ID}...`);
    try {
        const res = await client.get(`/customer/${CUSTOMER_ID}/bonuspoints/balance`);
        console.log("✅ STATUS:", res.status);
        console.log("💰 BALANCE:", res.data);
        // Expected: might be a number, or object { Current: ... }
    } catch (e) {
        console.log("❌ ERROR:", e.message);
        if (e.response) console.log("   Body:", JSON.stringify(e.response.data));
    }
}

checkBonus();
