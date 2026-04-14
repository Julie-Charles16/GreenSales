import React, { useMemo } from "react";
import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";

interface Props {
  clients: Client[];
  sales: Sale[];
  appointments: Appointment[];
}

const DashboardHighlights: React.FC<Props> = ({
  clients,
  sales,
  appointments,
}) => {
  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);
  // RDV du jour
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.date.startsWith(today));
  }, [appointments, today]);

  // Dernier client
  const lastClient = useMemo(() => {
    return [...clients].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )[0];
  }, [clients]);

  // Dernière vente
  const lastSale = useMemo(() => {
    return [...sales].sort(
      (a, b) =>
        new Date(b.signedAt).getTime() -
        new Date(a.signedAt).getTime()
    )[0];
  }, [sales]);

  return (
    <div className="row mb-4">

      {/* RDV du jour */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm h-100">
          <h6>📅 RDV du jour</h6>

          {todayAppointments.length > 0 ? (
            <>
            <h4>{todayAppointments.length}</h4>

              <small>
                Prochain RDV :{" "}
                <strong>
                  {todayAppointments[0].client
                    ? `${todayAppointments[0].client.firstName} ${todayAppointments[0].client.name}`
                    : `Client #${todayAppointments[0].clientId}`}
                </strong>{" "}
                à{" "}
                {todayAppointments[0].date.split("T")[1].slice(0, 5)}
              </small>

              <p className="mb-3">
              <i className="bi bi-geo-alt me-2"></i>
              {lastClient.address || "Adresse inconnue"}
              {lastClient.city ? `, ${lastClient.city}` : ""}
            </p>
            </>
          ) : (
            <p className="text-muted">Aucun RDV aujourd’hui</p>
          )}
        </div>
      </div>

      {/* Dernier client */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm h-100">
          <h6>👤 Dernier client</h6>

          {lastClient ? (
            <>
              <h5>
                {lastClient.firstName} {lastClient.name}
              </h5>
              <small className="text-muted">
                {lastClient.status}
              </small>
              <small className="text-muted">
                {lastClient.projectType}
              </small>
            </>
          ) : (
            <p className="text-muted">Aucun client</p>
          )}
        </div>
      </div>

      {/* Dernière vente */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm h-100">
          <h6>💰 Dernière vente</h6>
          <div className="mt-2">
          <span className="badge bg-success">
          Gagné
          </span>
          </div>

          {lastSale ? (
            (() => {
                const client = clients.find(c => c.id === lastSale.clientId);

                return (
                <>
                    <strong>
                        {client
                        ? `${client.firstName} ${client.name}`
                        : `Client #${lastSale.clientId}`}
                    </strong>
                    <h5>{lastSale.amount} €</h5>


                    <div className="mt-2">
                    </div>

                    <small className="text-muted">
                    Commission : {lastSale.commission} €
                    </small>
                </>
                );
            })()
            ) : (
            <p className="text-muted">Aucune vente</p>
            )}
        </div>
      </div>

    </div>
  );
};

export default DashboardHighlights;