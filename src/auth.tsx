import { type DocumentData } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";
import { auth } from "./firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "@tanstack/react-router";

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
  login: (user: User) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // ✅ Restore user from localStorage on load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const signIn = async (email: string, password: string): Promise<DocumentData> => await signInWithEmailAndPassword(auth, email, password);


    const login = (user: User) => {
    setUser(user);    
    localStorage.setItem("user", JSON.stringify(user)); // ✅ Persist user in localStorage
  }

 

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ Clear storage on logout
    navigate({ to: '/login' })
    
  };


  return <AuthContext.Provider value={{isAuthenticated:!!user, user, signIn, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) ?? {
    isAuthenticated: false,
    user: null,
    signIn: async () => Promise.resolve({}), // <-- returns a Promise<DocumentData>
    login: () => {},
    logout: () => {},
  }
}
