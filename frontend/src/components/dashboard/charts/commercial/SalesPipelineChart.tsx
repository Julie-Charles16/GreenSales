import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { Sale } from "../../../types/sale";

interface Props {
  sales: Sale[];
}

const SalesPipelineChart: React.FC<Props> = ({ sales }) => {
  const data = useMemo(() => {
    const totals = {
      EN_ATTENTE: { amount: 0, commission: 0 },
      TERMINEE: { amount: 0, commission: 0 },
      ANNULEE: { amount: 0, commission: 0 },
    };

    sales.forEach((sale) => {
      const status = sale.status as keyof typeof totals;

      if (totals[status]) {
        totals[status].amount += sale.amount;
        totals[status].commission += sale.commission;
      }
    });

    return [
      {
        status: "En attente",
        amount: totals.EN_ATTENTE.amount,
        commission: totals.EN_ATTENTE.commission,
      },
      {
        status: "Terminée",
        amount: totals.TERMINEE.amount,
        commission: totals.TERMINEE.commission,
      },
      {
        status: "Annulée",
        amount: totals.ANNULEE.amount,
        commission: totals.ANNULEE.commission,
      },
    ];
  }, [sales]);

  return (
    <div style={{ width: "100%", height: 300 }}>
        <h6 className="mb-3">Pipeline des ventes (CA & Commission)</h6>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="status" />
          <YAxis />

          <Tooltip
            formatter={(value) =>
              `${Number(value).toLocaleString()} €`
            }
          />

          <Legend />

          {/* CA */}
          <Bar dataKey="amount" fill="#0d6efd" name="Chiffre d'affaires" />

          {/* Commission */}
          <Bar dataKey="commission" fill="#198754" name="Commission" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPipelineChart;