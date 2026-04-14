import React from "react";
import type { Client } from "../../types/client";
import type { Sale } from "../../types/sale";
import type { Appointment } from "../../types/appointment";

interface Props {
  clients: Client[];
  sales: Sale[];
  appointments: Appointment[];
}

const DashboardKPI: React.FC<Props> = ({ clients, sales }) => {

const totalClients = clients.length;

const signedClients = clients.filter(c => c.status === "SIGNE").length;

const conversionRate = totalClients
? Math.round((signedClients / totalClients) * 100)
: 0;

const totalRevenue = sales.reduce(
  (sum, sale) => sum + sale.amount,
  0
);const totalCommission = sales.reduce(
(sum, sale) => sum + sale.commission,
0
);

  return (
    <div className="row mb-4">

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Clients</h6>
          <h4>{totalClients}</h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Chiffre d'Affaires</h6>
          <h4>{totalRevenue.toLocaleString()} €</h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Commission</h6>
          <h4>{totalCommission} €</h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <h6>Conversion</h6>
          <h4>{conversionRate} %</h4>
        </div>
      </div>

    </div>
  );
};

export default DashboardKPI;