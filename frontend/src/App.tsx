import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterForm";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import SalesPage from "./pages/SalesPage";

import { useAuth } from "./context/useAuth";

const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      {token && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={<PrivateRoute><DashboardPage /></PrivateRoute>}
        />

        <Route
          path="/clients"
          element={<PrivateRoute><ClientsPage /></PrivateRoute>}
        />

        <Route
          path="/sales"
          element={<PrivateRoute><SalesPage /></PrivateRoute>}
        />

        <Route
          path="/appointments"
          element={<PrivateRoute><AppointmentsPage /></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;