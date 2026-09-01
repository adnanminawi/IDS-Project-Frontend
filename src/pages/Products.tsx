import { useState, useEffect, use } from "react";
import { type CreateProduct, type Product , type Team, type CreateModule} from "../types";
import { createProduct, deleteProduct, getProducts, updateProduct, assignTeam, createModule } from "../api/products";
import { getTeams } from "../api/teams";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export function Products(){

const { role } = useAuth();

    const [products, setPorducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<CreateProduct>({
        name : "",
        status: "",
        version : "",
        description : "",
        purpose : "",
        markets : "",
        criticality : "",
        technologies : "",
        notes : "",
    })
    const [editId, setEditId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [selectedTeam, setSelectedTeam] = useState(0);
    const [teamDescription, setTeamDescription] = useState("");
    const [moduleProduct, setModuleProduct] = useState(0);
    const [moduleForm, setModuleForm] = useState<CreateModule>({ name: "", description: "", status: "" });

    useEffect(()=>{
        async function loadProducts() {
            const data = await getProducts();
            const tm = await getTeams();
            setPorducts(data);
            setTeams(tm);
            setLoading(false);
        }
        loadProducts();
        },[]);

    async function handleDelete(id:number) {
        try{         
            await deleteProduct(id);
            const data = await getProducts();
            setPorducts(data);
        }catch{
        alert("Cannot delete");
        }
    }
    function handleEdit(product : Product){
        setForm({
            name: product.name,
        status: product.status ?? "",
        version: product.version ?? "",
        description: product.description ?? "",
        purpose: product.purpose ?? "",
        markets: product.markets ?? "",
        criticality: product.criticality ?? "",
        technologies: product.technologies ?? "",
        notes: product.notes ?? "",
        });
        setEditId(product.id);
    }
    
    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
        if (editId) {
            await updateProduct(editId, form);
        } else {
            await createProduct(form);
        }
        const data = await getProducts();
        setPorducts(data);
        setEditId(null);
        setForm({ name : "",
        status: "",
        version : "",
        description : "",
        purpose : "",
        markets : "",
        criticality : "",
        technologies : "",
        notes : "",
    });
    } catch {
        alert("Failed to save product");
    }
}
async function handleAssignTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
        await assignTeam(selectedProduct, { team_id: selectedTeam, description: teamDescription });
        setSelectedProduct(0);
        setSelectedTeam(0);
        setTeamDescription("");
        alert("Team assigned successfully");
    } catch {
        alert("Failed to assign team");
    }
}

async function handleCreateModule(e: React.FormEvent) {
    e.preventDefault();
    try {
        await createModule(moduleProduct, moduleForm);
        setModuleProduct(0);
        setModuleForm({ name: "", description: "", status: "" });
        alert("Module created successfully");
    } catch {
        alert("Failed to create module");
    }
}

const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.status ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.technologies ?? "").toLowerCase().includes(search.toLowerCase())
);

if (loading) return <p>Loading...</p>;
         return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>
            <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Version</th>
                            {role === "Admin" && <th className="px-4 py-3 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800"><Link to={`/products/${p.id}`} className="text-blue-600 hover:underline">{p.name} </Link></td>
                                <td className="px-4 py-3"> <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs"> {p.status}</span> </td>
                                <td className="px-4 py-3 text-gray-600">{p.version}</td>
                                
                                {role === "Admin" && (
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => handleEdit(p)} className="rounded bg-amber-500 px-3 py-1 text-white text-xs hover:bg-amber-600"> Edit </button>
                                        <button onClick={() => handleDelete(p.id)} className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700"> Delete </button>
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
                        {editId ? "Edit Product" : "Add Product"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Markets" value={form.markets} onChange={(e) => setForm({ ...form, markets: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Criticality" value={form.criticality} onChange={(e) => setForm({ ...form, criticality: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Technologies" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
                        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" type="text" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            {editId ? "Update Product" : "Add Product"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setForm({ name: "", status: "", version: "", description: "", purpose: "", markets: "", criticality: "", technologies: "", notes: "" });
                                }}
                                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>)}
                
                {role === "Admin" && (
    <form onSubmit={handleAssignTeam} className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assign Team to Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2"
                required
            >
                <option value={0}>Select a product</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2"
                required
            >
                <option value={0}>Select a team</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input
                type="text"
                placeholder="Description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
            />
        </div>
        <button type="submit" className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Assign Team
        </button>
    </form>
)}
{role === "Admin" && (
    <form onSubmit={handleCreateModule} className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Module to Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
                value={moduleProduct}
                onChange={(e) => setModuleProduct(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2"
                required
            >
                <option value={0}>Select a product</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input
                type="text"
                placeholder="Module Name"
                value={moduleForm.name}
                onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                required
            />
            <input
                type="text"
                placeholder="Description"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
            />
            <input
                type="text"
                placeholder="Status"
                value={moduleForm.status}
                onChange={(e) => setModuleForm({ ...moduleForm, status: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
            />
        </div>
        <button type="submit" className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Module
        </button>
    </form>
)}
        </div>
    );
}