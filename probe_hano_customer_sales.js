const axios = require('axios');
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({ baseURL: BASE_URL, headers: { 'Authorization': `Bearer ${API_KEY}` }, validateStatus: () => true });

async function run() {
    console.log("Searching for activity in May 2024 to find a customer...");
    // Using the date from the screenshot: 16.05.2024
    const act = await client.get('/Activity/search', { params: { departmentId: DEPARTMENT_ID, from: '2024-05-15T00:00:00', to: '2024-05-17T23:59:59' } });

    let customerId = null;
    if (act.data && act.data.length > 0) {
        customerId = act.data[0].Customer?.Id;
        console.log(`Found Customer ID: ${customerId} from Activity ID: ${act.data[0].Id}`);
    } else {
        console.log("No activity found in May 2024, trying general search...");
        const gen = await client.get('/Activity/search', { params: { departmentId: DEPARTMENT_ID, from: '2024-01-01', to: '2024-06-01', limit: 1 } });
        if (gen.data && gen.data.length > 0) customerId = gen.data[0].Customer?.Id;
    }

    if (!customerId) {
        console.log("Could not find any valid Customer ID to probe.");
        return;
    }

    console.log(`Using Customer ID: ${customerId} for probing...`);

    // 2. Probe Customer Endpoints
    const endpoints = [
        `/Customer/${customerId}/ProductPurchases`, // Exact name from UI?
        `/Customer/${customerId}/productpurchases`,
        `/Customer/${customerId}/ProductPurchase`,
        `/Customer/${customerId}/Purchases`,
        `/Customer/${customerId}/Products`,
        `/Customer/${customerId}/Orders`,
        `/Customer/${customerId}/Receipts`,
        `/Customer/${customerId}/Sales`,
        '/ProductSale',
        '/ProductSale/search',
        '/ProductTransaction',
        '/Sale/Product',
        '/Report/ProductSales',
    ];

    for (const ep of endpoints) {
        process.stdout.write(`Checking ${ep} ... `);
        const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
        console.log(`${res.status}`);
        if (res.status >= 200 && res.status < 300) {
            console.log("✅ FOUND DATA:", JSON.stringify(res.data).substring(0, 300));
        }
    }
}
run();
