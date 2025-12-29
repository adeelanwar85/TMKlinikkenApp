import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { PriceCategory, PriceItem } from '../constants/Prices';

// Collection References
const TREATMENTS_COLLECTION = 'treatments';
const CLINIC_INFO_COLLECTION = 'clinic_info';

export const ContentService = {

    // --- TREATMENTS ---

    // Fetch all treatments (replaces PRICES constant)
    getAllTreatments: async (): Promise<PriceCategory[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, TREATMENTS_COLLECTION));
            const treatments: PriceCategory[] = [];
            querySnapshot.forEach((doc) => {
                treatments.push({ id: doc.id, ...doc.data() } as PriceCategory);
            });
            // Optional: Sort by some field if needed, or rely on client-side sorting
            return treatments;
        } catch (error) {
            console.error("Error getting treatments: ", error);
            return [];
        }
    },

    // Add or Update a Category (e.g., "Injeksjoner")
    saveCategory: async (category: PriceCategory) => {
        try {
            // Use category.id as document ID
            await setDoc(doc(db, TREATMENTS_COLLECTION, category.id), category);
        } catch (error) {
            console.error("Error saving category: ", error);
            throw error;
        }
    },

    // Delete a Category
    deleteCategory: async (categoryId: string) => {
        try {
            await deleteDoc(doc(db, TREATMENTS_COLLECTION, categoryId));
        } catch (error) {
            console.error("Error deleting category: ", error);
            throw error;
        }
    },

    // --- SEEDING UTILITY ---
    // Use this to upload the initial hardcoded data to Firebase
    seedInitialData: async (initialData: PriceCategory[]) => {
        console.log("Starting seed...");
        for (const category of initialData) {
            await setDoc(doc(db, TREATMENTS_COLLECTION, category.id), category);
            console.log(`Seeded category: ${category.title}`);
        }
        console.log("Seeding complete.");
    }
};
