import { useState } from "react";

import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";

import PageHeader from "../common/PageHeader";
import MetricCard from "../common/MetricCard";
import TeamSalesChart from "./charts/manager/TeamSalesChart";
import ClientStatusChart from "./charts/manager/ClientStatusChart";
import CommercialDashboard from "./CommercialDashboard";

type Props = {
  clients: Client[];
  sales: Sale[];
  appointments: Appointment[];
  currentUserId: number;
};

const formatMoney = (amount: number) =>
  `${amount.toLocaleString("fr-FR")} €`;

const ManagerDashboard = ({
  clients,
  sales,
  appointments,
  currentUserId,
}: Props) => {

  const [activeTab, setActiveTab] = useState<"mine" | "team">("mine");

  const teamClients = clients.filter(
    client => client.userId !== currentUserId
  );

  const teamSales = sales.filter(
    sale => sale.userId !== currentUserId
  );

  const teamAppointments = appointments.filter(
    appointment => appointment.userId !== currentUserId
  );

  return (
    <>
      <PageHeader
        title={
          activeTab === "mine"
            ? "Mon activité commerciale"
            : "Pilotage de l'équipe"
        }
        subtitle={
          activeTab === "mine"
            ? "Gardez un œil sur vos prospects, rendez-vous et ventes."
            : "Suivez les performances et l'activité de votre équipe."
        }
        view={activeTab}
        setView={setActiveTab}
        views={[
          {
            value: "mine",
            label: "Mon activité",
          },
          {
            value: "team",
            label: "Mon équipe",
          },
        ]}
      />


      {/* MON ACTIVITÉ */}

      {activeTab === "mine" && (
        <CommercialDashboard
          clients={clients}
          sales={sales}
          appointments={appointments}
          currentUserId={currentUserId}
          showHeader={false}
        />
      )}

      {/* MON ÉQUIPE */}

      {activeTab === "team" && (
        <>
          <div className="row g-3 mb-4">

            <MetricCard
              icon="bi-people"
              label="Clients de l'équipe"
              value={teamClients.length}
            />

            <MetricCard
              icon="bi-calendar-event"
              label="Rendez-vous de l'équipe"
              value={teamAppointments.length}
              color="warning"
            />

            <MetricCard
              icon="bi-cash-stack"
              label="CA de l'équipe"
              value={formatMoney(
                teamSales
                  .filter((sale) => sale.status === "TERMINEE")
                  .reduce(
                    (sum, sale) => sum + sale.amount,
                    0
                  )
              )}
              color="success"
            />

            <MetricCard
              icon="bi-graph-up-arrow"
              label="Ventes finalisées"
              value={
                teamSales.filter(
                  (sale) => sale.status === "TERMINEE"
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
      )}
    </>
  );
};

export default ManagerDashboard;