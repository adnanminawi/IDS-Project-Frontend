    import api from "./axios";
    import { type Team, type TeamMember, type CreateTeam} from "../types";

export async function getTeams(): Promise<Team[]> {
    const res = await api.get<Team[]>("/teams");
    return res.data;
}
export async function getTeam(id: number): Promise<Team> {
    const res = await api.get<Team>(`/teams/${id}`);
    return res.data;
}
export async function createTeam(data: CreateTeam): Promise<number> {
    const res = await api.post<number>("/teams", data);
    return res.data;
}
export async function updateTeam(id: number, data: CreateTeam): Promise<void> {
    await api.put(`/teams/${id}`, data);
}
export async function deleteTeam(id: number): Promise<void> {
    await api.delete(`/teams/${id}`);
}
export async function getTeamMembers(id: number): Promise<TeamMember[]> {
    const res = await api.get<TeamMember[]>(`/teams/${id}/members`);
    return res.data;
}
