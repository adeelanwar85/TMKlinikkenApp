
const axios = require('axios');

const BASE_URL = 'https://api.bestille.no/v2';
const TOKEN = "87656ea5-40bc-45bc-87b0-b236678bdfab";
const MOBILE = "93922232";

async function probe() {
    console.log("Probing POST /customer/search with SCHEMA payload...");

    // Based on screenshots:
    // Model: { Field: string, Value: string, Password: string, IgnorePassword: true }
    // Implementation notes mention: "sms", "email", "ssn" as permitted fields.

    const payloads = [
        { "Field": "sms", "Value": "93922232", "IgnorePassword": true },
        { "Field": "sms", "Value": "+4793922232", "IgnorePassword": true },
        { "Field": "sms", "Value": "4793922232", "IgnorePassword": true },
        { "Field": "sms", "Value": "004793922232", "IgnorePassword": true },
        // Try email if phone fails
        { "Field": "email", "Value": "adeel@tmklinikken.no", "IgnorePassword": true },
        { "Field": "email", "Value": "post@tmklinikken.no", "IgnorePassword": true },
        { "Field": "email", "Value": "adeelanwar85@gmail.com", "IgnorePassword": true }
    ];

    for (const payload of payloads) {
        console.log(`\nTesting payload: ${JSON.stringify(payload)}`);
        try {
            const res = await axios.post(`${BASE_URL}/customer/search`, payload, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ SUCCESS! Status: ${res.status}`);
            console.log("Data:", JSON.stringify(res.data, null, 2));

            if (res.data) {
                // It might return a single object or array
                const customer = Array.isArray(res.data) ? res.data[0] : res.data;
                if (customer && customer.Id) {
                    console.log("!!!! FOUND ID:", customer.Id);
                    checkHistory(customer.Id);
                    return;
                }
            }
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
            if (e.response) {
                console.log(`   Status: ${e.response.status}`);
                console.log(`   Data: ${JSON.stringify(e.response.data)}`);
            }
        }
    }
}

async function checkHistory(custId) {
    console.log(`\nChecking History for ${custId}...`);
    try {
        const res = await axios.get(`${BASE_URL}/customer/${custId}/history/products`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        console.log("HISTORY FOUND:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log("History check failed:", e.message);
        if (e.response) console.log(e.response.data);
    }
}

probe();
