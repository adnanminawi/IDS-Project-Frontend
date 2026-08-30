export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  purpose?: string;
  status?: string;
  version?: string;
  markets?: string;
  criticality?: string;
  technologies?: string;
  notes?: string;
}
export interface Client{
  id: number;
  name:string;
  country?: string;
  contact?: string;
  status?: string;
  notes?: string;
}

export interface Module{
  id: number;
  product_id : number;
  name: string;
  description?: string;
  status?: string;
}
export interface Responsibility {
  id: number;
  product_id: number;
  team_id: number;
  role?: string;
  description?: string;
}
export interface Documentation {
  id: number;
  product_id: number;
  name?: string;
  type?: string;
  description?: string;
  url?: string;
  lastUpdatedDate?: string;
}
export interface Repository {
  id: number;
  product_id: number;
  name?: string;
  url?: string;
  branch?: string;
  description?: string;
}
export interface Team{
  id :number;
  name : string;
}
export interface TeamMember{
  id : number;
  name : string;
  job?: string;
  department?: string;
  email?: string;
  status?: string;
  team_id?: number;
  roleInTeam?: string;
}
export interface Deployment {
  id: number;
  client_id: number;
  product_id: number;
  version?: string;
  goLiveDate?: string;
  status?: string;
  supportTier?: string;
  clientNotes?: string;
}

export interface User{
  id: number;
  username: string;
  role : string;
  isActive : boolean;
}
export interface CreateClient{
  name:string;
  country?: string;
  contact?: string;
  status?: string;
  notes?: string;
}
export interface CreateProduct{
  name: string;
  description?: string;
  purpose?: string;
  status?: string;
  version?: string;
  markets?: string;
  criticality?: string;
  technologies?: string;
  notes?: string;
}
export interface CreateTeam {
  name: string;
}
export interface CreateTeamMember {
  name: string;
  job?: string;
  department?: string;
  email?: string;
  status?: string;
  team_id?: number;
  roleInTeam?: string;
}
export interface CreateDeployment {
  client_id: number;
  product_id: number;
  version?: string;
  goLiveDate?: string;
  status?: string;
  supportTier?: string;
  clientNotes?: string;
}
export interface CreateUser{
  username : string;
  password : string;
  role : string;
  isActive : boolean;
}