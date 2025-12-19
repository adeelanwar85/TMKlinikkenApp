import axios from 'axios';

const API_KEY = '87656ea5-40bc-45bc-87b0-b236678bdfab';
const BASE_URL = 'https://api.bestille.no/v2';
export const DEPARTMENT_ID = 1;

const hanoClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

// Interceptor to log requests (helpful for debugging)
hanoClient.interceptors.request.use(config => {
    // console.log('Starting Request', config.method, config.url);
    return config;
});

import { Service, Department, AvailableSlot } from '../types/HanoTypes';

// Toggle for development/testing
const USE_MOCK = true;

// Mock Data for development (Avoids CORS issues in browser)
export const mockTreatments: Service[] = [
    { Id: 1, Name: 'Konsultasjon - Hudlege', Duration: '00:30:00', Price: 500, CategoryId: 'cat1', CategoryName: 'Konsultasjon' },
    { Id: 2, Name: 'Rynkebehandling 1 område', Duration: '00:30:00', Price: 2500, CategoryId: 'cat2', CategoryName: 'Injeksjoner' },
    { Id: 3, Name: 'Filler Lepper (0.5ml)', Duration: '00:45:00', Price: 3000, CategoryId: 'cat2', CategoryName: 'Injeksjoner' },
    { Id: 4, Name: 'Dermapen Full Ansikt', Duration: '01:00:00', Price: 2200, CategoryId: 'cat3', CategoryName: 'Hudforbedring' },
    { Id: 5, Name: 'Kjemisk Peeling', Duration: '00:30:00', Price: 1500, CategoryId: 'cat3', CategoryName: 'Hudforbedring' },
    { Id: 6, Name: 'Laser Hårfjerning (Armhuler)', Duration: '00:20:00', Price: 1200, CategoryId: 'cat4', CategoryName: 'Laser' },
    { Id: 7, Name: 'Fettfjerning (Mage)', Duration: '01:00:00', Price: 5000, CategoryId: 'cat5', CategoryName: 'Kropp' },
];

const mockSlots: AvailableSlot[] = [
    { Start: "2025-12-20T09:00:00", End: "2025-12-20T09:30:00", EmployeeId: 1, EmployeeName: "Dr. Hansen" },
    { Start: "2025-12-20T10:00:00", End: "2025-12-20T10:30:00", EmployeeId: 1, EmployeeName: "Dr. Hansen" },
    { Start: "2025-12-20T14:00:00", End: "2025-12-20T14:30:00", EmployeeId: 2, EmployeeName: "Sykepleier Kari" }
];

export const getDepartments = async (): Promise<Department[]> => {
    try {
        const response = await hanoClient.get('/Department');
        // The API returns a single object if queried by ID, or array if list?
        // Based on curl, /Department seems to return objects? 
        // Actually, let's assume it returns an array or we wrap it.
        // The curl output for /Department with auth returned a single object.
        // But /Department without ID might return list? 
        // Let's keep it generic for now.
        return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
        if (USE_MOCK) return [{ Id: 1, Name: "TM Klinikken (Mock)", Description: "Mock Department" }];
        console.error('Error fetching departments:', error);
        throw error;
    }
};

export const getTreatments = async (): Promise<Service[]> => {
    try {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockTreatments;
        }
        // GET /Service returns all services for the clinic
        const response = await hanoClient.get('/Service');
        return response.data;
    } catch (error) {
        console.error('Error fetching treatments:', error);
        if (USE_MOCK) return mockTreatments; // Fallback
        throw error;
    }
}

export const getAvailableSlots = async (treatmentId: number, date: string): Promise<AvailableSlot[]> => {
    try {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Return slots for any date for testing simplicity, but update date
            return mockSlots.map(s => ({
                ...s,
                Start: s.Start.replace('2025-12-20', date),
                End: s.End.replace('2025-12-20', date)
            }));
        }

        // GET /time/search?from=2025-12-20T00:00:00&to=2025-12-20T23:59:59&departmentId=1&serviceId=...
        const from = `${date}T00:00:00`;
        const to = `${date}T23:59:59`;

        const response = await hanoClient.get('/time/search', {
            params: {
                from,
                to,
                departmentId: DEPARTMENT_ID,
                serviceId: treatmentId
                // Optional: employeeId if we want to filter by employee later
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching available slots:', error);
        // Return empty array instead of throwing to avoid crashing UI on bad dates
        return [];
    }
}

export interface CreateBookingPayload {
    departmentId: number;
    serviceId: number;
    start: string; // ISO
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        comment?: string;
    };
}

export const createAppointment = async (payload: CreateBookingPayload) => {
    try {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { Success: true, Message: "Mock Booking Confirmed" };
        }

        // Warning: This is a best-guess payload based on Hano V2 patterns.
        // We might need to adjust field names (e.g. PascalCase vs camelCase).
        // Hano usually expects PascalCase for DTOs.
        const apiPayload = {
            DepartmentId: payload.departmentId,
            ServiceId: payload.serviceId,
            StartDate: payload.start, // or 'Start'
            Customer: {
                FirstName: payload.customer.firstName,
                LastName: payload.customer.lastName,
                Email: payload.customer.email,
                Mobile: payload.customer.phone, // or 'Phone1'
            },
            Comment: payload.customer.comment
        };

        const response = await hanoClient.post('/Activity/reservation/create', apiPayload);
        return response.data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

export default hanoClient;
