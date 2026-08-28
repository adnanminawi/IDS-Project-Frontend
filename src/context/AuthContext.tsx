import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { login } from "../api/auth";

// the shape of what the context holds
interface AuthContextType {
  token: string | null;
  role: string | null;
  username: string | null;
  handleLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));

  async function handleLogin(username: string, password: string) {
    const data = await login(username, password);

    
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);

    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setToken(null);
    setRole(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, username, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
