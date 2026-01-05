const axios = require('axios');

const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY || '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const CUSTOMER_ID = 642;

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

async function probeWriteAndPunch() {
    console.log(`\n🔍 Probing Hano Write & Punchcard for Customer ${CUSTOMER_ID}...\n`);

    // 1. Try to WRITE points (Guesses)
    // Be careful not to wreck data, but since it's 0, adding 10 is safe-ish.
    const writePayloads = [
        { method: 'post', url: `/customer/${CUSTOMER_ID}/bonuspoints/add`, data: { amount: 10, description: "Probe Test" } },
        { method: 'post', url: `/customer/${CUSTOMER_ID}/bonuspoints/transaction`, data: { points: 10, type: "adjustment" } },
        { method: 'post', url: `/customer/${CUSTOMER_ID}/bonuspoints`, data: { Value: 10 } },
        { method: 'put', url: `/customer/${CUSTOMER_ID}/bonuspoints/balance`, data: { Current: 100 } }
    ];

    /*
    for (const req of writePayloads) {
        try {
            console.log(`Testing: ${req.method.toUpperCase()} ${req.url}`);
            const response = await client.request(req);
            console.log(`✅ SUCCESS! Status: ${response.status}`);
            console.log(response.data);
        } catch (error) {
            console.log(`❌ FAILED: ${error.response ? error.response.status : error.message}`);
        }
    }
    */
    console.log("Skipping Write Probe for safety until sure. (Uncomment to run)");

    // 2. Probe Punchcard (Stamps)
    // Need a ServiceID. Let's use Id: 1 (Konsultasjon) or a random one found in history.
    // History had: "Potent Retinol Complex" (Product) - likely no punch card.
    // Let's try ServiceId=1 (Generic)
    try {
        const url = `/customer/${CUSTOMER_ID}/punchcard/details?serviceIds=1,2,3,4,5`;
        console.log(`Testing: GET ${url}`);
        const response = await client.get(url);
        console.log(`✅ SUCCESS [Punchcard]!`);
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log(`❌ FAILED [Punchcard]: ${error.response.status}`);
            console.log('   Data:', JSON.stringify(error.response.data));
        } else {
            console.log(`❌ ERROR:`, error.message);
        }
    }

    // 3. Probe Auth (OneTimePassword) - Validating user's find
    // POST /customer/SendOneTimePassword?customerId=...
    // This sends an SMS, so be careful. We WON'T run it to avoid spamming Adeel, 
    // but we can check if the endpoint exists (Options/Head? or just 404 vs 400).
    // Actually, sending one SMS is fine for verification if confirmed.
}

probeWriteAndPunch();
