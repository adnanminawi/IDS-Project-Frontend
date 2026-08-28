import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    if (token == null){
       return <Navigate to ="/login"/>;
    }
    else
        return <>{children}</>
}