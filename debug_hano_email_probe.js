const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const EMAIL = "adeel@tmklinikken.no";

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function probe() {
    console.log(`🕵️‍♂️ Probing Email Lookup methods for: ${EMAIL}\n`);

    const tests = [
        { method: 'GET', url: `/customer/GetCustomerByEmail?email=${EMAIL}` },
        { method: 'GET', url: `/customer/search?email=${EMAIL}` },
        { method: 'GET', url: `/customer/search?field=email&value=${EMAIL}` },
        // POST variants
        { method: 'POST', url: '/customer/search', data: { Field: 'email', Value: EMAIL } }, // We know this failed
        { method: 'POST', url: '/customer/search', data: { field: 'email', value: EMAIL } }, // Lowercase keys?
        { method: 'POST', url: '/customer/search', data: { Field: 'adresser.epost', Value: EMAIL } }, // Norwegian internal key?
    ];

    for (const t of tests) {
        try {
            console.log(`testing ${t.method} ${t.url} ...`);
            const res = t.method === 'GET'
                ? await client.get(t.url)
                : await client.post(t.url, t.data);

            console.log(`   ✅ STATUS: ${res.status}`);
            console.log(`   DATA:`, JSON.stringify(res.data).substring(0, 100));
            if (Array.isArray(res.data) && res.data.length > 0) return; // Found it!
        } catch (e) {
            console.log(`   ❌ Failed: ${e.response ? e.response.status : e.message}`);
            if (e.response && e.response.data) {
                console.log(`      Error Body:`, JSON.stringify(e.response.data));
            }
        }
    }
}

probe();
