const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const EMAIL = "adeel@tmklinikken.no";

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

async function simulateLogin() {
    console.log(`🔐 Simulating Login for: ${EMAIL}`);

    // 1. Find Customer ID (Mimics HanoService.findCustomerId)
    let foundId = null;
    try {
        console.log("   Step 1: Searching for ID...");
        const res = await client.post('/customer/search', {
            Field: 'email',
            Value: EMAIL,
            IgnorePassword: true
        });

        if (Array.isArray(res.data) && res.data.length > 0) foundId = res.data[0].Id;
        else if (res.data && res.data.Id) foundId = res.data.Id;

        console.log(`   ✅ ID Found: ${foundId}`);
    } catch (e) {
        console.log("   ❌ Search Failed:", e.message);
        return;
    }

    if (!foundId) return;

    // 2. Fetch Customer Profile (Mimics HanoService.getCustomer)
    try {
        console.log("   Step 2: Fetching Full Profile...");
        const res = await client.get(`/customer/${foundId}`);
        const data = res.data;

        // Normalization Logic (Copied from HanoService.ts)
        const profile = {
            Id: data.Id,
            FirstName: data.Fields?.name || data.Name,
            LastName: data.Fields?.surname || '',
            Email: data.Fields?.email,
            Mobile: data.Fields?.phone2 || data.Fields?.phone1,
            Address1: data.Fields?.address1,
            PostalCode: data.Fields?.zip,
            City: data.Fields?.city,
            DateOfBirth: data.Fields?.birthdate
        };

        console.log("   ✅ Profile Loaded:");
        console.log(JSON.stringify(profile, null, 2));

        // Check if vital fields are present
        if (profile.Mobile) console.log("   📲 Mobile Number present (Ready for OTP).");
        else console.log("   ⚠️ No Mobile Number found (OTP might fail).");

    } catch (e) {
        console.log("   ❌ Profile Fetch Failed:", e.message);
    }
}

simulateLogin();
