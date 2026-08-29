import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Product, Module, Deployment, Responsibility } from "../types";
import { getProduct, getProductModules, getProductDeployments, getProductResponsibilities } from "../api/products";


export function ProductDetails(){
    const {id} = useParams();
    const productId= Number(id);

    const [product, setProduct]= useState<Product| null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [responsibility, setResponsibility] = useState<Responsibility[]>([]);
    const [loading, setLoading]= useState(true);
    

    useEffect(()=>{
        async function load() {
            const prod = await getProduct(productId);
            const mod = await getProductModules(productId);
            const dep = await getProductDeployments(productId);
            const resp =await getProductResponsibilities(productId);

            setProduct(prod);
            setModules(mod);
            setDeployments(dep);
            setResponsibility(resp);
            setLoading(false);
        }
        load();
    },[productId]);
     if (loading) return <p className="p-6">Loading...</p>;
    if (!product) return <p className="p-6">Product not found.</p>;
    
    
    return(
      <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>

            <section className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Details</h2>
                <p><strong>Status:</strong> {product.status}</p>
                <p><strong>Version:</strong> {product.version}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Purpose:</strong> {product.purpose}</p>
                <p><strong>Technologies:</strong> {product.technologies}</p>
                <p><strong>Market:</strong> {product.markets}</p>
                <p><strong>Criticality:</strong> {product.criticality}</p>  
                <p><strong>Notes:</strong> {product.notes}</p> 
            </section>  

            <section className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Modules </h2>
                <ul className="list-disc pl-5">
                    {modules.map((m) => <li key={m.id}>{m.name} — {m.status}</li>)}
                </ul>
            </section>

            <section className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Deployments</h2>
                <ul className="list-disc pl-5">
                    {deployments.map((d) => <li key={d.id}>Client Id: {d.client_id} — v{d.version} — {d.status}</li>)}
                </ul>
            </section>

            
            <section className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Team Responsibilities</h2>
                <ul className="list-disc pl-5">
                    {responsibility.map((r) => <li key={r.id}>Team Id: {r.team_id} — {r.description}</li>)}
                </ul>
            </section>
            
        </div>
    );
}