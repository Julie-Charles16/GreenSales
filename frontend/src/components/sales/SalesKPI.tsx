import React, { useMemo } from "react";
import type { Sale } from "../../types/sale";

interface Props {
  sales: Sale[];
}

const SalesKPI: React.FC<Props> = ({ sales }) => {
  // ======================
  // KPI CALCULS
  // ======================

  const totalSales = sales.length;

  const completedSales = useMemo(() => {
    return sales.filter((s) => s.status === "TERMINEE").length;
  }, [sales]);

  const totalRevenue = useMemo(() => {
    return sales
      .filter((s) => s.status === "TERMINEE")
      .reduce((acc, s) => acc + s.amount, 0);
  }, [sales]);

  const totalCommission = useMemo(() => {
    return sales
      .filter((s) => s.status === "TERMINEE")
      .reduce((acc, s) => acc + s.commission, 0);
  }, [sales]);

  const conversionRate = totalSales
    ? Math.round((completedSales / totalSales) * 100)
    : 0;

  return (
    <div className="row mb-4">

      {/* CA */}
      <div className="col-md-3">
        <div className="card p-3 shadow-sm h-100">
          <div className="text-muted small mb-1">
            <i className="bi bi-currency-euro me-1"></i> Chiffre d'affaires
          </div>
          <h4 className="mb-0">
            {totalRevenue.toLocaleString("fr-FR")} €
          </h4>
        </div>
      </div>

      {/* TOTAL VENTES */}
      <div className="col-md-3">
        <div className="card p-3 shadow-sm h-100">
          <div className="text-muted small mb-1">
            <i className="bi bi-receipt me-1"></i> Total ventes
          </div>
          <h4 className="mb-0">{totalSales}</h4>
        </div>
      </div>

      {/* VENTES TERMINÉES */}
      <div className="col-md-3">
        <div className="card p-3 shadow-sm h-100">
          <div className="text-muted small mb-1">
            <i className="bi bi-check-circle me-1 text-success"></i> Terminées
          </div>
          <h4 className="mb-0">{completedSales}</h4>
        </div>
      </div>

      {/* COMMISSION */}
      <div className="col-md-3">
        <div className="card p-3 shadow-sm h-100 bg-light">
          <div className="text-muted small mb-1">
            <i className="bi bi-cash-coin me-1 text-success"></i> Commission
          </div>
          <h4 className="mb-0 text-success">
            {totalCommission.toLocaleString("fr-FR")} €
          </h4>

          <small className="text-muted">
            Conversion : {conversionRate} %
          </small>
        </div>
      </div>

    </div>
  );
};

export default SalesKPI;