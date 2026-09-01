import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Deployment, DeploymentEnvironment, Module, Client, Product } from "../types";
import { getDeployment, getDeploymentEnvironments, getDeploymentModules } from "../api/deployments";
import { getClients } from "../api/clients";
import { getProducts } from "../api/products";

export function DeploymentDetails() {
    const { id } = useParams();
    const deploymentId = Number(id);

    const [deployment, setDeployment] = useState<Deployment | null>(null);
    const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const dep = await getDeployment(deploymentId);
            const envs = await getDeploymentEnvironments(deploymentId);
            const mods = await getDeploymentModules(deploymentId);
            const cli = await getClients();
            const prod = await getProducts();

            setDeployment(dep);
            setEnvironments(envs);
            setModules(mods);
            setClients(cli);
            setProducts(prod);
            setLoading(false);
        }
        load();
    }, [deploymentId]);

    function clientName(cid: number) {
        return clients.find((c) => c.id === cid)?.name ?? `Client ${cid}`;
    }
    function productName(pid: number) {
        return products.find((p) => p.id === pid)?.name ?? `Product ${pid}`;
    }

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (!deployment) return <p className="p-6">Deployment not found.</p>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/deployments" className="text-blue-600 hover:underline">← Back to Deployments</Link>

            <h1 className="text-2xl font-bold text-gray-800">
                {clientName(deployment.client_id)} — {productName(deployment.product_id)}
            </h1>

            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><span className="font-medium text-gray-600">Version:</span> {deployment.version || "—"}</p>
                    <p><span className="font-medium text-gray-600">Status:</span> {deployment.status || "—"}</p>
                    <p><span className="font-medium text-gray-600">Support Tier:</span> {deployment.supportTier || "—"}</p>
                    <p><span className="font-medium text-gray-600">Go Live:</span> {deployment.goLiveDate ? deployment.goLiveDate.split("T")[0] : "—"}</p>
                    <p className="md:col-span-2"><span className="font-medium text-gray-600">Notes:</span> {deployment.clientNotes || "—"}</p>
                </div>
            </section>

            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Enabled Modules ({modules.length})</h2>
                {modules.length === 0 ? (
                    <p className="text-gray-400 text-sm">No enabled modules.</p>
                ) : (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        {modules.map((m) => (
                            <li key={m.id}>{m.name} — {m.status}</li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-3">Environments ({environments.length})</h2>
                {environments.length === 0 ? (
                    <p className="text-gray-400 text-sm">No environments.</p>
                ) : (
                    <div className="space-y-4">
                        {environments.map((env) => (
                            <div key={env.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-medium text-gray-800">{env.name} <span className="text-xs text-gray-500">({env.type})</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm mt-2 text-gray-600">
                                    <p><span className="font-medium">Server:</span> {env.serverName || "—"}</p>
                                    <p><span className="font-medium">OS:</span> {env.operatingSystem || "—"}</p>
                                    <p><span className="font-medium">App URL:</span> {env.applicationUrl || "—"}</p>
                                    <p><span className="font-medium">Database:</span> {env.databaseInfo || "—"}</p>
                                    <p><span className="font-medium">Monitoring:</span> {env.monitoringLink || "—"}</p>
                                    <p><span className="font-medium">Access:</span> {env.accessInfo || "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}