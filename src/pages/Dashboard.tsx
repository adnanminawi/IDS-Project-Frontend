import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type DashboardStats } from "../types";
import { getDashboardStats } from "../api/dashboard";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
    const { username, role } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (!stats) return <p className="p-6">No data.</p>;

    const cards = [
        { label: "Products", value: stats.totalProducts, to: "/products", gradient: "from-blue-500 to-blue-700" },
        { label: "Clients", value: stats.totalClients, to: "/clients", gradient: "from-emerald-500 to-emerald-700" },
        { label: "Deployments", value: stats.totalDeployments, to: "/deployments", gradient: "from-purple-500 to-purple-700" },
        { label: "Teams", value: stats.totalTeams, to: "/teams", gradient: "from-amber-500 to-orange-600" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome header */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Welcome back, {username}</h1>
                <p className="text-blue-100 mt-2">
                    You're signed in as <span className="font-semibold">{role}</span>. Here's an overview of the portal.
                </p>
            </div>

            {/* Stat cards — full color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((c) => (
                    <Link
                        key={c.label}
                        to={c.to}
                        className={`group bg-gradient-to-br ${c.gradient} rounded-2xl shadow-md p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}
                    >
                        <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Total {c.label}</p>
                        <p className="text-5xl font-bold mt-3">{c.value}</p>
                        <p className="text-white/90 text-sm mt-4 group-hover:underline">View all →</p>
                    </Link>
                ))}
            </div>

            {/* Quick actions — full color */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/products" className="rounded-xl bg-blue-600 hover:bg-blue-700 p-5 text-center font-medium text-white transition">
                        Manage Products
                    </Link>
                    <Link to="/clients" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 p-5 text-center font-medium text-white transition">
                        Manage Clients
                    </Link>
                    <Link to="/deployments" className="rounded-xl bg-purple-600 hover:bg-purple-700 p-5 text-center font-medium text-white transition">
                        Manage Deployments
                    </Link>
                    <Link to="/teams" className="rounded-xl bg-amber-600 hover:bg-amber-700 p-5 text-center font-medium text-white transition">
                        Manage Teams
                    </Link>
                </div>
            </div>
        </div>
    );
}