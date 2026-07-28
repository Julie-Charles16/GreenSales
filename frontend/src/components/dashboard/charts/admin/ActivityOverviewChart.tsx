import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface Props {
  clientsCount: number;
  appointmentsCount: number;
  salesCount: number;
}

const COLORS = [
  "#339af0",
  "#f59f00",
  "#20c997",
];

const ActivityOverviewChart: React.FC<Props> = ({
  clientsCount,
  appointmentsCount,
  salesCount,
}) => {

  const data = [
    {
      name: "Clients",
      value: clientsCount,
    },
    {
      name: "RDV",
      value: appointmentsCount,
    },
    {
      name: "Ventes",
      value: salesCount,
    },
  ];

  return (
    <div style={{ width: "100%", height: 260 }}>

      <h6 className="mb-3">
        Activité de la plateforme
      </h6>

      <ResponsiveContainer>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ActivityOverviewChart;