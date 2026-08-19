import React, { useMemo } from "react";
import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";
import { getClientStatusColor, getSaleStatusColor } from "../../utils/statusColors";

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
  
  const todayAppointments = useMemo(() => {
    const now = new Date();

    const today = now.toLocaleDateString("fr-FR", {
      timeZone: "Europe/Paris",
    });

    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);

        return (
          appointmentDate.toLocaleDateString("fr-FR", {
            timeZone: "Europe/Paris",
          }) === today
        );
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const now = new Date();

    return todayAppointments.find(
      (appointment) =>
        new Date(appointment.date).getTime() >= now.getTime()
    );
  }, [todayAppointments]);

  const lastClient = useMemo(() => {
    return [...clients].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )[0];
  }, [clients]);

  const appointmentClient = useMemo(() => {
    if (!nextAppointment) return undefined;

    return clients.find(
      (client) => client.id === nextAppointment.clientId
    );
  }, [clients, nextAppointment]);

  const lastSale = useMemo(() => {
    return [...sales].sort(
      (a, b) =>
        new Date(b.signedAt).getTime() -
        new Date(a.signedAt).getTime()
    )[0];
  }, [sales]);

  const getClientStatusBadge = (status?: string) => {
    if (!status) return null;

    return (
      <span className={`badge bg-${getClientStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  const getSaleStatusBadge = (status?: string) => {
    if (!status) return null;

    return (
      <span className={`badge bg-${getSaleStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="row mb-4">

      {/* ================= RDV DU JOUR ================= */}
      <div className="col-md-4">
        <div className="card p-2 shadow-sm h-100">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 d-flex align-items-center">
              <i className="bi bi-calendar-event me-2 fs-5 text-primary" />
              RDV du jour
            </h6>

            <span className="badge bg-primary">
              {todayAppointments.length}
            </span>
          </div>

          {nextAppointment ? (
            <>
              <div className="fw-semibold">
                {nextAppointment.client
                  ? `${nextAppointment.client.firstName} ${nextAppointment.client.name}`
                  : `Client #${nextAppointment.clientId}`}
              </div>

              <small className="text-muted d-block mb-2">
                à{" "}
                {new Date(nextAppointment.date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Europe/Paris",
                })}
              </small>

              <small className="text-muted">
                <i className="bi bi-geo-alt me-1"></i>
                {appointmentClient?.address || "Adresse inconnue"}
                {appointmentClient?.city
                  ? `, ${appointmentClient.city}`
                  : ""}
              </small>
            </>
          ) : todayAppointments.length > 0 ? (
            <p className="text-muted mb-0">
              Tous les RDV du jour sont terminés
            </p>
          ) : (
            <p className="text-muted mb-0">
              Aucun RDV aujourd’hui
            </p>
          )}
        </div>
      </div>

      {/* ================= NOUVEAU CLIENT ================= */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm h-100">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 d-flex align-items-center">
              <i className="bi bi-person-plus me-2 fs-5 text-info" />
              Nouveau client
            </h6>

            {lastClient && getClientStatusBadge(lastClient.status)}
          </div>

          {lastClient ? (
            <>
              <div className="fw-semibold">
                {lastClient.firstName} {lastClient.name}
              </div>

              <small className="text-muted">
                {lastClient.projectType || "Projet non défini"}
              </small>
            </>
          ) : (
            <p className="text-muted mb-0">Aucun client</p>
          )}
        </div>
      </div>

      {/* ================= DERNIÈRE VENTE ================= */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm h-100">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 d-flex align-items-center">
              <i className="bi bi-cash-stack me-2 fs-5 text-success" />
              Dernière vente
            </h6>

            {lastSale && getSaleStatusBadge(lastSale.status)}
          </div>

          {lastSale ? (
            (() => {
              const client = clients.find(c => c.id === lastSale.clientId);

              return (
                <>
                  <div className="fw-semibold">
                    {client
                      ? `${client.firstName} ${client.name}`
                      : `Client #${lastSale.clientId}`}
                  </div>

                  <h5 className="mb-1">{lastSale.amount} €</h5>

                  <small className="text-muted">
                    Commission : {lastSale.commission} €
                  </small>
                </>
              );
            })()
          ) : (
            <p className="text-muted mb-0">Aucune vente</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardHighlights;