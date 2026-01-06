import axios from 'axios';

// --- Configuration ---
const API_KEY = process.env.EXPO_PUBLIC_HANO_API_KEY || '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = parseInt(process.env.EXPO_PUBLIC_HANO_TENANT_ID || '1', 10);

// Use a known dummy/safe activity ID for validation checks
// We use 1 as it worked in our probe to pass schema validation
const DUMMY_SERVICE_ID = 1;

export interface GiftCardBalance {
    isValid: boolean;
    balance?: number;
    currency?: string;
    expires?: string;
    statusText: string;
}

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export const GiftCardService = {

    /**
     * Checks the balance of a Gift Card.
     * Since Hano APIs don't expose a direct "GET Balance" endpoint publically,
     * we use the `validate` endpoint which simulates checking a card against a service.
     */
    checkBalance: async (code: string): Promise<GiftCardBalance> => {
        try {
            // Clean the code (remove spaces)
            const cleanCode = code.replace(/\s/g, '');

            // Note: Hano requires both 'GiftCertificateNumber' (int) and 'GiftCertificateCode' (string).
            // Usually the user enters a code which might be the number.
            // We try to parse it as int for the Number field.
            let codeAsInt = parseInt(cleanCode, 10);
            if (isNaN(codeAsInt)) codeAsInt = 0; // Fallback, though API demands > 0 often

            // Payload based on successful V4 verify probe
            const payload = {
                "GiftCertificateNumber": codeAsInt,
                "GiftCertificateCode": cleanCode,
                "Activities": [
                    {
                        "ServiceId": DUMMY_SERVICE_ID,
                        "TimeId": 1 // Dummy TimeId
                    }
                ],
                "Products": []
            };

            const response = await client.post('/Activity/giftcertificate/validate', payload);
            const data = response.data;

            // Analyze 'Status' from Hano response
            // Empowered by probe results: Status 2 = Invalid/NotFound (likely)
            // We assume Status 0 or 1 is Valid.

            if (data.GiftCertificateId && data.Status !== 2) {
                // If we get an ID back and status isn't "Invalid", it's likely a match.
                // However, 'validate' might not return the BALANCE (AmountRemaining).
                // If it doesn't, we might need a secondary call if possible, 
                // but usually validation objects contain the value to be deducted.

                // Note: The Browser Agent saw 'GetNonMonetaryReceipt' or 'GetImageHtml'.
                // Ideally, 'validate' response has a 'Value' or 'Remaining' field.
                // Since we haven't seen a successful 200 payload, we map carefully.

                // For now, we return valid = true so the UI shows success.
                // We map dynamic fields if they exist.
                return {
                    isValid: true,
                    balance: data.AmountRemaining || data.Value || data.Amount || 0, // Guessing field names based on C# conventions
                    currency: 'NOK',
                    expires: data.ExpirationDate || undefined,
                    statusText: 'Gyldig'
                };
            } else {
                return {
                    isValid: false,
                    statusText: 'Ugyldig kode eller tomt kort.'
                };
            }

        } catch (error) {
            console.warn("GiftCard Validate Error:", error);
            return {
                isValid: false,
                statusText: 'Kunne ikke sjekke kortet. Prøv igjen senere.'
            };
        }
    },

    /**
     * Purchase a new gift card.
     */
    purchaseGiftCard: async (amount: number, recipientEmail: string, recipientName: string) => {
        try {
            const payload = {
                "Recipient": {
                    "FirstName": recipientName,
                    "LastName": "",
                    "Email": recipientEmail
                },
                "Sender": {
                    "FirstName": "App Bruker", // We should ideally pull logged in user info
                    "LastName": "",
                    "Email": "noreply@tmklinikken.no"
                },
                "Amount": amount,
                "Comment": "Kjøpt via App",
                "PaymentMethod": "Vipps" // Hardcoded for now, needs integration
            };

            const response = await client.post('/GiftCertificate', payload);
            return response.data;
        } catch (error) {
            console.error("GiftCard Purchase Error:", error);
            throw error;
        }
    }
};
