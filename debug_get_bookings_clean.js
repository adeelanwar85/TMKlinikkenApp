const axios = require('axios');

const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY; // 'dac20066-7ad3-4027-a066-0db9dfd2c161'
const TENANT_ID = process.env.EXPO_PUBLIC_HANO_TENANT_ID; // '17'
const MOBILE = '98697419';

console.log('Fetching Bookings for Mobile:', MOBILE);

async function getBookings() {
    try {
        // Use /Activity/search matches HanoService.ts implementation
        const url = `https://api.bestille.no/v2/Activity/search`;
        console.log(`GET ${url}`);

        const response = await axios.get(url, {
            params: {
                mobile: MOBILE,
                departmentId: TENANT_ID,
                from: '2023-01-01',
                to: '2026-12-31'
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // HanoService uses Bearer!
                'Accept': 'application/json'
            }
        });

        console.log('Status:', response.status);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(`Found ${response.data.length} bookings.`);
            console.log('--- Most Recent Bookings ---');
            // Sort by date descending
            const bookings = response.data.sort((a, b) => new Date(b.StartDate) - new Date(a.StartDate));

            bookings.slice(0, 3).forEach(b => {
                console.log(`ID: ${b.Id}`);
                console.log(`Start: ${b.StartDate}`);
                console.log(`Service: ${b.Service ? b.Service.Name : 'Unknown'}`);
                console.log(`Paid: ${b.Paid}`);
                console.log('---');
            });
        } else {
            console.log('No bookings found for this mobile.');
            console.log('Data:', JSON.stringify(response.data, null, 2));
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
