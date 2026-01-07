const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab'; // The working key
const CUSTOMER_ID = 642;

console.log('Fetching History via Correct Endpoint for Cust:', CUSTOMER_ID);

const client = axios.create({
    baseURL: 'https://api.bestille.no/v2',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
});

async function getHistory() {
    // Try Activities (Future/Active)
    try {
        console.log(`GET /customer/${CUSTOMER_ID}/activities`);
        const res = await client.get(`/customer/${CUSTOMER_ID}/activities`);
        console.log('   Status:', res.status);
        if (res.data && Array.isArray(res.data)) {
            console.log(`   Found ${res.data.length} activities.`);
            res.data.forEach(a => console.log(`   [Activity] ID: ${a.Id}, ${a.StartDate}`));
        } else {
            console.log('   Data:', JSON.stringify(res.data));
        }
    } catch (e) {
        console.log('   Error:', e.response ? e.response.status : e.message);
    }

    // Try History (Past)
    try {
        console.log(`GET /customer/${CUSTOMER_ID}/history`);
        const res = await client.get(`/customer/${CUSTOMER_ID}/history`);
        console.log('   Status:', res.status);
        if (res.data && Array.isArray(res.data)) {
            console.log(`   Found ${res.data.length} past activities.`);
            // Sort to find most recent
            const recent = res.data.sort((a, b) => new Date(b.StartDate) - new Date(a.StartDate))[0];

            if (recent) {
                console.log('   --- MOST RECENT ---');
                console.log(`   ID: ${recent.Id}`);
                console.log(`   Start: ${recent.StartDate}`);
                console.log(`   Service: ${recent.Service ? recent.Service.Name : 'Unknown'}`);
                console.log(`   Paid: ${recent.Paid}`);
            }
        } else {
            console.log('   Data:', JSON.stringify(res.data));
        }
    } catch (e) {
        console.log('   Error:', e.response ? e.response.status : e.message);
    }
}

getHistory();
