const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const MOBILE = "98697419"; // Adeel's number

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function verifyMobile() {
    console.log(`🕵️‍♂️ Testing GetCustomerByMobile for: ${MOBILE}\n`);

    try {
        const res = await client.get('/customer/GetCustomerByMobile', {
            params: { mobile: MOBILE }
        });

        console.log(`   ✅ STATUS: ${res.status}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log(`   ✅ FOUND: ID ${res.data[0].Id} - ${res.data[0].FirstName} ${res.data[0].LastName}`);
        } else {
            console.log(`   ❌ FOUND USER LIST is Empty`);
        }

    } catch (e) {
        console.log(`   ❌ Failed: ${e.response ? e.response.status : e.message}`);
        if (e.response && e.response.data) {
            console.log(`      Body:`, JSON.stringify(e.response.data));
        }
    }
}

verifyMobile();
