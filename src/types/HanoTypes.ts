export interface Department {
    Id: number;
    Name: string;
    Description?: string;
    Address1?: string;
    City?: string;
    Phone1?: string;
    Email?: string;
}

export interface Service {
    Id: number;
    Name: string; // e.g. "Konsultasjon"
    Description?: string;
    Duration: string; // "00:30:00"
    Price: number;
    CategoryId?: string | number; // Might need to infer category/grouping
    CategoryName?: string; // If available, or we construct it
}

export interface AvailableSlot {
    Start: string; // ISO DateTime
    End: string;
    EmployeeId: number;
    EmployeeName?: string;
}
