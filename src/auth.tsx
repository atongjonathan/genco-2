import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  role: string;
  picture: string;
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void;
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



  const login = (user: User) => {
    const picture = `https://ui-avatars.com/api/?name=${user.name ?? user.email}&rounded=true&background=3559c7&size=35&color=fff`;
    let userWithPic = { ...user, picture }
    setUser(userWithPic);
    localStorage.setItem("user", JSON.stringify(userWithPic)); // ✅ Persist login
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user"); // ✅ Clear storage on logout
    window.location.assign("/app")
    
  };

  return <AuthContext.Provider value={{isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) ?? { isAuthenticated: false, user: null, login: () => { }, logout: () => { } }; // ✅ Prevents crashes
}
