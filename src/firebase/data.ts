import { getDocs, collection, type DocumentData, query, limit, getDoc } from "firebase/firestore";
import { db } from "./config";
import type { User } from "@/auth";

export const fetchUsers = async () => {
    const users = await fetchDataFromCollection('users') as User[];
    return users
}

export const findUser = async (email: string): Promise<User | null> => {
    const users = await fetchUsers();
    const userData = users.find((user) => user.email === email);
    const picture = `https://ui-avatars.com/api/?name=${userData?.name ?? userData?.email}&rounded=true&background=3559c7&size=35&color=fff`;
    const user = { email: userData?.email, name: userData?.name, role: userData?.role, picture } as User;
    return user || null;
};

// Helper function to fetch data from Firestore
export const fetchDataFromCollection = async (collectionName: string, count = Infinity) => {
    const q = query(collection(db, collectionName), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: { [k: string]: any }) => ({ id: doc.id, ...doc.data() }));

};

