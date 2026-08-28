import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {handleLogin} = useAuth();

    const navigate = useNavigate();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("")
      try {
        await handleLogin(username,password);
        navigate("/");

        }catch{
            setError("Invalid username or password");
        }
    }


return (
    <form onSubmit={onSubmit}>
        <input type="text" 
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required/>
        <input type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        required/>
        <button type="submit">Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        
    </form>
);
}