import { db } from './firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';

export type UserRole = 'superuser' | 'admin';

export interface AdminUser {
    username: string; // Used as ID
    role: UserRole;
    passwordHash: string;
    createdAt?: number;
    lastLogin?: number;
}

const USERS_COLLECTION = 'users';

export const AuthService = {
    /**
     * Hash helper
     */
    async hashPassword(password: string): Promise<string> {
        return await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
        );
    },

    /**
     * Authenticate user
     */
    async login(username: string, password: string): Promise<{ success: boolean; user?: Omit<AdminUser, 'passwordHash'>; error?: string }> {
        try {
            const userRef = doc(db, USERS_COLLECTION, username.toLowerCase().trim());
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Security: Don't reveal user existence
                return { success: false, error: 'Feil brukernavn eller passord' };
            }

            const userData = userSnap.data() as AdminUser;
            const inputHash = await this.hashPassword(password);

            if (userData.passwordHash === inputHash) {
                // Update last login
                updateDoc(userRef, { lastLogin: Date.now() });

                // Return user without hash
                const { passwordHash, ...safeUser } = userData;
                return { success: true, user: safeUser };
            } else {
                return { success: false, error: 'Feil brukernavn eller passord' };
            }
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, error: 'En feil oppstod ved innlogging' };
        }
    },

    /**
     * Create default Superuser if no users exist
     */
    async seedSuperuserIfNeeded() {
        const q = query(collection(db, USERS_COLLECTION));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('Seeding default superuser...');
            const defaultPass = 'admin123'; // Initial password
            const hash = await this.hashPassword(defaultPass);
            const user: AdminUser = {
                username: 'admin',
                role: 'superuser',
                passwordHash: hash,
                createdAt: Date.now()
            };
            await setDoc(doc(db, USERS_COLLECTION, 'admin'), user);
            return true;
        }
        return false;
    },

    /**
     * Create new user (Superuser only)
     */
    async createUser(username: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
        const id = username.toLowerCase().trim();
        const userRef = doc(db, USERS_COLLECTION, id);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            return { success: false, error: 'Bruker finnes allerede' };
        }

        const hash = await this.hashPassword(password);
        const newUser: AdminUser = {
            username: id,
            role,
            passwordHash: hash,
            createdAt: Date.now()
        };

        await setDoc(userRef, newUser);
        return { success: true };
    },

    async resetPassword(username: string, newPass: string) {
        // This can be used by Superuser or Self if we implement Change Password
        const id = username.toLowerCase().trim();
        const hash = await this.hashPassword(newPass);
        await updateDoc(doc(db, USERS_COLLECTION, id), { passwordHash: hash });
    },

    async getUsers(): Promise<AdminUser[]> {
        const snap = await getDocs(collection(db, USERS_COLLECTION));
        return snap.docs.map(d => d.data() as AdminUser);
    },

    async deleteUser(username: string) {
        await deleteDoc(doc(db, USERS_COLLECTION, username.toLowerCase().trim()));
    }
};
