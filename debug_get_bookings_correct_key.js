const axios = require('axios');

// Using the key effectively used in HanoService.ts fallback / debug_verify_mobile_lookup.js
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const TENANT_ID = '17'; // From previous knowledge
const MOBILE = '98697419';

console.log('Fetching Bookings for Mobile (Correct Key):', MOBILE);

async function getBookings() {
    try {
        const url = `https://api.bestille.no/v2/Activity/search`;
        console.log(`GET ${url}`);

        const response = await axios.get(url, {
            params: {
                mobile: MOBILE,
                departmentId: TENANT_ID,
                from: '2025-01-01', // Look for recent/future
                to: '2026-12-31'
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        console.log('Status:', response.status);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(`Found ${response.data.length} bookings.`);
            const bookings = response.data.sort((a, b) => new Date(b.StartDate) - new Date(a.StartDate));

            bookings.forEach(b => {
                console.log(`ID: ${b.Id}`);
                console.log(`Start: ${b.StartDate}`);
                console.log(`Service: ${b.Service ? b.Service.Name : 'Unknown'}`);
                console.log(`Paid: ${b.Paid}`);
                console.log('---');
            });
        } else {
            console.log('No bookings found for this mobile.');
        }

    } catch (error) {
        console.error('Error fetching bookings:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

getBookings();
