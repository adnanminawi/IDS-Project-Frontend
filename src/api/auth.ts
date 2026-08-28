import api from "./axios";
import type { LoginResponse } from "../types";

export async function  login(username : string ,  password: string): Promise <LoginResponse>{
    const res = await api.post<LoginResponse>("/auth/login", {username,password});
    return res.data;
}   