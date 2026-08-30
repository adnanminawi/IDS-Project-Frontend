import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Deployment, type CreateDeployment, type Client, type Product } from "../types";
import { getDeployments, createDeployment, updateDeployment, deleteDeployment } from "../api/deployments";
import { getClients } from "../api/clients";
import { getProducts } from "../api/products";
import { useAuth } from "../context/AuthContext";

export function Deployments(){
    const {role} = useAuth();

    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [editId, setEditId] = useState<number | null> (null);
    const [form , setForm] = useState<CreateDeployment>({
        client_id :0,
        product_id : 0 ,
        version : "",
        goLiveDate : "",
        status: "", 
        supportTier: "", 
        clientNotes: "" 
    });


    useEffect(()=> {
        async function load() {
            const d = await getDeployments();
            const p = await getProducts();
            const c = await getClients();

            setDeployments(d);
            setProducts(p);
            setClients(c);
            setLoading(false);
        }load();
    },[]);

    async function handleDelete(id:number) {
        try{
            await deleteDeployment(id);
            const d = await getDeployments();
            const p = await getProducts();
            const c = await getClients();

            setDeployments(d);
            setProducts(p);
            setClients(c);

        }catch{
            alert("Cannot delete");
        }
    }
    function handleEdit(d : Deployment){
        setForm({
            client_id : d.client_id ,
            product_id : d.product_id,
            version : d.version ?? "",
            goLiveDate : d.goLiveDate ?? "",
            status : d.status ?? "",
            supportTier : d.supportTier ?? "",
            clientNotes : d.clientNotes ?? "",
        })
        setEditId(d.id);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try{
            if(editId){
                await updateDeployment(editId, form);
            }else{
                await createDeployment(form);
            }
            const d = await getDeployments();
            const p = await getProducts();
            const c = await getClients();

            setDeployments(d);
            setProducts(p);
            setClients(c);
            setForm({
                client_id :0,
                product_id : 0 ,
                version : "",
                goLiveDate : "",
                status: "", 
                supportTier: "", 
                clientNotes: "",  
            });
        }catch{
            alert("Failed to save Deployment")

        }
    }
function clientName(id: number) {
        return clients.find((c) => c.id === id)?.name ?? `Client ${id}`;
    }
function productName(id: number) {
        return products.find((p) => p.id === id)?.name ?? `Product ${id}`;
    }
if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deployments</h1>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Client</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Version</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Go Live Date</th>
                            {role === "Admin" && <th className="px-4 py-3 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {deployments.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">
                                    <Link to={`/deployments/${d.id}`} className="text-blue-600 hover:underline">
                                        {clientName(d.client_id)}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">{productName(d.product_id)}</td>
                                <td className="px-4 py-3 text-gray-600">{d.version}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">{d.status}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{d.goLiveDate ? d.goLiveDate.split("T")[0] : ""}</td>
                                {role === "Admin" && (
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => handleEdit(d)} className="rounded bg-amber-500 px-3 py-1 text-white text-xs hover:bg-amber-600">Edit</button>
                                        <button onClick={() => handleDelete(d.id)} className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700">Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {role === "Admin" && (
                <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {editId ? "Edit Deployment" : "Add Deployment"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select className="border border-gray-300 rounded px-3 py-2" value={form.client_id} onChange={(e) => setForm({ ...form, client_id: Number(e.target.value) })} required>
                            <option value={0}>Select a client</option>
                            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select className="border border-gray-300 rounded px-3 py-2" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: Number(e.target.value) })} required>
                            <option value={0}>Select a product</option>
                            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="date" value={form.goLiveDate} onChange={(e) => setForm({ ...form, goLiveDate: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2" type="text" placeholder="Support Tier" value={form.supportTier} onChange={(e) => setForm({ ...form, supportTier: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 md:col-span-2" type="text" placeholder="Client Notes" value={form.clientNotes} onChange={(e) => setForm({ ...form, clientNotes: e.target.value })} />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            {editId ? "Update Deployment" : "Add Deployment"}
                        </button>
                        {editId && (
                            <button type="button" onClick={() => { setEditId(null); setForm({ client_id: 0, product_id: 0, version: "", goLiveDate: "", status: "", supportTier: "", clientNotes: "" }); }} className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
