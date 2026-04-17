import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterForm";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import SalesPage from "./pages/SalesPage";

import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes avec sidebar */}
        <Route element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>

        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;