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
  <div className="d-flex justify-content-center">
    
    <div
      className="d-flex gap-5 overflow-auto pb-4 px-4"
      style={{
        maxWidth: "100%",
        alignItems: "flex-start",
      }}
    >
      {statuses.map((status) => {
        const columnSales = sales.filter((s) => s.status === status);

        return (
          <div
            key={status}
            className="rounded-4 p-4 shadow-sm"
            style={{
              minWidth: "380px",
              backgroundColor: getColumnColor(status),
            }}
          >
            {/* HEADER COLONNE */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 fs-6">{status}</h6>

              <small className="text-muted d-block mb-2">
                {columnSales.length} vente(s)
              </small>

              <div className="fw-bold fs-5">
                <i className="bi bi-cash-stack me-1"></i>
                {getTotalByStatus(status)} €
              </div>

              <div className="fw-bold text-success fs-6 mt-1">
                <i className="bi bi-cash-coin me-1"></i>
                {getCommissionByStatus(status)} €
              </div>
            </div>

            {/* CARDS */}
            <div className="d-flex flex-column gap-4">
              {columnSales.map((sale) => (
                <div
                  key={sale.id}
                  className="card border-0 shadow-sm rounded-4 p-4"
                >
                  <div className="fw-bold fs-6 mb-1">
                    {getClientName(sale.clientId)}
                  </div>

                  <small className="text-muted d-block mb-2">
                    {getProject(sale.clientId)}
                  </small>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fw-semibold fs-5">
                      {sale.amount} €
                    </span>

                    <span className="badge bg-success px-3 py-2">
                      +{sale.commission} €
                    </span>
                  </div>

                  <small className="text-muted d-block mt-2">
                    {formatDate(sale.signedAt)}
                  </small>

                  {/* ACTIONS */}
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(sale)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(sale)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}

              {columnSales.length === 0 && (
                <div className="text-muted text-center small py-4">
                  Aucune vente
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>

  </div>
);
};

export default SalesPipeline;