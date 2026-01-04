const axios = require('axios');
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({ baseURL: BASE_URL, headers: { 'Authorization': `Bearer ${API_KEY}` }, validateStatus: () => true });

async function run() {
    console.log("Searching for ANY activity 2020-2025 to find a customer...");

    const act = await client.get('/Activity/search', { params: { departmentId: DEPARTMENT_ID, from: '2020-01-01', to: '2025-12-31', limit: 5 } });

    if (!act.data || act.data.length === 0) { console.log("Still NO activity found."); return; }

    const customerId = act.data[0].Customer?.Id;
    console.log(`Found Customer ID: ${customerId}`);

    if (customerId) {
        // Probe specifically for this customer
        const endpoints = [`/Customer/${customerId}/ProductPurchases`];
        for (const ep of endpoints) {
            const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
            console.log(`${ep}: ${res.status}`);
        }
    }
}
run();
