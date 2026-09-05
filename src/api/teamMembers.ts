import api from "./axios";
import { type TeamMember, type CreateTeamMember } from "../types";


export async function getAllTeamMembers(): Promise<TeamMember[]> {
    const res = await api.get<TeamMember[]>("/teammembers");
    return res.data;
}
export async function getTeamMember(id: number): Promise<TeamMember> {
    const res = await api.get<TeamMember>(`/teammembers/${id}`);
    return res.data;
}
export async function createTeamMember(data: CreateTeamMember): Promise<number> {
    const res = await api.post<number>("/teammembers", data);
    return res.data;
}
export async function updateTeamMember(id: number, data: CreateTeamMember): Promise<void> {
    await api.put(`/teammembers/${id}`, data);
}
export async function deleteTeamMember(id: number): Promise<void> {
    await api.delete(`/teammembers/${id}`);
}