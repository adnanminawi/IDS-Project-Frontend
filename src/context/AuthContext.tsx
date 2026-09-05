  import { createContext, useContext, useState } from "react";
  import type { ReactNode } from "react";
  import { login } from "../api/auth";

  
  interface AuthContextType {
    token: string | null;
    role: string | null;
    username: string | null;
    position: string | null;  
    team: number | null;  
    handleLogin: (username: string, password: string) => Promise<void>;
    logout: () => void;
  }



  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
    const [position, setPosition] = useState<string | null>(localStorage.getItem("position"));
    const [team, setTeam] = useState<number | null>(localStorage.getItem("team") ? Number(localStorage.getItem("team")) : null );
    const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));

    async function handleLogin(username: string, password: string) {
      const data = await login(username, password);

      
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("position", data.position ?? "");
      localStorage.setItem("team", data.teamId != null ? String(data.teamId) : "");
      

      setToken(data.token);
      setRole(data.role);
      setUsername(data.username);
      setPosition(data.position ?? "");
      setTeam(localStorage.getItem("team") ? Number(localStorage.getItem("team")) : null);
    }

    function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("position");
      localStorage.removeItem("team");

      setToken(null);
      setRole(null);
      setUsername(null);
      setPosition(null);
      setTeam(null);
    }

    return (
      <AuthContext.Provider value={{ token, role, username, position,team,handleLogin, logout }}>
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
