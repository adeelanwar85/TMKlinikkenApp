const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const TENANT_ID = '17';
const MOBILE = '98697419';

console.log('Probing Activity API...');

const client = axios.create({
    baseURL: 'https://api.bestille.no/v2',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
});

async function probe() {
    // Probe 1: GET /Activity (with params)
    try {
        console.log('1. GET /Activity?mobile=...');
        const res = await client.get('/Activity', { params: { mobile: MOBILE, departmentId: TENANT_ID } });
        console.log('   Status:', res.status);
    } catch (e) {
        console.log('   Error:', e.response ? e.response.status : e.message);
    }

    // Probe 2: POST /Activity/Search
    try {
        console.log('2. POST /Activity/Search');
        const res = await client.post('/Activity/Search', { mobile: MOBILE, departmentId: TENANT_ID });
        console.log('   Status:', res.status);
    } catch (e) {
        console.log('   Error:', e.response ? e.response.status : e.message);
    }

    // Probe 3: GET /booking/GetBookings (Original 403, but try with Correct Key)
    try {
        console.log('3. GET /booking/GetBookings (Correct Key)');
        const res = await client.get('/booking/GetBookings', { params: { customerId: 642 } });
        console.log('   Status:', res.status); // Expect 403 or 200
    } catch (e) {
        console.log('   Error:', e.response ? e.response.status : e.message);
    }
}

probe();
