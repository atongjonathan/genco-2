import { getDocs, collection, type DocumentData } from "firebase/firestore";
import { db } from "./config";
import type { User } from "@/auth";

export const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: DocumentData[] = []
    querySnapshot.forEach((doc) => {
        let docData = doc.data()
        docData.docId = doc.id
        users.push(docData)
    }
    )
    return users
}
export const findUser = async (email: string): Promise<User | null> => {
    const users = await fetchUsers();
    const userData = users.find((user) => user.email === email);
    const picture = `https://ui-avatars.com/api/?name=${userData?.name ?? userData?.email}&rounded=true&background=3559c7&size=35&color=fff`;
    const user = { email: userData?.email, name: userData?.name, role: userData?.role, picture } as User;
    return user || null;
};