import React from "react";
import type { Sale } from "../../types/sale";
import type { Client } from "../../types/client";

type Props = {
  sales: Sale[];
  clients: Client[];
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
};

const SalesPipeline: React.FC<Props> = ({
  sales,
  clients,
  onEdit,
  onDelete,
}) => {
  const statuses = Array.from(new Set(sales.map((s) => s.status)));

  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} ${client.firstName}` : "Client inconnu";
  };

  const getProject = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.projectType || "Non défini";
  };

  const getTotalByStatus = (status: string) => {
    return sales
      .filter((s) => s.status === status)
      .reduce((acc, s) => acc + s.amount, 0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
  };

  const getColumnColor = (status: string) => {
  switch (status) {
    case "EN_ATTENTE":
      return "#f1f3f5";
    case "ANNULEE":
      return "#ffe3e3";
    case "TERMINEE":
      return "#e6fcf5";
    default:
      return "#f8f9fa";
  }
};

const getCommissionByStatus = (status: string) => {
  return sales
    .filter((s) => s.status === status)
    .reduce((acc, s) => acc + s.commission, 0);
};

  return (
    <div className="d-flex gap-3 overflow-auto pb-3">
      {statuses.map((status) => {
        const columnSales = sales.filter((s) => s.status === status);

        return (
          <div
            key={status}
            className="rounded-4 p-3 shadow-sm"
            style={{
            minWidth: "300px",
            backgroundColor: getColumnColor(status),
            }}
          >
            {/* HEADER COLONNE */}
            <div className="mb-3">
              <h6 className="fw-bold mb-1">{status}</h6>
              <small className="text-muted">
                {columnSales.length} vente(s)
              </small>
              <div className="fw-bold">
                💰 {getTotalByStatus(status)} €
              </div>
              <div className="fw-bold text-success">
                💸 {getCommissionByStatus(status)} €
              </div>
            </div>

            {/* CARDS */}
            <div className="d-flex flex-column gap-2">
              {columnSales.map((sale) => (
                <div
                  key={sale.id}
                  className="card border-0 shadow-sm rounded-4 p-3 card-column-hover"
                  style={{ cursor: "pointer" }}
                >
                  <div className="fw-bold">
                    {getClientName(sale.clientId)}
                  </div>

                  <small className="text-muted">
                    {getProject(sale.clientId)}
                  </small>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fw-semibold">💰 {sale.amount} €</span>
                    <span className="badge bg-success">
                      +{sale.commission}€
                    </span>
                  </div>

                  <small className="text-muted">
                    {formatDate(sale.signedAt)}
                  </small>

                  {/* ACTIONS */}
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(sale)}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(sale)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {columnSales.length === 0 && (
                <div className="text-muted text-center small">
                  Aucune vente
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SalesPipeline;