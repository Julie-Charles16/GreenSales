import { useNavigate } from "react-router-dom";
import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";

import PageHeader from "../common/PageHeader";
import MetricCard from "../common/MetricCard";
import AppointmentsChart from "./charts/commercial/AppointmentsChart";
import SalesPipelineChart from "./charts/commercial/SalesPipelineChart";
import DashboardHighlights from "./DashboardHighLights";

type Props = {
  clients: Client[];
  sales: Sale[];
  appointments: Appointment[];
  currentUserId: number;
};

const formatMoney = (amount: number) =>
  `${amount.toLocaleString("fr-FR")} €`;

const CommercialDashboard = ({
  clients,
  sales,
  appointments,
  currentUserId,
}: Props) => {

  const navigate = useNavigate();

  const ownClients = clients.filter(
    (client) => client.userId === currentUserId
  );

  const ownSales = sales.filter(
    (sale) => sale.userId === currentUserId
  );

  const ownAppointments = appointments.filter(
    (appointment) => appointment.userId === currentUserId
  );

  return (
    <>
      {/* <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4"> */}
      <PageHeader
        title="Mon activité commerciale"
        subtitle="Gardez un œil sur vos prospects, rendez-vous et ventes."
        actions={[
          {
            label: "Nouveau client",
            icon: "bi-person-plus",
            variant: "btn-outline-primary",
            onClick: () => navigate("/clients"),
          },
          {
            label: "Nouveau RDV",
            icon: "bi-calendar-plus",
            variant: "btn-primary",
            onClick: () => navigate("/appointments"),
          },
        ]}
      />

      <div className="row g-2 mb-6">

        <MetricCard
          icon="bi-person-vcard"
          label="Mes clients"
          value={ownClients.length}
        />

        <MetricCard
          icon="bi-calendar-event"
          label="Mes rendez-vous"
          value={ownAppointments.length}
          color="warning"
        />

        <MetricCard
          icon="bi-cash-stack"
          label="Mon chiffre d'affaires"
          value={formatMoney(
            ownSales.reduce((sum, sale) => sum + sale.amount, 0)
          )}
          color="success"
        />

        <MetricCard
          icon="bi-graph-up-arrow"
          label="Ventes finalisées"
          value={
            ownSales.filter(
              (sale) => sale.status === "TERMINEE"
            ).length
          }
          color="info"
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
      
    </>
  );
};

export default CommercialDashboard;