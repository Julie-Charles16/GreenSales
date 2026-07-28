import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

import type { Sale } from "../../../types/sale";

interface Props {
  sales: Sale[];
}

const TeamSalesChart: React.FC<Props> = ({ sales }) => {

  const data = useMemo(() => {

    const totals: Record<string, number> = {};

    sales.forEach((sale) => {

      // En attendant d'avoir la relation User
      const name = `Commercial ${sale.userId}`;

      if (!totals[name]) {
        totals[name] = 0;
      }

      totals[name] += sale.amount;
    });

    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

  }, [sales]);

  return (
    <div style={{ width: "100%", height: 260 }}>

      <h6 className="mb-3">
        Chiffre d'affaires par commercial
      </h6>

      <ResponsiveContainer>

        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 10,
            right: 35,
            left: 15,
            bottom: 5,
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            tickFormatter={(value) =>
              `${Number(value).toLocaleString("fr-FR")} €`
            }
          />

          <YAxis
            type="category"
            dataKey="name"
            width={100}
          />

          <Tooltip
            formatter={(value) =>
              `${Number(value).toLocaleString("fr-FR")} €`
            }
          />

          <Bar
            dataKey="amount"
            name="Chiffre d'affaires"
            fill="#198754"
            radius={[0, 8, 8, 0]}
          >
            <LabelList
              dataKey="amount"
              position="right"
              formatter={(value) =>
                `${Number(value).toLocaleString("fr-FR")} €`
              }
            />
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default TeamSalesChart;