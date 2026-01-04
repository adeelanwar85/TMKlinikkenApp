const axios = require('axios');
const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
const DEPARTMENT_ID = 1;

const client = axios.create({ baseURL: BASE_URL, headers: { 'Authorization': `Bearer ${API_KEY}` }, validateStatus: () => true });

async function run() {
    console.log("Swagger Probe: Checking /Purchase and variants...");

    const endpoints = [
        '/Purchase',
        '/Purchase/search',
        '/Purchase/history',
        '/Customer/Purchase',
        '/Cart',
        '/Basket'
    ];

    for (const ep of endpoints) {
        const res = await client.get(ep, { params: { departmentId: DEPARTMENT_ID } });
        console.log(`GET ${ep}: ${res.status}`);
        if (res.status < 400) console.log(JSON.stringify(res.data).substring(0, 200));
    }

    console.log("\nProbing GET /product/search with params...");
    const pSearch = await client.get('/product/search', { params: { departmentId: DEPARTMENT_ID, q: 'test' } });
    console.log(`/product/search?q=test: ${pSearch.status}`);

    const pSearch2 = await client.get('/product/search', { params: { departmentId: DEPARTMENT_ID, text: 'test' } });
    console.log(`/product/search?text=test: ${pSearch2.status}`);

    const pSearch3 = await client.get('/product/search', { params: { departmentId: DEPARTMENT_ID, name: 'test' } });
    console.log(`/product/search?name=test: ${pSearch3.status}`);
}
run();
