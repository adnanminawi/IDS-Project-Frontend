import api from "./axios";
import { type Deployment, type CreateDeployment, type Module, type DeploymentEnvironment  } from "../types";

export async function getDeployments(): Promise<Deployment[]> {
    const res = await api.get<Deployment[]>("/deployments");
    return res.data;
}
export async function getDeployment(id: number): Promise<Deployment> {
    const res = await api.get<Deployment>(`/deployments/${id}`);
    return res.data;
}
export async function createDeployment(data: CreateDeployment): Promise<number> {
    const res = await api.post<number>("/deployments", data);
    return res.data;
}
export async function updateDeployment(id: number, data: CreateDeployment): Promise<void> {
    await api.put(`/deployments/${id}`, data);
}
export async function deleteDeployment(id: number): Promise<void> {
    await api.delete(`/deployments/${id}`);
}
export async function getDeploymentEnvironments(id: number): Promise<DeploymentEnvironment[]> {
    const res = await api.get<DeploymentEnvironment[]>(`/deployments/${id}/environments`);
    return res.data;
}
export async function getDeploymentModules(id: number): Promise<Module[]> {
    const res = await api.get<Module[]>(`/deployments/${id}/modules`);
    return res.data;
}