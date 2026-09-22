import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/image.png";   

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await handleLogin(username, password);
            navigate("/");
        } catch {
            setError("Invalid username or password");
        }
    }
const demoUsers = [
  { username: "Ali_Hassan",  role: "Admin / CEO",       sees: "Everything" },
  { username: "Omar_Khalil", role: "Manager",           sees: "Everything, manages resources" },
  { username: "Sarah_Nasser",role: "Project Manager",   sees: "Team A scope" },
  { username: "Karim_Jaber", role: "Team Leader",       sees: "Team B" },
  { username: "Rita_Aoun",   role: "Developer",         sees: "Team C, team-filtered" },
];
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-4">
            <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-4xl">

                {/* Login card */}
                <div className="w-full md:w-[380px] shrink-0 bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <img src={logo} alt="IDS" className="w-24 h-24 object-contain mb-3" />
                        <h1 className="text-xl font-bold text-gray-800">Fintech Products Portal</h1>
                        <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-700 text-white rounded-lg py-2 font-medium hover:bg-blue-800 transition"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                {/* Demo accounts card */}
                <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Demo accounts</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Sign in with any username below. All passwords: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">123</code>
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">Username</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-left">Sees</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {demoUsers.map((u) => (
                                    <tr key={u.username} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{u.username}</td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.role}</td>
                                        <td className="px-4 py-3 text-gray-600">{u.sees}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
    These are just examples — you can sign in as any person shown in the org chart.
    Usernames use the pattern <code className="bg-gray-100 px-1 rounded">First_Last</code>
    (e.g. <code className="bg-gray-100 px-1 rounded">Layla_Ahmad</code>), password <code className="bg-gray-100 px-1 rounded">123</code>.
</p></div>

            </div>
        </div>
        
    );
}
