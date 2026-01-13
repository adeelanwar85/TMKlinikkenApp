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

async function testPayload(method, url, payload) {
    try {
        console.log(`[TEST] ${method} ${url} with ${JSON.stringify(payload)}`);
        const response = await client.request({ method, url, data: payload });
        console.log(`[SUCCESS] Status: ${response.status}`);
        return true;
    } catch (error) {
        if (error.response) {
            console.log(`[FAILED] Status: ${error.response.status} Msg: ${JSON.stringify(error.response.data)}`);
        } else {
            console.log(`[ERROR] ${error.message}`);
        }
        return false;
    }
}

async function run() {
    const id = 642;
    console.log("--- Final Probe ---");

    // 1. /customer/sendpassword strict tests
    await testPayload('post', '/customer/sendpassword', { Id: id });
    await testPayload('post', '/customer/sendpassword', { id: id });
    await testPayload('post', '/customer/sendpassword', { CustomerId: id });

    // 2. /user/password/forgot (Common alternative)
    await testPayload('post', '/user/password/forgot', { email: "adeel@tmklinikken.no" });
    await testPayload('post', '/password/forgot', { email: "adeel@tmklinikken.no" });

    // 3. /customer/{id}/email/sendpassword
    await testPayload('post', `/customer/${id}/email/sendpassword`, {});

    // 4. Send Message (Maybe password is sent via generic msg?)
    // POST /customer/sendmessage ?
    await testPayload('post', '/customer/sendmessage', { CustomerIds: [id], Message: "Test", SendAsEmail: true });

    console.log("--- End ---");
}

run();
