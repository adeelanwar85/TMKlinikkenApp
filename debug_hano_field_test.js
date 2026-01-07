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

async function testFields() {
    console.log("🕵️‍♂️ Field Comparison Test (User 642: Adeel)\n");

    // 1. SMS (Mobile)
    await search("sms", "98697419");
    await search("mobile", "98697419");

    // 2. Email
    await search("email", "adeel@tmklinikken.no");
    await search("Email", "adeel@tmklinikken.no");
}

async function search(field, val) {
    try {
        console.log(`Testing Field: '${field}' | Value: '${val}'`);
        const res = await client.post('/customer/search', {
            Field: field,
            Value: val,
            IgnorePassword: true
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log(`   ✅ SUCCESS! Found User ID: ${res.data[0].Id}`);
        } else {
            console.log(`   ❌ Empty Result`);
        }
    } catch (e) {
        console.log(`   🚨 Error: ${e.response ? e.response.status : e.message}`);
        if (e.response && e.response.data) {
            console.log(`      Body:`, JSON.stringify(e.response.data));
        }
    }
    console.log("");
}

testFields();
