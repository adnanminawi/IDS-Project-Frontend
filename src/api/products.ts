        import api from "./axios";
        import { type Product , type CreateProduct, type Module, type Deployment, type Responsibility, type Documentation, type Repository, type CreateResponsibility, type CreateModule } from "../types";

        export async function getProducts(): Promise<Product[]> {
            const res = await api.get<Product[]>("/products");
            return res.data;    
        }
        export async function getProduct(id:number): Promise<Product> {
            const res = await api.get<Product>(`/products/${id}`);
            return res.data;
        }   
        export async function createProduct(data: CreateProduct ): Promise<number> {
            const res = await api.post<number>("/products", data);
            return res.data;
        }
        export async function updateProduct(id:number, data:CreateProduct): Promise<void> {
            await api.put(`/products/${id}`, data);
        }
        export async function deleteProduct(id:number):Promise<void> {
            await api.delete(`/products/${id}`);
        }
        export async function getProductModules(id:number): Promise<Module[]> {
            const res = await api.get<Module[]>(`/products/${id}/modules`);
            return res.data;
        }
        export async function getProductDeployments(id:number): Promise<Deployment[]> {
            const res = await api.get<Deployment[]>(`/products/${id}/deployments`);
            return res.data;        
        }
        export async function getProductResponsibilities(id:number): Promise<Responsibility[]> {
            const res = await api.get<Responsibility[]>(`/products/${id}/responsibilities`);
            return res.data;
        }
        export async function getProductDocumentation(id:number): Promise<Documentation[]> {
            const res = await api.get<Documentation[]>(`/products/${id}/documentations`);
            return res.data;
        }
        export async function getProductRepositories(id:number): Promise<Repository[]> {
            const res = await api.get<Repository[]>(`/products/${id}/repositories`);
            return res.data;
        }
        export async function assignTeam(id: number , data : CreateResponsibility): Promise<number> {
            const res = await api.post<number>(`/products/${id}/responsibilities`, data);
            return res.data;
        }
        export async function createModule(productId: number, data: CreateModule): Promise<number> {
            const res = await api.post<number>(`/products/${productId}/modules`, data);
            return res.data;
        }