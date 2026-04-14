import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Appointment } from "../../../types/appointment";

interface Props {
  appointments: Appointment[];
}

const getLast7Days = () => {
  const days: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }

  return days;
};

const AppointmentsChart: React.FC<Props> = ({ appointments }) => {
  const data = useMemo(() => {
    const last7Days = getLast7Days();

    return last7Days.map((day) => {
      const planifie = appointments.filter((a) => {
        if (!a.date) return false;

        return (
          a.date.split("T")[0] === day &&
          a.status === "PLANIFIE"
        );
      }).length;

      const termine = appointments.filter((a) => {
        if (!a.date) return false;

        return (
          a.date.split("T")[0] === day &&
          a.status === "TERMINE"
        );
      }).length;

      return {
        date: day,
        planifie,
        termine,
      };
    });
  }, [appointments]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h6>RDV des 7 derniers jours</h6>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })
            }
          />

          <YAxis allowDecimals={false} />

          <Tooltip />
          <Legend />

          {/* RDV planifiés */}
          <Line
            type="monotone"
            dataKey="planifie"
            stroke="#ffc107"
            strokeWidth={2}
            name="Planifiés"
          />

          {/* RDV terminés */}
          <Line
            type="monotone"
            dataKey="termine"
            stroke="#198754"
            strokeWidth={2}
            name="Terminés"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentsChart;