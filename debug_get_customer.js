const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';

async function getCustomer() {
    try {
        const client = axios.create({
            baseURL: BASE_URL,
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        // Searching for a likely existing user or generic one. 
        // Trying a common name or a explicit test user if we knew one.
        // Let's try searching by mobile if we have one, or just search by name "Test".
        // Hano endpoint: /customer/search?mobile=... or similar.

        // Try finding a customer via Activity Search (Backdoor)
        console.log("Searching for Activities to find a Customer...");
        try {
            const response = await client.get('/Activity/search', {
                params: {
                    from: '2025-01-01',
                    to: '2025-12-31',
                    departmentId: 1
                }
            });

            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log("Found Activity!");
                const activity = response.data[0];
                if (activity.Customer) {
                    console.log("Found Customer via Activity:", JSON.stringify(activity.Customer, null, 2));
                    console.log("Use CustomerId:", activity.Customer.Id || activity.Customer.CustomerId);
                }
            } else {
                console.log("No activities found.");
            }
        } catch (e) {
            console.log("Activity Search failed (" + e.response?.status + ").");
        }


    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.log(e.response.data);
    }
}

getCustomer();
