import React, { useMemo } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { Client } from "../../../../types/client";
import { CLIENT_STATUS_COLORS } from "../../../../utils/statusColors";

interface Props {
  clients: Client[];
}

const ClientStatusChart: React.FC<Props> = ({ clients }) => {

  const data = useMemo(() => {

    const totals: Record<string, number> = {};

    clients.forEach((client) => {

      if (!totals[client.status]) {
        totals[client.status] = 0;
      }

      totals[client.status]++;

    });

    return Object.entries(totals).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

  }, [clients]);


  return (

    <div style={{ width:"100%", height:260 }}>

      <h6 className="mb-3">
        Répartition des clients
      </h6>

      <ResponsiveContainer>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >

            {data.map((_, index) => (
              <Cell
                key={index}
                fill={CLIENT_STATUS_COLORS[data[index].name] ?? "#6c757d"}
              />
            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

};

export default ClientStatusChart;