import React from "react";
import type { Sale } from "../../types/sale";

interface Props {
  sales: Sale[];
  totalCommission: number;
}

const SalesKPI: React.FC<Props> = ({ totalCommission }) => {
    return (
    <div className="row mb-4">
        <div className="alert alert-success d-flex justify-content-between align-items-center">
        <span>💸 Commission totale</span>
        <strong>{totalCommission} €</strong>
      </div>
      {/* <div className="alert alert-success shadow-sm rounded-4 d-flex justify-content-between">
        <div>
          <div className="small text-muted">Commission totale</div>
          <div className="fs-5 fw-bold">{totalCommission} €</div>
        </div>
        <div className="fs-3">💸</div>
      </div> */}
    </div>
    );
};

export default SalesKPI;