const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    }
});

async function inspectProduct() {
    try {
        console.log("Fetching /Product...");
        const res = await client.get('/Product', { params: { departmentId: DEPARTMENT_ID, limit: 5 } });
        console.log("Status:", res.status);
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log("First Product:", JSON.stringify(res.data[0], null, 2));
        } else {
            console.log("No products found or empty array.");
            console.log("Data:", res.data);
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}

inspectProduct();
