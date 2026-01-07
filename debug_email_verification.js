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

async function verifyEmailSearch() {
    console.log("🕵️‍♂️ Diagnostic: Testing Email Search Reliability...\n");

    // Test 1: Known Working Email (Adeel)
    await search("adeel@tmklinikken.no", "KNOWN_VALID");

    // Test 2: The Problematic Email
    await search("ruthunni@jkas.no", "REPORTED_ISSUE");
}

async function search(email, label) {
    try {
        console.log(`[${label}] Searching for: '${email}'...`);
        const res = await client.post('/customer/search', {
            Field: 'email',
            Value: email,
            IgnorePassword: true
        });

        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
            console.log(`   ✅ SUCCESS! Found User ID: ${data[0].Id} (${data[0].FirstName} ${data[0].LastName})`);
        } else {
            console.log(`   ❌ NOT FOUND. API returned empty list.`);
        }
    } catch (e) {
        console.log(`   🚨 ERROR: ${e.response ? e.response.status : e.message}`);
    }
    console.log("-".repeat(40));
}

verifyEmailSearch();
