import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";

import MetricCard from "./common/MetricCard";
import TeamSalesChart from "./charts/manager/TeamSalesChart";
import ClientStatusChart from "./charts/manager/ClientStatusChart";

type Props = {
  clients: Client[];
  sales: Sale[];
  appointments: Appointment[];
  currentUserId: number;
};

const formatMoney = (amount: number) =>
  `${amount.toLocaleString("fr-FR")} €`;

// const Metric = ({
//   icon,
//   label,
//   value,
//   color = "primary",
// }: {
//   icon: string;
//   label: string;
//   value: string | number;
//   color?: string;
// }) => (
//   <div className="col-md-3">
//     <div className="card shadow-sm h-100 border-0">
//       <div className="card-body">
//         <div className={`text-${color} mb-2`}>
//           <i className={`bi ${icon} fs-4`} />
//         </div>

//         <small className="text-muted d-block">{label}</small>

//         <div className="fs-4 fw-bold">{value}</div>
//       </div>
//     </div>
//   </div>
// );

const ManagerDashboard = ({
  clients,
  sales,
  appointments,
  currentUserId,
}: Props) => {

  const ownClients = clients.filter(
    client => client.userId === currentUserId
  );

  const ownSales = sales.filter(
    sale => sale.userId === currentUserId
  );

  const ownAppointments = appointments.filter(
    appointment => appointment.userId === currentUserId
  );

  // Activité de l'équipe (hors manager)
  const teamClients = clients.filter(
    client => client.userId !== currentUserId
  );

  const teamSales = sales.filter(
    sale => sale.userId !== currentUserId
  );


  return (
    <>
      <div className="mb-4">
        <h1>Pilotage de l'équipe</h1>

        <p className="text-muted">
          Suivez votre activité et celle de votre équipe.
        </p>
      </div>

      <div className="row g-3 mb-4">

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
            ownSales.reduce(
              (sum, sale) => sum + sale.amount,
              0
            )
          )}
          color="success"
        />

        <MetricCard
          icon="bi-graph-up-arrow"
          label="Mes ventes"
          value={
            ownSales.filter(
              sale => sale.status === "TERMINEE"
            ).length
          }
          color="info"
        />

      </div>

      <h4 className="mt-4 mb-3">
        Activité de l'équipe
      </h4>

      <div className="row g-3 mt-2">

        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{ height: "330px" }}
          >
            <TeamSalesChart sales={teamSales} />
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{ height: "330px" }}
          >
            <ClientStatusChart clients={teamClients} />
          </div>
        </div>

      </div>

    </>
  );
};

export default ManagerDashboard;