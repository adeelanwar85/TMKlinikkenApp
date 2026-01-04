const axios = require('axios');
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({ baseURL: BASE_URL, headers: { 'Authorization': `Bearer ${API_KEY}` }, validateStatus: () => true });

async function run() {
    console.log("Fetching ANY activity (2020-2025) to inspector structure...");

    // IMPORTANT: Broad range because previous broad probe found data (but crashed)
    const act = await client.get('/Activity/search', { params: { departmentId: DEPARTMENT_ID, from: '2020-01-01', to: '2025-12-31', limit: 1 } });

    if (act.data && act.data.length > 0) {
        console.log("✅ Activity Found! Dumping structure:");
        console.log(JSON.stringify(act.data[0], null, 2));

        // Attempt to find Customer ID safely
        const item = act.data[0];
        // Log all keys to help identify
        console.log("Keys:", Object.keys(item));

        const customerId = item.Customer?.Id || item.CustomerId || item.customer?.id || item.customerId;

        if (customerId) {
            console.log("\nFound Customer ID:", customerId);
            console.log("Probing Customer endpoints...");
            const eps = [
                `/Customer/${customerId}/ProductPurchases`,
                `/Customer/${customerId}/productpurchases`,
                `/Customer/${customerId}/Purchases`,
                `/Customer/${customerId}/Sales`,
                `/Customer/${customerId}/Receipts`,
                `/Customer/${customerId}/Orders`
            ];
            for (const ep of eps) {
                try {
                    const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
                    console.log(`Checking ${ep} ... ${res.status}`);
                    if (res.data) console.log(JSON.stringify(res.data).substring(0, 200));
                } catch (e) {
                    console.log(`Checking ${ep} ... Error: ${e.message}`);
                }
            }
        } else {
            console.log("⚠️ Could not locate Customer ID in the object.");
        }
    } else {
        console.log("No activity found at all under broad range. Very strange.");
    }
}
run();
