const axios = require('axios');
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const DEPARTMENT_ID = 1;

const client = axios.create({
    baseURL: 'https://api.bestille.no/v2',
    headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Accept': 'application/json'
    }
});

async function run() {
    try {
        console.log('Creating Test Appointment...');

        // Need a valid service ID. Probe /Service first
        const s = await client.get('/Service');
        if (!s.data || s.data.length === 0) {
            console.error('No services found');
            return;
        }
        const serviceId = s.data[0].Id;
        console.log('Using Service ID:', serviceId);

        const payload = {
            DepartmentId: DEPARTMENT_ID,
            ServiceId: serviceId,
            StartDate: '2026-06-01T12:00:00', // Far future
            Customer: {
                FirstName: 'AI_TEST',
                LastName: 'PLEASE_IGNORE',
                Email: 'bot@test.com',
                Mobile: '90000000',
                DateOfBirth: '1990-01-01',
                Address1: 'Testveien 1',
                PostalCode: '0001',
                City: 'Oslo'
            }
        };

        const res = await client.post('/Activity/reservation/create', payload);
        console.log('Created ID:', res.data.Id);

        const wait = (ms) => new Promise(r => setTimeout(r, ms));
        await wait(2000);

        console.log('Fetching Activity Details...');
        const detail = await client.get('/Activity/' + res.data.Id);
        console.log('FULL DETAIL:', JSON.stringify(detail.data, null, 2));

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.error(JSON.stringify(e.response.data, null, 2));
    }
}

run();
