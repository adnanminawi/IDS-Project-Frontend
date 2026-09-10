import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
    const { username, position, role, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="flex items-center gap-6 bg-gray-800 px-6 py-3 text-white">
                <Link to="/" className="hover:text-gray-300">Dashboard</Link>
                <Link to="/products" className="hover:text-gray-300">Products</Link>
                <Link to="/clients" className="hover:text-gray-300">Clients</Link>
                <Link to="/deployments" className="hover:text-gray-300">Deployments</Link>
                <Link to="/teams" className="hover:text-gray-300">Teams</Link>
                {role === "Admin" && (
                    <Link to="/users" className="hover:text-gray-300">Users</Link>
                )}
                <Link to="/chart" className="hover:text-gray-300">Chart</Link>

                <span className="ml-auto text-sm text-gray-300">
                    {username} ({role})
                </span>
                <button
                    onClick={handleLogout}
                    className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                >
                    Logout
                </button>
            </nav>

            <main className="p-6">
                {children}
            </main>
        </div>
    );
}