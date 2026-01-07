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

async function testVariants() {
    const email = "adeel@tmklinikken.no";
    console.log(`🕵️‍♂️ Testing Search Variants for: ${email}\n`);

    const variants = [
        { Field: 'email', Value: email },          // Lowercase field
        { Field: 'Email', Value: email },          // Capitalized field
        { Field: 'EMAIL', Value: email },          // Uppercase field
        { Field: 'email', Value: email, DepartmentId: 1 }, // With Dept ID
        { Field: 'All', Value: email }             // 'All' search?
    ];

    for (const v of variants) {
        try {
            console.log(`Testing payload: ${JSON.stringify(v)}`);
            const res = await client.post('/customer/search', {
                ...v,
                IgnorePassword: true
            });

            if (Array.isArray(res.data) && res.data.length > 0) {
                console.log(`   ✅ SUCCESS! Found: ${res.data[0].FirstName}`);
                return; // Stop on first success
            } else {
                console.log(`   ❌ Empty Result`);
            }
        } catch (e) {
            console.log(`   🚨 Error: ${e.response ? e.response.status : e.message}`);
        }
    }
}

testVariants();
