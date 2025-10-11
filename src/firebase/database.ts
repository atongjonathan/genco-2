import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  update,
} from 'firebase/database';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const db = getDatabase();
const auth = getAuth();

export const fetchDataFromRealtimeDB = async <T = unknown>(
  path: string,
): Promise<T> => {
  if (!auth.currentUser) {
    await signInWithEmailAndPassword(
      auth,
      import.meta.env.VITE_ADMIN_EMAIL,
      import.meta.env.VITE_ADMIN_PASSWORD,
    );
  }
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, path));
  if (snapshot.exists()) {
    return snapshot.val() as T;
  } else {
    return [] as unknown as T;
  }
};

export const deleteDataFromRealtimeDB = async (path: string): Promise<void> => {
  const dbRef = ref(db, path);
  await remove(dbRef);
};

export const updateDataInRealtimeDB = async (
  path: string,
  data: Record<string, any>,
): Promise<void> => {
  const dbRef = ref(db, path);
  await update(dbRef, data);
};

export const createDocument = async (
  collectionName: string,
  data: Record<string, any>,
): Promise<string> => {
  const database = getFirestore();
  const docRef = await addDoc(collection(database, collectionName), data);
  return docRef.path;
};

export const createDataInRealtimeDB = async (
  path: string, // e.g., 'users'
  data: Record<string, any>,
): Promise<string> => {
  const dbRef = ref(db, path); // Path to the collection
  const newRef = await push(dbRef, data); // Auto-generates a unique key
  return newRef.key!; // Return the new document ID
};
