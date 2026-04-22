import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterForm";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import SalesPage from "./pages/SalesPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  return (
    <Routes>

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  );
};

export default App;