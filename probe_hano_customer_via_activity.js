
const axios = require('axios');

const BASE_URL = 'https://api.bestille.no/v2';
// Key found in HanoService.ts
const TOKEN = "87656ea5-40bc-45bc-87b0-b236678bdfab";

async function probe() {
    try {
        console.log("1. Searching for Customer ID...");
        console.log(`Endpoint: ${BASE_URL}/customer/search`);
        console.log(`Key: ${TOKEN.substring(0, 8)}...`);

        // Try POST /customer/search to find the user
        // Using common payload structure
        const searchPayload = {
            "Mobile": "93922232" // User's number
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        let custId = null;

        try {
            const searchRes = await axios.post(`${BASE_URL}/customer/search`, searchPayload, config);
            console.log("Search Result Status:", searchRes.status);
            console.log("Search Result Data:", JSON.stringify(searchRes.data, null, 2));

            if (searchRes.data && searchRes.data.length > 0) {
                custId = searchRes.data[0].Id;
                console.log(`\n✅ FOUND CUSTOMER ID: ${custId}`);
            } else {
                console.log("Search returned 200 OK but no customers found.");
            }
        } catch (e) {
            console.log("Search failed:", e.message);
            if (e.response) {
                console.log("Status:", e.response.status);
                // console.log("Data:", e.response.data);
            }
        }

        if (custId) {
            console.log(`\n2. Testing /customer/${custId}/history/products ...`);
            try {
                const productRes = await axios.get(`${BASE_URL}/customer/${custId}/history/products`, {
                    headers: { 'Authorization': `Bearer ${TOKEN}` }
                });
                console.log("Product History Status:", productRes.status);
                console.log("Product History Data:", JSON.stringify(productRes.data, null, 2));
            } catch (e) {
                console.log("Product History probe failed:", e.message);
                if (e.response) {
                    console.log("Status:", e.response.status);
                    console.log("Data:", e.response.data);
                }
            }
        } else {
            console.log("\n❌ Could not proceed to step 2 because no Customer ID was found.");
        }

    } catch (error) {
        console.error("Fatal Error:", error.message);
    }
}

probe();
