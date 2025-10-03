import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';

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
