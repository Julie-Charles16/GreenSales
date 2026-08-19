import { useNavigate } from "react-router-dom";
import PageHeader from "../common/PageHeader";
import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";
import type { User } from "../../types/user";

import MetricCard from "../common/MetricCard";
import UserRoleChart from "./charts/admin/UserRoleChart";
import ActivityOverviewChart from "./charts/admin/ActivityOverviewChart";

type Props = {
  clients: Client[];
  sales: Sale[];
  appointments: Appointment[];
 users: User[];};

const formatMoney = (amount: number) =>
  `${amount.toLocaleString("fr-FR")} €`;

const AdminDashboard = ({
  clients,
  sales,
  appointments,
  users,
}: Props) => {

  const navigate = useNavigate();
  
  const today = new Date().toISOString().slice(0, 10);

  const todayAppointments = appointments.filter(
    (a) => a.date?.slice(0, 10) === today
  ).length;


  return (
    <>
      <PageHeader
        title="Administration"
        subtitle="Vue globale de la plateforme GreenSales."
        actions={[
          {
            label: "Gérer les utilisateurs",
            icon: "bi-people-fill",
            variant: "btn-dark",
            onClick: () => navigate("/users"),
          },
        ]}
      />

      <div className="row g-3 mb-4">

        <MetricCard
          icon="bi-people"
          label="Utilisateurs"
          value={users.length}
          color="dark"
        />

        <MetricCard
          icon="bi-person-vcard"
          label="Clients"
          value={clients.length}
          color="info"
        />

        <MetricCard
          icon="bi-cash-stack"
          label="CA global"
          value={formatMoney(
            sales.reduce((sum, sale) => sum + sale.amount, 0)
          )}
          color="success"
        />

        <MetricCard
          icon="bi-calendar-event"
          label="RDV aujourd'hui"
          value={todayAppointments}
          color="warning"
        />

      </div>

      <div className="row g-3 mt-2">

        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{ height: "330px" }}
          >
            <UserRoleChart users={users} />
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card shadow-sm p-3"
            style={{ height: "330px" }}
          >
            <ActivityOverviewChart
              clientsCount={clients.length}
              appointmentsCount={appointments.length}
              salesCount={sales.length}
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default AdminDashboard;