const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
    validateStatus: () => true
});

async function sniperProbe() {
    console.log("🎯 Sniper Probe for Receipt 34206...");

    // 1. Try Direct Receipt/Invoice Access
    const specificEnds = [
        '/Receipt/34206',
        '/Invoice/34206',
        '/Sale/34206',
        '/Order/34206'
    ];

    for (const ep of specificEnds) {
        const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
        if (res.status === 200) {
            console.log(`✅ FOUND ${ep}:`, JSON.stringify(res.data).substring(0, 200));
        } else {
            console.log(`❌ ${ep}: ${res.status}`);
        }
    }

    // 2. Search Activity for Product Name
    console.log("\nSearching Activity for 'Retinol'...");
    // Try various search params that Hano might use
    const searchTerms = ['Potent', 'Retinol', '732013302924'];
    const paramsMap = [
        { search: 'Potent' },
        { text: 'Potent' },
        { query: 'Potent' },
        { serviceName: 'Potent' } // unlikely but maybe
    ];

    for (const p of paramsMap) {
        const res = await client.get('/Activity/search', {
            params: {
                departmentId: DEPARTMENT_ID,
                from: '2023-01-01',
                to: '2025-12-31',
                ...p
            }
        });
        if (res.data.length > 0) {
            console.log(`✅ Found match with param ${JSON.stringify(p)}:`, res.data.length, "items");
            console.log(JSON.stringify(res.data[0]).substring(0, 200));
        } else {
            process.stdout.write('.');
        }
    }
    console.log("\n");

    // 3. Check /Customer/{id}/Purchases if we can guess a customer ID?
    // Not safely.
}

sniperProbe();
