const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';

async function lookupEmail(email) {
    console.log(`Searching for email: ${email}`);
    try {
        const response = await axios.post(`${BASE_URL}/customer/search`, {
            Field: 'email',
            Value: email,
            IgnorePassword: true
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        console.log("Status:", response.status);
        if (response.data) {
            console.log("Data Found:", JSON.stringify(response.data, null, 2));
        } else {
            console.log("No data returned.");
        }

    } catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.statusText);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

lookupEmail('adeel@tmklinikken.no');
