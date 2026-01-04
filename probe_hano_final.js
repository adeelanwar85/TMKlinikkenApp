const axios = require('axios');
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({ baseURL: BASE_URL, headers: { 'Authorization': `Bearer ${API_KEY}` }, validateStatus: () => true });

async function run() {
    console.log("🔥 Final Probe...");

    // 1. Check /Product (Baseline)
    const prod = await client.get('/Product', { params: { departmentId: DEPARTMENT_ID, limit: 1 } });
    console.log(`Product: ${prod.status} (Count: ${prod.data?.length})`);

    // 2. Activity Search (Broad & Deep)
    console.log("Searching Activity (Limit 50)...");
    const act = await client.get('/Activity/search', { params: { departmentId: DEPARTMENT_ID, from: '2020-01-01', to: '2025-12-31', limit: 50 } });
    console.log(`Activity Search Status: ${act.status}`);

    let customerId = null;
    if (act.data && Array.isArray(act.data)) {
        console.log(`Found ${act.data.length} activities.`);
        for (const a of act.data) {
            // Log keys of first one to debug
            if (!customerId) console.log("Sample Activity Keys:", Object.keys(a));

            const cid = a.Customer?.Id || a.CustomerId || a.customer?.id;
            if (cid) {
                console.log(`Found Customer ID: ${cid}`);
                customerId = cid;
                break;
            }
        }
    }

    // 3. Try Customer Search via POST
    if (!customerId) {
        console.log("Trying POST /Customer/search...");
        const custSearch = await client.post('/Customer/search', {}, { params: { departmentId: DEPARTMENT_ID } });
        console.log(`Customer POST Status: ${custSearch.status}`);
        if (custSearch.data && custSearch.data.length > 0) {
            customerId = custSearch.data[0].Id;
            console.log(`Found Customer ID via POST: ${customerId}`);
        }
    }

    // 4. Probe if we have a ID
    if (customerId) {
        console.log(`\n🚀 Probing endpoints for Customer ${customerId}...`);
        const eps = [
            `/Customer/${customerId}/ProductPurchases`,
            `/Customer/${customerId}/productpurchases`,
            `/Customer/${customerId}/Purchases`,
            `/Customer/${customerId}/Sales`,
            `/Customer/${customerId}/Receipts`
        ];
        for (const ep of eps) {
            const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
            console.log(`${ep}: ${res.status}`);
            if (res.status === 200) console.log(JSON.stringify(res.data).substring(0, 200));
        }
    } else {
        console.log("❌ FAILED to find any Customer ID.");
    }
}
run();
