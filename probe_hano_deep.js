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
    validateStatus: () => true // Don't throw on error
});

async function deepProbe() {
    console.log("🚀 Starting Deep Probe of Hano V2 API...");

    const endpoints = [
        // Accounting / Sales
        '/Invoice',
        '/Invoice/search',
        '/Journal',
        '/Journal/search',
        '/Accounting/journal',
        '/Ledger',

        // Customer Specific
        '/Customer/search',

        // Reporting
        '/Report/sales',
        '/Report/turnover',
        '/Report/zreport',

        // Products / Stocks
        '/Stock',
        '/Stock/transaction',

        // General Search (Broad)
        '/Search',

        // Activity Extended
        '/Activity/search?productId=2', // Try to filter activity by product?

        // Checkout / Payment
        '/Checkout',
        '/Payment',
        '/Payment/search',
        '/Order',
        '/Order/search'
    ];

    for (const ep of endpoints) {
        // Clean param handling (basic)
        const url = ep.split('?')[0];
        const params = { departmentId: DEPARTMENT_ID };

        process.stdout.write(`Testing ${ep} ... `);
        const start = Date.now();
        const res = await client.get(ep, { params });
        const time = Date.now() - start;

        if (res.status >= 200 && res.status < 300) {
            console.log(`✅ ${res.status} (${time}ms)`);
            if (Array.isArray(res.data) && res.data.length > 0) {
                console.log("   Found Items:", res.data.length);
                console.log("   Sample:", JSON.stringify(res.data[0]).substring(0, 150) + "...");
            } else if (typeof res.data === 'object') {
                console.log("   Obj Keys:", Object.keys(res.data));
            }
        } else if (res.status === 404) {
            console.log(`❌ 404 (Not Found)`);
        } else {
            console.log(`⚠️  ${res.status} - ${res.statusText}`);
        }
    }
}

deepProbe();
