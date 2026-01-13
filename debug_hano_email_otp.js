const axios = require('axios');

// Using the known working API Key
const API_KEY = "87656ea5-40bc-45bc-87b0-b236678bdfab";
const BASE_URL = "https://api.bestille.no/v2";

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});

async function probeEndpoint(method, url, data = null) {
    try {
        console.log(`[PROBE] ${method.toUpperCase()} ${url} ...`);
        const response = await client.request({ method, url, data });
        console.log(`[SUCCESS] ${url} -> Status: ${response.status}`);
        console.log("Response:", JSON.stringify(response.data, null, 2));
        return true;
    } catch (error) {
        if (error.response) {
            console.log(`[FAILED] ${url} -> Status: ${error.response.status} - ${error.response.statusText}`);
            // console.log("Error Body:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`[ERROR] ${url} -> ${error.message}`);
        }
        return false;
    }
}

async function run() {
    const customerId = 642; // Known ID for Adeel
    const email = "adeel@tmklinikken.no";

    console.log("--- Starting Email OTP / Password Probe ---");

    // 1. Try "Forgot Password" style endpoints (Most likely what user means by "email with password")
    await probeEndpoint('post', `/customer/password/forgot`, { email: email });
    await probeEndpoint('post', `/customer/password/reset`, { email: email });
    await probeEndpoint('post', `/customer/${customerId}/password/reset`);

    // 2. Try "Send Password" endpoints
    await probeEndpoint('get', `/customer/${customerId}/password/send`); // Some APIs have GET for triggering send
    await probeEndpoint('post', `/customer/${customerId}/password/send`);
    await probeEndpoint('post', `/customer/sendpassword`, { email: email });

    // 3. Try Email OTP specific
    await probeEndpoint('post', `/email/sendOtp`, { email: email });
    await probeEndpoint('post', `/customer/${customerId}/otp/email`);

    // 4. Check if standard OTP has a "channel" param
    await probeEndpoint('post', `/customer/${customerId}/otp/send`, { channel: 'email' });
    await probeEndpoint('post', `/customer/${customerId}/otp/send`, { type: 'email' });

    console.log("--- End Probe ---");
}

run();
