const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const EMAIL = "adeel@tmklinikken.no";
const MOBILE = "98697419"; // Known working anchor

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function probe() {
    console.log(`🕵️‍♂️ DEEP PROBE: Email Lookup for ${EMAIL}...\n`);

    // 1. Control Test: Mobile (Should work)
    try {
        console.log("1. Control Check (Mobile)...");
        const ctrl = await client.get('/customer/GetCustomerByMobile', { params: { mobile: MOBILE } });
        if (ctrl.data && ctrl.data.length > 0) {
            console.log("   ✅ Control Passed (Found ID:", ctrl.data[0].Id, ")");
        } else {
            console.log("   ⚠️ Control Failed (Mobile search weird?)");
        }
    } catch (e) {
        console.log("   ❌ Control Error:", e.message);
    }

    // 2. Search Payload Variants
    const payloads = [
        // Standard Object
        { Field: 'email', Value: EMAIL },
        { Field: 'Email', Value: EMAIL },

        // With IgnorePassword
        { Field: 'email', Value: EMAIL, IgnorePassword: true },

        // Array Wrapper?
        [{ Field: 'email', Value: EMAIL }],

        // Enum?
        { Field: 0, Value: EMAIL }, // 0 might be Name, 1 Email?
        { Field: 1, Value: EMAIL },

        // Legacy/Alternate Props
        { Property: 'email', Value: EMAIL },
        { Key: 'email', Value: EMAIL },
    ];

    console.log("\n2. Testing POST /customer/search variants...");
    for (const p of payloads) {
        try {
            const res = await client.post('/customer/search', p);
            console.log(`   [${JSON.stringify(p).substring(0, 50)}...] -> ${res.status}`);
            if (Array.isArray(res.data) && res.data.length > 0) {
                console.log("   🎉 FOUND:", res.data[0]);
                break;
            } else if (res.data && res.data.Id) {
                console.log("   🎉 FOUND (Obj):", res.data.Id);
            } else {
                console.log("   (Empty/No Match)");
            }
        } catch (e) {
            console.log(`   [${JSON.stringify(p).substring(0, 50)}...] -> Failed: ${e.response ? e.response.status : e.message}`);
            if (e.response && e.response.data) {
                console.log("      ErrBody:", JSON.stringify(e.response.data));
            }
        }
    }
}

probe();
