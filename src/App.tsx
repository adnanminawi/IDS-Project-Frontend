import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Products } from "./pages/Products";
import { Clients } from "./pages/Clients";
import { Layout } from "./components/Layout"; 
import { ProductDetails } from "./pages/ProductDetails";
import { ClientDetails } from "./pages/ClientDetails";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>Dashboard placeholder — you're logged in!</div>
          </ProtectedRoute>
        }
      />

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
    </Routes>
  );
}

export default App;