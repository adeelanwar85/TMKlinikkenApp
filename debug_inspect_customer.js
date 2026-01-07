const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function inspect() {
    console.log("🕵️‍♂️ Inspecting Customer 642...");

    // 1. Try GET /customer/642 (Guessing endpoint)
    try {
        const res = await client.get('/customer/642');
        console.log("   ✅ GET /customer/642 Success!");
        console.log("   DATA:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log("   ❌ GET /customer/642 Failed:", e.message);
    }

    // 2. Try Search by Name (Adeel)
    try {
        console.log("\n🕵️‍♂️ Testing Search by Name: Adeel");
        const res = await client.post('/customer/search', {
            Field: 'Firstname',
            Value: 'Adeel',
            IgnorePassword: true
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log("   ✅ SUCCESS! Found matches:", res.data.length);
            console.log("   First Match Email:", res.data[0].Email);
            console.log("   First Match Mobile:", res.data[0].Mobile);
        } else {
            console.log("   ❌ Search by Name Failed (Empty)");
        }
    } catch (e) {
        console.log("   🚨 Search Error:", e.message);
    }
}

inspect();
