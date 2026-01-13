const axios = require('axios');

const API_KEY = "87656ea5-40bc-45bc-87b0-b236678bdfab";
const BASE_URL = "https://api.bestille.no/v2";

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});

async function testPayload(name, payload) {
    try {
        console.log(`[TEST] ${name}: ${JSON.stringify(payload)}`);
        const response = await client.post('/customer/sendpassword', payload);
        console.log(`[SUCCESS] Status: ${response.status}`);
        console.log("Response:", JSON.stringify(response.data, null, 2));
        return true;
    } catch (error) {
        if (error.response) {
            console.log(`[FAILED] Status: ${error.response.status}`);
            console.log("Error Body:", JSON.stringify(error.response.data));
        } else {
            console.log(`[ERROR] ${error.message}`);
        }
        return false;
    }
}

async function run() {
    console.log("--- Deep Probe 2: /customer/sendpassword ---");
    const id = 642;

    // 1. Root Array of IDs
    await testPayload("Array of IDs", [id]);
    await testPayload("Array of Integers", [id]);
    await testPayload("String ID Array", ["642"]);

    // 2. Wrapped IDs
    await testPayload("Ids", { Ids: [id] });
    await testPayload("ids", { ids: [id] });
    await testPayload("CustomerIds", { CustomerIds: [id] });
    await testPayload("customerIds", { customerIds: [id] });

    // 3. Search Style
    await testPayload("Search Style", { Field: "Id", Value: id.toString() });
    await testPayload("Search Style Int", { Field: "Id", Value: id });

    console.log("--- End Probe ---");
}

run();
