import React, { useMemo } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { User } from "../../../../types/user";


interface Props {
  users: User[];
}


const COLORS: Record<string, string> = {
  ADMIN: "#212529",
  MANAGER: "#0d6efd",
  COMMERCIAL: "#20c997",
};


const UserRoleChart: React.FC<Props> = ({ users }) => {


  const data = useMemo(() => {

    const totals = {
      ADMIN: 0,
      MANAGER: 0,
      COMMERCIAL: 0,
    };


    users.forEach((user) => {

      if (totals[user.role] !== undefined) {
        totals[user.role]++;
      }

    });


    return [
      {
        name: "Administrateurs",
        value: totals.ADMIN,
        role: "ADMIN",
      },
      {
        name: "Managers",
        value: totals.MANAGER,
        role: "MANAGER",
      },
      {
        name: "Commerciaux",
        value: totals.COMMERCIAL,
        role: "COMMERCIAL",
      },
    ].filter(item => item.value > 0);


  }, [users]);



  return (

    <div style={{ width: "100%", height: 260 }}>

      <h6 className="mb-3">
        Répartition des utilisateurs
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

            {data.map((entry) => (

              <Cell
                key={entry.role}
                fill={COLORS[entry.role]}
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


export default UserRoleChart;