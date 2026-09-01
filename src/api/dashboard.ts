import api from "./axios";
import { type DashboardStats } from "../types";

export async function getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>("/dashboard");
    return res.data;
}