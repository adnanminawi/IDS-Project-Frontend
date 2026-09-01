import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Client, Deployment, Product } from "../types";
import { getClient, getClientDeployment } from "../api/clients";
import { getProducts } from "../api/products";

export function ClientDetails() {
    const { id } = useParams();
    const clientId = Number(id);

    const [client, setClient] = useState<Client | null>(null);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const cli = await getClient(clientId);
            const dep = await getClientDeployment(clientId);
            const prods = await getProducts();

            setClient(cli);
            setDeployments(dep);
            setProducts(prods);
            setLoading(false);
        }
        load();
    }, [clientId]);

    function productName(id: number) {
        return products.find((p) => p.id === id)?.name ?? `Product ${id}`;
    }

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (!client) return <p className="p-6">Client not found.</p>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/clients" className="text-blue-600 hover:underline">← Back to Clients</Link>

            <h1 className="text-2xl font-bold text-gray-800">{client.name}</h1>

            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><span className="font-medium text-gray-600">Status:</span> {client.status || "—"}</p>
                    <p><span className="font-medium text-gray-600">Contact:</span> {client.contact || "—"}</p>
                    <p><span className="font-medium text-gray-600">Country:</span> {client.country || "—"}</p>
                    <p><span className="font-medium text-gray-600">Notes:</span> {client.notes || "—"}</p>
                </div>
            </section>

            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Deployments ({deployments.length})</h2>
                {deployments.length === 0 ? (
                    <p className="text-gray-400 text-sm">No deployments for this client.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 text-left">Product</th>
                                <th className="px-3 py-2 text-left">Version</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">Support Tier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {deployments.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{productName(d.product_id)}</td>
                                    <td className="px-3 py-2 text-gray-600">{d.version}</td>
                                    <td className="px-3 py-2">
                                        <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">{d.status}</span>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{d.supportTier}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}