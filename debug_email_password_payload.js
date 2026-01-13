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
    const email = "adeel@tmklinikken.no";
    const phone = "98697419"; // User's phone just in case

    console.log("--- Deep Probe: /customer/sendpassword ---");

    // 1. Simple Email
    await testPayload("Email (lowercase)", { email: email });
    await testPayload("Email (Capitalized)", { Email: email });

    // 2. Field/Value Pattern (Common in Hano)
    await testPayload("Field/Value", { Field: 'email', Value: email });

    // 3. Username
    await testPayload("Username", { username: email });
    await testPayload("UserName", { UserName: email });

    // 4. Maybe it requires Mobile?
    await testPayload("Mobile", { mobile: phone });
    await testPayload("Mobile (Capitalized)", { Mobile: phone });

    // 5. CustomerID?
    await testPayload("CustomerId", { customerId: 642 });

    console.log("--- End Probe ---");
}

run();
