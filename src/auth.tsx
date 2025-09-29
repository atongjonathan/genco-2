import { type DocumentData } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";
import { auth } from "./firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export interface User {
  name: string;
  email: string;
  role: string;
  picture: string;
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  signIn: (email: string, password: string) => Promise<DocumentData>,
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // ✅ Restore user from localStorage on load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
    const [isAuthenticated, setIsAuthenticated] = useState(false)



    const signIn = async (email: string, password: string): Promise<DocumentData> => await signInWithEmailAndPassword(auth, email, password);


 

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user"); // ✅ Clear storage on logout
    window.location.assign("/app")
    
  };

  return <AuthContext.Provider value={{isAuthenticated, user, signIn, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) ?? {
    isAuthenticated: false,
    user: null,
    signIn: async () => Promise.resolve({}), // <-- returns a Promise<DocumentData>
    logout: () => {},
  }
}
