    import api from "./axios";
    import { type Client, type CreateClient, type Deployment} from "../types";


    export async function getClients():Promise<Client[]> {
        const res = await api.get<Client[]>("/clients");
        return res.data;        
    }
    export async function getClient(id:number): Promise<Client> {
        const res = await api.get<Client>(`/clients/${id}`);
        return res.data;
    }
    export async function createClient(data : CreateClient): Promise<number>{
        const res = await api.post<number>("/clients", data);
        return res.data;
    }
    export async function updateClient(id:number ,data : CreateClient): Promise<void>{
        await api.put(`/clients/${id}`, data);
    }
    export async function deleteClient(id:number):Promise<void> {
        await api.delete(`/clients/${id}`);
    }
    export async function getClientDeployment(id:number): Promise <Deployment[]> {
        const res = await api.get<Deployment[]>(`/clients/${id}/deployments`);
        return res.data;
        
    }
