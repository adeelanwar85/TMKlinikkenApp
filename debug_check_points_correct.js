const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab'; // Working Key
const CUSTOMER_ID = 642;

console.log('Fetching Bonus Points (Correct Key) for:', CUSTOMER_ID);

async function getPoints() {
    try {
        const url = `https://api.bestille.no/v2/customer/${CUSTOMER_ID}/bonuspoints/balance`;
        console.log(`GET ${url}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        console.log('Status:', response.status);
        console.log('Points:', JSON.stringify(response.data, null, 2));

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
