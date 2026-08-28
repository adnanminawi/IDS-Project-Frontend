import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
    </Routes>
  );
}

export default App;