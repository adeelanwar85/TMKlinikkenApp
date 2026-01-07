const axios = require('axios');

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';

async function probe() {
    try {
        console.log("Probing POST /GiftCertificate...");

        // Hano usually expects auth in header
        const client = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Sending structured body to avoid NullReferenceException
        const payload = {
            "Recipient": {
                "FirstName": "Test",
                "LastName": "Mottaker",
                "Email": "test@example.com",
                "Mobile": "90000000"
            },
            "Sender": {
                "FirstName": "Test",
                "LastName": "Sender",
                "Email": "sender@example.com",
                "Mobile": "90000001",
                "CustomerId": 1
            },
            "Amount": 500,
            "Comment": "Test purchase from API probe",
            // often required in Hano
            "DepartmentId": 1
        };

        const response = await client.post('/GiftCertificate', payload, {
            validateStatus: () => true
        });

        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data, null, 2));

    } catch (e) {
        console.error("Critical Error:", e.message);
        if (e.response) {
            console.log("Response Status:", e.response.status);
            console.log("Response Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

probe();
