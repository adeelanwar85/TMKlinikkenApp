
const axios = require('axios');

const BASE_URL = 'https://api.bestille.no/v2';
const TOKEN = "87656ea5-40bc-45bc-87b0-b236678bdfab";
const MOBILE = "93922232";

async function fuzz() {
    console.log("Fuzzing POST /customer/search ...");

    const payloads = [
        { "Mobile": MOBILE },
        { "Phone": MOBILE },
        { "PhoneNumber": MOBILE },
        { "Search": MOBILE },
        { "Query": MOBILE },
        { "Term": MOBILE },
        { "text": MOBILE },
        { "mobile": MOBILE }, // lowercase
        { "FirstName": "Adeel" }, // Try name
        { "Email": "adeel@mac.lan" } // Guessing
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

            if (res.data && res.data.length > 0) {
                const id = res.data[0].Id;
                console.log("!!!! FOUND ID:", id);
                // Check history immediately
                checkHistory(id);
                return; // Stop on first success
            }
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
            if (e.response && e.response.status !== 400) {
                console.log(`   (Status: ${e.response.status})`); // Highlight 403, 404, 500
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
        console.log("HISTORY FOUND:", res.data);
    } catch (e) {
        console.log("History check failed:", e.message);
    }
}

fuzz();
