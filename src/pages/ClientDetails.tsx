import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Client, Deployment} from "../types";
import { getClient, getClientDeployment } from "../api/clients";


export function ClientDetails(){
    const {id} = useParams();
    const clientId= Number(id);


    const[client, setClient] = useState<Client |null>(null);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        async function load() {
            const cli = await getClient(clientId);
            const dep = await getClientDeployment(clientId);
            

            setClient(cli);
            setDeployments(dep);
            setLoading(false);
        }
        load();
    },[clientId]);

     if (loading) return <p className="p-6">Loading...</p>;
    if (!client) return <p className="p-6">Client not found.</p>;
    
    
    return(
      <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">{client.name}</h1>

            <section className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Details</h2>
                <p><strong>Status:</strong> {client.status}</p>
                <p><strong>Contact:</strong> {client.contact}</p>
                <p><strong>Country:</strong> {client.country}</p>
                <p><strong>Notes:</strong> {client.notes}</p>
               
                
            </section>  

            <section className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold mb-2">Deployments</h2>
                <ul className="list-disc pl-5">
                    {deployments.map((d) => <li key={d.id}>Client Id: {d.client_id} — v{d.version} — {d.status}</li>)}
                </ul>
            </section>
            
        </div>
    );
}