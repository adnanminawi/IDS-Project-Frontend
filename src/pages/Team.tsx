import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Team, type CreateTeam } from "../types";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teams";
import { useAuth } from "../context/AuthContext";
import { useQuery,useQueryClient } from "@tanstack/react-query";
export function Teams() {
    const { role, position } = useAuth();
      const queryClient = useQueryClient();
    const { data: teams = [], isLoading } = useQuery({queryKey: ["teams"],queryFn: getTeams,staleTime: 5 * 60 * 1000,});
    const [form, setForm] = useState<CreateTeam>({ name: "" });
    const [editId, setEditId] = useState<number | null>(null);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editId) {
                await updateTeam(editId, form);
            } else {
                await createTeam(form);
            }
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            setEditId(null);
            setForm({ name: "" });
        } catch {
            alert("Failed to save team");
        }
    }

    function handleEdit(team: Team) {
        setForm({ name: team.name });
        setEditId(team.id);
    }

    async function handleDelete(id: number) {
        try {
            await deleteTeam(id);
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        } catch {
            alert("Cannot delete team (it may have members)");
        }
    }

    if (isLoading) return <p className="p-6 text-gray-500">Loading...</p>;
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Teams</h1>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            {(role === "Admin" || position ==="Manager") && <th className="px-4 py-3 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {teams.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium"><Link to={`/teams/${t.id}`} className="text-blue-600 hover:underline">{t.name}</Link></td>
                                {(role === "Admin" || position ==="Manager") && (
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => handleEdit(t)} className="rounded bg-amber-500 px-3 py-1 text-white text-xs hover:bg-amber-600"> Edit </button>
                                        <button onClick={() => handleDelete(t.id)} className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700" > Delete </button> </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(  role === "Admin" || position === "Manager" ) && (
                <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {editId ? "Edit Team" : "Add Team"}
                    </h2>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Team Name"
                            value={form.name}
                            onChange={(e) => setForm({ name: e.target.value })}
                            required
                        />
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            {editId ? "Update" : "Add"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => { setEditId(null); setForm({ name: "" }); }}
                                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}