import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function LoginWrapper({ setIsAuthenticated }) {
  const navigate = useNavigate();

  return (
    <Login
      setIsAuthenticated={setIsAuthenticated}
      goToRegister={() => navigate("/register")}
    />
  );
}

function RegisterWrapper({ setIsAuthenticated }) {
  const navigate = useNavigate();

  return (
    <Register
      setIsAuthenticated={setIsAuthenticated}
      goToLogin={() => navigate("/")}
    />
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginWrapper setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Register Page */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterWrapper setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Dashboard Page (Protected) */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
