const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPT_ID = 1;

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function testConnection() {
    try {
        console.log("1. Testing /Department...");
        const res = await client.get('/Department');
        console.log("   ✅ Success! Found:", Array.isArray(res.data) ? res.data.length + ' depts' : res.data.Name);
    } catch (e) {
        console.error("   ❌ Failed /Department:", e.response ? e.response.status : e.message);
    }

    try {
        console.log("\n2. Testing /customer/642/bonuspoints/balance...");
        const res = await client.get('/customer/642/bonuspoints/balance');
        console.log("   ✅ Success! Balance:", res.data);
    } catch (e) {
        console.error("   ❌ Failed BonusPoints:", e.response ? e.response.status : e.message);
        if (e.response && e.response.status === 404) {
            console.log("      (404 might mean customer 642 doesn't exist or has no points account)");
        }
    }

    try {
        console.log("\n3. Testing /Service (Treatments)...");
        const res = await client.get('/Service');
        console.log("   ✅ Success! Found inputs:", res.data.length);
    } catch (e) {
        console.error("   ❌ Failed Services:", e.message);
    }
}

testConnection();
