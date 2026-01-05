const axios = require('axios');

const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY || '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const CUSTOMER_ID = 642; // Known valid ID for Adeel

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

async function probeBonus() {
    console.log(`\n🔍 Probing Hano Bonus Points for Customer ${CUSTOMER_ID}...\n`);

    const endpoints = [
        `/customer/${CUSTOMER_ID}/bonuspoints/balance`,
        `/customer/${CUSTOMER_ID}/bonuspoints/history`, // Guessing
        `/customer/${CUSTOMER_ID}/bonuspoints/transactions`, // Guessing
        `/customer/${CUSTOMER_ID}/punchcard/details` // Seen in user screenshot list effectively
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing: GET ${endpoint}`);
            const response = await client.get(endpoint);
            console.log(`✅ SUCCESS [${endpoint}]:`, response.status);
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response) {
                console.log(`❌ FAILED [${endpoint}]: ${error.response.status} - ${error.response.statusText}`);
                if (error.response.status !== 404) {
                    console.log('   Data:', JSON.stringify(error.response.data));
                }
            } else {
                console.log(`❌ ERROR [${endpoint}]:`, error.message);
            }
        }
        console.log('-'.repeat(40));
    }
}

probeBonus();
