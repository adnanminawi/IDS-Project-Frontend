import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Products } from "./pages/Products";
import { Clients } from "./pages/Clients";
import { Layout } from "./components/Layout"; 
import { ProductDetails } from "./pages/ProductDetails";
import { ClientDetails } from "./pages/ClientDetails";
import { Teams } from "./pages/Team";
import { TeamDetails } from "./pages/TeamDetails";
import { Deployments } from "./pages/Deployments";
import { Users } from "./pages/Users";
import { Dashboard } from "./pages/Dashboard";
import { DeploymentDetails } from "./pages/DeploymentDetails";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/products"
      element={ <ProtectedRoute>
        <Layout>
            <Products />
        </Layout>
    </ProtectedRoute>}/>

        <Route path="/clients"
      element={ <ProtectedRoute>
        <Layout>
            <Clients />
        </Layout>
    </ProtectedRoute>}/>

    <Route path="/deployments" element={
    <ProtectedRoute><Layout><Deployments /></Layout></ProtectedRoute>
    } />

    <Route path="/teams" element={
    <ProtectedRoute><Layout><Teams /></Layout></ProtectedRoute>
    } />
    <Route path="/users" element={
    <ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>
} />
<Route path="/" element={
    <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
} />

    <Route path="/products/:id" element={
    <ProtectedRoute>
        <Layout>
            <ProductDetails />
        </Layout>
    </ProtectedRoute>
    } />

    <Route path="/clients/:id" element={
    <ProtectedRoute>
        <Layout>
            <ClientDetails />
        </Layout>
    </ProtectedRoute>
    } />


    <Route path="/teams/:id" element={
    <ProtectedRoute><Layout><TeamDetails /></Layout></ProtectedRoute>
    } />

<Route path="/deployments/:id" element={
    <ProtectedRoute><Layout><DeploymentDetails /></Layout></ProtectedRoute>
} />
    </Routes>
  );
}

export default App;