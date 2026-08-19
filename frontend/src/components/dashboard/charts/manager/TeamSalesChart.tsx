import React, { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { Sale } from "../../../../types/sale";

interface Props {
  sales: Sale[];
}

const TeamSalesChart: React.FC<Props> = ({ sales }) => {

  const data = useMemo(() => {

    const totals: Record<string, number> = {};

    sales
      .filter((sale) => sale.status === "TERMINEE")
      .forEach((sale) => {

        const name =
          sale.user?.pseudo ?? `Commercial ${sale.userId}`;

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
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

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
            top: 5,
            right: 10,
            left: 0,
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
            dataKey="rank"
            width={30}
            tick={({ x, y, payload }) => {
              const rank = Number(payload.value);

              let content = "";

              if (rank === 1) content = "🥇";
              else if (rank === 2) content = "🥈";
              else if (rank === 3) content = "🥉";

              return (
                <text
                  x={Number(x) - 10}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={28}
                >
                  {content}
                </text>
              );
            }}
          />

          <Tooltip
            formatter={(value) =>
              `${Number(value).toLocaleString("fr-FR")} €`
            }
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.name ?? ""
            }
          />

          <Bar
            dataKey="amount"
            name="Chiffre d'affaires"
            fill="#198754"
            radius={[0, 8, 8, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default TeamSalesChart;