import React, { useEffect, useState } from "react";

import type { Client } from "../types/client";
import type { Sale } from "../types/sale";
import type { Appointment } from "../types/appointment";

import DashboardKPI from "../components/dashboard/DashboardKPI";

import { getClients } from "../services/clientService";
import { getSales } from "../services/saleService";
import { getAppointments } from "../services/appointmentService";

import DashboardHighlights from "../components/dashboard/DashboardHighLights";
import AppointmentsChart from "../components/dashboard/charts/AppointmentsChart";
import SalesPipelineChart from "../components/dashboard/charts/SalesPipelineChart";


const DashboardPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, salesData, appointmentsData] = await Promise.all([
          getClients(),
          getSales(),
          getAppointments()
        ]);

        setClients(clientsData);
        setSales(salesData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Erreur chargement dashboard :", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Tableau de bord</h1>

      <DashboardKPI
        clients={clients}
        sales={sales}
        appointments={appointments}
      />

      <div className="mt-4">
        <DashboardHighlights
            clients={clients}
            sales={sales}
            appointments={appointments}
        />
      </div>

      <div className="row g-3">
        {/* RDV CHART */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3" style={{ height: 350 }}>
            <AppointmentsChart appointments={appointments} />
          </div>
        </div>

        {/* SALES PIPELINE CHART */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3" style={{ height: 350 }}>
            <SalesPipelineChart sales={sales} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;