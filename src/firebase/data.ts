import type { User } from '@/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import { auth, db } from './config';

export const fetchUsers = async () => {
  const users = (await fetchDataFromCollection('users')) as User[];
  return users;
};

export const findUser = async (email: string): Promise<User | null> => {
  const users = await fetchUsers();
  const userData = users.find((user) => user.email === email);
  const picture = `https://ui-avatars.com/api/?name=${userData?.name ?? userData?.email}&rounded=true&background=3559c7&size=35&color=fff`;
  const user = {
    email: userData?.email,
    name: userData?.name,
    role: userData?.role,
    picture,
  } as User;
  return user || null;
};

// Helper function to fetch data from Firestore
export const fetchDataFromCollection = async (
  collectionName: string,
  count = Infinity,
) => {
  const q = query(collection(db, collectionName), limit(count));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: { [k: string]: any }) => ({
    docId: doc.id,
    ...doc.data(),
  }));
};

export const updateDocWithId = async (
  docId: string,
  updateData: Record<string, any>,
  collection: string,
) => {
  if (!db) throw new Error('Firestore is not initialized');
  if (!docId) throw new Error('docId is required');

  return await updateDoc(doc(db, collection, docId), updateData);
};

export const registerUser = async (userData: User & { password: string }) => {
  // Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password,
  );
  const user = userCredential.user;

  // Add user details to Firestore
  return await addDoc(collection(db, 'users'), {
    uid: user.uid,
    email: user.email,
    role: userData.role,
    name: userData.name,
    status: 'Active', // Default status
    createdAt: new Date(),
  });
};

export const deleteDocument = async (collection: string, docId: string) => {
  return await deleteDoc(doc(db, collection, docId));
};

// Function to detect and parse stringified arrays
const parseStringifiedArrays = (obj: any) => {
  for (let key in obj) {
    if (obj[key].startsWith('[')) {
      try {
        let parsed = JSON.parse(obj[key]);
        if (Array.isArray(parsed)) {
          obj[key] = parsed; // Replace string with actual array
        }
      } catch (error) {
        console.log(error);

        // Ignore errors (value is not a JSON-parsable array)
      }
    }
  }
  return obj;
};
export async function addDocument(category: string, row: DocumentData) {
  let newRow = parseStringifiedArrays(row);

  newRow.timestamp = serverTimestamp();
  return await addDoc(collection(db, category), newRow);
}
