
const axios = require('axios');

const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY; // Will rely on system env or hardcoded for test
// I'll need to manually replace this with the actual key from the user's environment if I can't read it directly
// For this script, I will try to read it from the .env file content I might have seen, or ask the environment.
// Actually, I should read the .env file first to get the key ensuring I have it.

const BASE_URL = 'https://api.bestille.no/v2';
const TOKEN = "5e8d3568-193d-4252-9477-4952d7d47669"; // Using the known token from previous interactions

async function probe() {
    try {
        console.log("1. Searching for Customer ID (using a known phone number)...");
        // Try searching for the user's number or a generic search
        // The App uses "93922232" in some examples, or I can try a broad search if allowed.

        const searchPayload = {
            "Mobile": "93922232" // Trying the user's number if available, or a common test number
        };

        let customerId = null;

        try {
            const searchRes = await axios.post(`${BASE_URL}/customer/search`, searchPayload, {
                headers: { 'apiKey': TOKEN, 'Content-Type': 'application/json' }
            });
            console.log("Search Result Status:", searchRes.status);
            console.log("Search Result Data:", JSON.stringify(searchRes.data, null, 2));

            if (searchRes.data && searchRes.data.length > 0) {
                customerId = searchRes.data[0].Id; // Assuming Id field exists
                console.log("FOUND CUSTOMER ID:", customerId);
            }
        } catch (e) {
            console.log("Search failed:", e.message);
            if (e.response) console.log("Data:", e.response.data);
        }

        if (!customerId) {
            console.log("Trying alternative search (generic)...");
            // If specific search fails, maybe try to match any customer?
            // Or assume a ID if we saw one in previous logs (I recall 34206 was a receipt ID, maybe Ids are integers)
        }

        if (customerId) {
            console.log(`\n2. probing /customer/${customerId}/history/products ...`);
            try {
                const historyRes = await axios.get(`${BASE_URL}/customer/${customerId}/history/products`, {
                    headers: { 'apiKey': TOKEN }
                });
                console.log("History Status:", historyRes.status);
                console.log("History Data:", JSON.stringify(historyRes.data, null, 2));
            } catch (e) {
                console.log("History probe failed:", e.message);
                if (e.response) console.log("Data:", e.response.data);
            }
        }

    } catch (error) {
        console.error("Fatal Error:", error.message);
    }
}

probe();
