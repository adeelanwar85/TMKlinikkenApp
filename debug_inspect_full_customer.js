const axios = require('axios');

const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY;
const MOBILE = '98697419';

console.log('Verifying Customer Lookup by Mobile:', MOBILE);

async function checkMobile() {
    try {
        const url = `https://api.bestille.no/v2/customer/GetCustomerByMobile`;
        console.log(`GET ${url}`);

        const response = await axios.get(url, {
            params: {
                mobile: MOBILE
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        console.log('Status:', response.status);
        if (response.data && response.data.length > 0) {
            console.log('Customer Found!');
            // Print FULL JSON to see available fields
            console.log(JSON.stringify(response.data[0], null, 2));
        } else {
            console.log('Customer not found (Empty List).');
        }

    } catch (error) {
        console.error('Error looking up mobile:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

checkMobile();
