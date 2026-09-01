import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Product, Module,Client , Deployment, Responsibility, Team  } from "../types";
import { getProduct, getProductModules, getProductDeployments, getProductResponsibilities } from "../api/products";
import { getClients } from "../api/clients";
import { getTeams } from "../api/teams";
import { Link } from "react-router-dom";
export function ProductDetails(){
    const {id} = useParams();
    const productId= Number(id);

    const [product, setProduct]= useState<Product| null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [responsibility, setResponsibility] = useState<Responsibility[]>([]);
    const [loading, setLoading]= useState(true);
    

    useEffect(()=>{
        async function load() {
            const prod = await getProduct(productId);
            const mod = await getProductModules(productId);
            const dep = await getProductDeployments(productId);
            const resp =await getProductResponsibilities(productId);
            const cli = await getClients();
            const tm = await getTeams();

            setProduct(prod);
            setModules(mod);
            setDeployments(dep);
            setResponsibility(resp);
            setClients(cli);
            setTeams(tm);
            setLoading(false);
        }
        load();
    },[productId]);

    function clientName(cid: number) {
    return clients.find((c) => c.id === cid)?.name ?? `Client ${cid}`;
}

function teamName(tid: number) {
    return teams.find((t) => t.id === tid)?.name ?? `Team ${tid}`;
}

     if (loading) return <p className="p-6">Loading...</p>;
    if (!product) return <p className="p-6">Product not found.</p>;
    
    
    return(
      <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Link to="/products" className="text-blue-600 hover:underline">← Back to Products</Link>

             <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><span className="font-medium text-gray-600">Status:</span> {product.status || "—"}</p>
                    <p><span className="font-medium text-gray-600">Version:</span> {product.version || "—"}</p>
                    <p><span className="font-medium text-gray-600">Technologies:</span> {product.technologies || "—"}</p>
                    <p><span className="font-medium text-gray-600">Markets:</span> {product.markets || "—"}</p>
                    <p><span className="font-medium text-gray-600">Criticality:</span> {product.criticality || "—"}</p>
                    <p><span className="font-medium text-gray-600">Purpose:</span> {product.purpose || "—"}</p>
                    <p className="md:col-span-2"><span className="font-medium text-gray-600">Description:</span> {product.description || "—"}</p>
                    <p className="md:col-span-2"><span className="font-medium text-gray-600">Notes:</span> {product.notes || "—"}</p>
                </div>
            </section>

             <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Modules ({modules.length})</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">Description</th>
                                <th className="px-3 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {modules.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{m.name}</td>
                                    <td className="px-3 py-2 text-gray-600">{m.description}</td>
                                    <td className="px-3 py-2">
                                        <span className="inline-block rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">{m.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </section>

            

           <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
           <h2 className="font-semibold text-gray-800 mb-3">Deployments ({deployments.length})</h2>
            <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                    <th className="px-3 py-2 text-left">Client</th>
                    <th className="px-3 py-2 text-left">Version</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Support Tier</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {deployments.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{clientName(d.client_id)}</td>
                        <td className="px-3 py-2 text-gray-600">{d.version}</td>
                        <td className="px-3 py-2">
                            <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">{d.status}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">{d.supportTier}</td>
                    </tr>
                ))}
            </tbody>
        </table>
</section>

            
           <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Team Responsibilities ({responsibility.length})</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 text-left">Team</th>
                                <th className="px-3 py-2 text-left">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {responsibility.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{teamName(r.team_id)}</td>
                                    <td className="px-3 py-2 text-gray-600">{r.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </section>
            
        </div>
    );
}