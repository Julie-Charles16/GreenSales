import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import SalesPage from "./pages/SalesPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>Accueil</h1>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/sales" element={<SalesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;