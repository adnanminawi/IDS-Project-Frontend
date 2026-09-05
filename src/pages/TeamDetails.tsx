import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { type Team, type TeamMember, type CreateTeamMember } from "../types";
import { getTeam, getTeamMembers } from "../api/teams";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "../api/teamMembers";
import { useAuth } from "../context/AuthContext";

export function TeamDetails() {
    const { id } = useParams();
    const teamId = Number(id);
    const { role } = useAuth();

    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<CreateTeamMember>({
        name: "", position: "", department: "", email: "", status: "", roleInTeam: "", team_id: teamId,
    });

    async function load() {
        const t = await getTeam(teamId);
        const m = await getTeamMembers(teamId);
        setTeam(t);
        setMembers(m);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [teamId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const data = { ...form, team_id: teamId, managerId: teamLeader ? teamLeader.id : undefined };   
            if (editId) {
                await updateTeamMember(editId, data);
            } else {
                await createTeamMember(data);
            }
            await load();
            setEditId(null);
            setForm({ name: "", position: "", department: "", email: "", status: "", roleInTeam: "", team_id: teamId });
        } catch {
            alert("Failed to save member");
        }
    }

    function handleEdit(member: TeamMember) {
        setForm({
            name: member.name,
            position: member.position ?? "",
            department: member.department ?? "",
            email: member.email ?? "",
            status: member.status ?? "",
            roleInTeam: member.roleInTeam ?? "",
            team_id: teamId,
        });
        setEditId(member.id);
    }

    async function handleDelete(memberId: number) {
        try {
            await deleteTeamMember(memberId);
            await load();
        } catch {
            alert("Cannot delete member");
        }
    }

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (!team) return <p className="p-6">Team not found.</p>;
    const teamLeader = members.find((m) => m.roleInTeam === "Team Leader");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/teams" className="text-blue-600 hover:underline">← Back to Teams</Link>
            <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>

            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h2 className="font-semibold text-gray-800 mb-3">Members ({members.length})</h2>
                {members.length === 0 ? (
                    <p className="text-gray-400 text-sm">No members in this team.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">Role in Team</th>
                                <th className="px-3 py-2 text-left">Position</th>
                                <th className="px-3 py-2 text-left">Department</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Status</th>

                                {role === "Admin" && <th className="px-3 py-2 text-left">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {members.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{m.name}</td>
                                    <td className="px-3 py-2">{m.roleInTeam}</td>
                                    <td className="px-3 py-2 text-gray-600">{m.position}</td>
                                    <td className="px-3 py-2 text-gray-600">{m.department}</td>
                                    <td className="px-3 py-2 text-gray-600">{m.email}</td>
                                    <td className="px-3 py-2 text-gray-600">{m.status}</td>
                                    {role === "Admin" && (
                                        <td className="px-3 py-2 space-x-2">
                                            <button onClick={() => handleEdit(m)} className="rounded bg-amber-500 px-2 py-1 text-white text-xs hover:bg-amber-600">Edit</button>
                                            <button onClick={() => handleDelete(m.id)} className="rounded bg-red-600 px-2 py-1 text-white text-xs hover:bg-red-700">Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {role === "Admin" && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {editId ? "Edit Member" : "Add Member"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Role in Team" value={form.roleInTeam} onChange={(e) => setForm({ ...form, roleInTeam: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            {editId ? "Update Member" : "Add Member"}
                        </button>
                        {editId && (
                            <button type="button" onClick={() => { setEditId(null); setForm({ name: "", position: "", department: "", email: "", status: "", roleInTeam: "", team_id: teamId }); }} className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}