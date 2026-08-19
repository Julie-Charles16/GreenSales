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
  showHeader?: boolean;
};

const formatMoney = (amount: number) =>
  `${amount.toLocaleString("fr-FR")} €`;

const CommercialDashboard = ({
  clients,
  sales,
  appointments,
  currentUserId,
  showHeader = true,
}: Props) => {

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
      {showHeader && (
        <PageHeader
          title="Mon activité commerciale"
          subtitle="Gardez un œil sur vos prospects, rendez-vous et ventes."
        />
      )}

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
            ownSales
              .filter((sale) => sale.status === "TERMINEE")
              .reduce((sum, sale) => sum + sale.amount, 0)
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
          clients={ownClients}
          sales={ownSales}
          appointments={ownAppointments}
        />
      </div>

      <div className="mt-4">
        <div className="row g-3">
          {/* RDV CHART */}
          <div className="col-md-6">
            <div className="card shadow-sm p-3" style={{ height: 350 }}>
              <AppointmentsChart appointments={ownAppointments} />
            </div>
          </div>

          {/* SALES PIPELINE CHART */}
          <div className="col-md-6">
            <div className="card shadow-sm p-3" style={{ height: 350 }}>
              <SalesPipelineChart sales={ownSales} />
            </div>
          </div>
        </div>
      </div>
    </div>
      
    </>
  );
};

export default CommercialDashboard;