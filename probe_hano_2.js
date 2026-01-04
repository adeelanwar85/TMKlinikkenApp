const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    }
});

async function probe() {
    console.log("Probing Hano API for CUSTOMER Sales...");

    // Try finding a valid customer first via Activity search
    let customerId = '';
    try {
        const actRes = await client.get('/Activity/search', { params: { departmentId: DEPARTMENT_ID, from: '2024-01-01', to: '2024-12-31' } });
        if (actRes.data.length > 0) {
            customerId = actRes.data[0].Customer.Id;
            console.log("Found Customer ID:", customerId);
        }
    } catch (e) { console.log("Failed to find customer:", e.message); }

    if (!customerId) return;

    const endpoints = [
        `/Customer/${customerId}/purchases`,
        `/Customer/${customerId}/orders`,
        `/Customer/${customerId}/sales`,
        `/Customer/${customerId}/receipts`,
        `/Invoice/search`, // Maybe it's an invoice?
        `/Report/sales`
    ];

    for (const ep of endpoints) {
        try {
            console.log(`Checking ${ep}...`);
            const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
            console.log(`✅ ${ep}: ${res.status} (Found!)`, res.data);
        } catch (error) {
            console.log(`❌ ${ep}: ${error.response?.status}`);
        }
    }
}

probe();
