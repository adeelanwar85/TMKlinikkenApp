const axios = require('axios');

const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY;
const TENANT_ID = process.env.EXPO_PUBLIC_HANO_TENANT_ID;
const CUSTOMER_ID = 642;

console.log('Fetching Bonus Points for Customer:', CUSTOMER_ID);

async function getPoints() {
    try {
        // /customer/{id}/bonuspoints/balance
        const url = `https://api.bestille.no/v2/customer/${CUSTOMER_ID}/bonuspoints/balance`;
        console.log(`GET ${url}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Error fetching points:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

getPoints();
