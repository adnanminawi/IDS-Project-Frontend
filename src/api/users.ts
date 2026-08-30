import api from "./axios";
import { type User, type CreateUser } from "../types";

export async function getUsers(): Promise<User[]> {
    const res = await api.get<User[]>("/users");
    return res.data;
}
export async function createUser(data: CreateUser): Promise<number> {
    const res = await api.post<number>("/users", data);
    return res.data;
}
export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
}