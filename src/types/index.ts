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