import { useState, useEffect } from "react";
import { type User, type CreateUser, type TeamMember } from "../types";
import { getUsers, createUser, deleteUser } from "../api/users";
import { getAllTeamMembers } from "../api/teamMembers";
import { useAuth } from "../context/AuthContext";

export function Users() {
    const { role } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<CreateUser>({
        username: "", password: "", role: "Editor", isActive: true, TeamMember_id : undefined,
    });
    const [team, setTeam] = useState<TeamMember[]>([]);


    useEffect(() => {
        async function load() {
            const data = await getUsers();
            const tm = await getAllTeamMembers();


            setUsers(data);
            setTeam(tm);
            setLoading(false);
        }
        load();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await createUser(form);
            const data = await getUsers();
            setUsers(data);
            setForm({ username: "", password: "", role: "Editor", isActive: true , TeamMember_id: undefined});
        } catch {
            alert("Failed to create user (username may already exist)");
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteUser(id);
            const data = await getUsers();
            setUsers(data);
        } catch {
            alert("Cannot delete user");
        }
    }

    // block non-admins entirely
    if (role !== "Admin") {
        return <p className="p-6 text-red-600">Access denied. Admins only.</p>;
    }

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Username</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Active</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{u.username}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-block rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-xs">{u.role}</span>
                                </td>
                                <td className="px-4 py-3">{u.isActive ? "Yes" : "No"}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleDelete(u.id)} className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add User</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                    <input className="border border-gray-300 rounded px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    <select className="border border-gray-300 rounded px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Team Leader">Team Leader</option>
                        <option value="Developer">Developer</option>
                    </select>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                        Active
                    </label>
                    <select value={form.TeamMember_id ?? 0} onChange={(e) => setForm({ ...form, TeamMember_id: Number(e.target.value) || undefined })}>
                    <option value={0}>No team member (admin)</option> 
                    {team.filter((m) => !users.some((u) => u.teamMember_id === m.id)).map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    </select>
                </div>
                <button type="submit" className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Add User</button>
            </form>
        </div>
    );
}