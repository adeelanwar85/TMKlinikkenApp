const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1; // Assuming 1 from env

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    }
});

async function probe() {
    console.log("Probing Hano API for Sales/Products...");

    const endpoints = [
        '/Sale',
        '/Sale/search',
        '/Order',
        '/Order/search',
        '/Receipt',
        '/Receipt/search',
        '/Product',
        '/Product/search'
    ];

    for (const ep of endpoints) {
        try {
            console.log(`Checking ${ep}...`);
            const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
            console.log(`✅ ${ep}: ${res.status} (Found!)`);
        } catch (error) {
            console.log(`❌ ${ep}: ${error.response?.status || error.message}`);
        }
    }
}

probe();
