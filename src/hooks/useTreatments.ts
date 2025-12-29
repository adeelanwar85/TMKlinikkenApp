import { useState, useEffect } from 'react';
import { HanoService } from '../services/HanoService'; // Switch to HanoService
import { PriceCategory, PRICES } from '../constants/Prices';

export const useTreatments = () => {
    const [treatments, setTreatments] = useState<PriceCategory[]>(PRICES); // Start with local data for instant load
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTreatments = async () => {
        try {
            setLoading(true);

            // Allow UI to settle/render local data first, then fetch
            // setTimeout optional, but good for smooth UX

            const data = await HanoService.getTreatmentList();

            if (data && data.length > 0) {
                console.log(`Loaded ${data.length} categories from Hano API.`);
                setTreatments(data);
            } else {
                console.log("Hano API returned empty, keeping local fallback.");
            }
        } catch (err) {
            console.error(err);
            setError("Kunne ikke laste behandlinger fra Hano.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreatments();
    }, []);

    const refresh = fetchTreatments;

    return { treatments, loading, error, refresh };
};
