import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, AvailableSlot } from '../types/HanoTypes';

interface BookingState {
    selectedTreatment: Service | null;
    selectedDate: string | null; // ISO Date YYYY-MM-DD
    selectedTimeSlot: AvailableSlot | null;
    patientDetails: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        comment: string;
    };
}

interface BookingContextType extends BookingState {
    setTreatment: (treatment: Service | null) => void;
    setDate: (date: string | null) => void;
    setTimeSlot: (slot: AvailableSlot | null) => void;
    updatePatientDetails: (details: Partial<BookingState['patientDetails']>) => void;
    resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [selectedTreatment, setSelectedTreatment] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<AvailableSlot | null>(null);
    const [patientDetails, setPatientDetails] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        comment: '',
    });

    const updatePatientDetails = (details: Partial<BookingState['patientDetails']>) => {
        setPatientDetails(prev => ({ ...prev, ...details }));
    };

    const resetBooking = () => {
        setSelectedTreatment(null);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setPatientDetails({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            comment: '',
        });
    };

    return (
        <BookingContext.Provider
            value={{
                selectedTreatment,
                selectedDate,
                selectedTimeSlot,
                patientDetails,
                setTreatment: setSelectedTreatment,
                setDate: setSelectedDate,
                setTimeSlot: setSelectedTimeSlot,
                updatePatientDetails,
                resetBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
