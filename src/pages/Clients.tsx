import { useState, useEffect } from "react";
import {  type Client } from "../types";
import { createClient, getClients, deleteClient, updateClient } from "../api/clients";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export function Clients(){
    const {role, position} = useAuth();

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm]= useState({
        name:"",
        country:"",
        contact : "",
        status : "",
        notes : ""
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    useEffect(()=>{
        async function load() {
            const data = await getClients();
            setClients(data);
            setLoading(false);
        }load();
    },[]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
            try {
                if (editId) {
                    await updateClient(editId, form);
                } else {
                    await createClient(form);
                }
                const data = await getClients();
                setClients(data);
                setEditId(null);
                setForm({ 
                    name:"",
                    country:"",
                    contact : "",
                    status : "",
                    notes : ""
            });
            } catch {
                alert("Failed to save client");
            }
        }
    async function handleDelete(id:number) {
        try{
            await deleteClient(id);
            const data = await getClients();
            setClients(data);
        }catch{
            alert("Cannot delete");
        }
    }
    async function handleEdit(client: Client){
        setForm({
            name : client.name,
            country : client.country ?? "",
            contact : client.contact?? "",
            status : client.status ?? "",
            notes : client.notes ?? ""
        });
        setEditId(client.id);
    }
    const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.country ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.status ?? "").toLowerCase().includes(search.toLowerCase())
);

    if (loading) return <p>Loading...</p>;

    return(
   
   <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Clients</h1>
                <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">status</th>
                            <th className="px-4 py-3 text-left">Country</th>
                            {(role === "Admin" || position === "Manager" || position === "CEO" || position ==="Project Manager") && <th className="px-4 py-3 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClients.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800"><Link to={`/clients/${c.id}`} className="text-blue-600 hover:underline">{c.name} </Link></td>
                                <td className="px-4 py-3"> <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs"> {c.status}</span> </td>
                                <td className="px-4 py-3 font-medium text-gray-800">{c.country}</td>
                                
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => handleEdit(c)} className="rounded bg-amber-500 px-3 py-1 text-white text-xs hover:bg-amber-600"> Edit </button>
                                        <button onClick={() => handleDelete(c.id)} className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700"> Delete </button>
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(role === "Admin" || position === "Manager" || position === "CEO" || position === "Project Manager") && (
                <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {editId ? "Edit Client" : "Add Client"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                        </div>
                    <div className="mt-4 flex gap-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            {editId ? "Update Client" : "Add Client"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setForm({ name: "", status: "", country : "" ,contact: "", notes: "" });
                                }}
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

