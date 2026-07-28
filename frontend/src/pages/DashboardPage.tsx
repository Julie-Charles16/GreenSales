import React, { useEffect, useState } from "react";

import type { User } from "../types/user";
import type { Client } from "../types/client";
import type { Sale } from "../types/sale";
import type { Appointment } from "../types/appointment";


import { getClients } from "../services/clientService";
import { getSales } from "../services/saleService";
import { getAppointments } from "../services/appointmentService";
import { getUsers } from "../services/adminService";

import { useAuth } from "../context/auth/useAuth";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import CommercialDashboard from "../components/dashboard/CommercialDashboard";


const DashboardPage: React.FC = () => {

  const { user } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {

    if (!user) return;


    const loadData = async () => {

      try {

        const [
          clientsData,
          salesData,
          appointmentsData,
          usersData,
        ] = await Promise.all([

          getClients(),

          getSales(),

          getAppointments(),

          user.role === "ADMIN"
            ? getUsers()
            : Promise.resolve([])

        ]);


        setClients(clientsData);

        setSales(salesData);

        setAppointments(appointmentsData);

        setUsers(usersData);


      } catch (error) {

        console.error(
          "Erreur chargement dashboard :",
          error
        );

      }

    };


    loadData();


  }, [user]);


  return (

    <div className="container mt-4">


      {user?.role === "ADMIN" && (

        <AdminDashboard

          clients={clients}

          sales={sales}

          appointments={appointments}

          users={users}

        />

      )}



      {user?.role === "MANAGER" && (

        <ManagerDashboard

          clients={clients}

          sales={sales}

          appointments={appointments}

          currentUserId={user.id}

        />

      )}



      {user?.role === "COMMERCIAL" && (

        <CommercialDashboard

          clients={clients}

          sales={sales}

          appointments={appointments}

          currentUserId={user.id}

        />

      )}


    </div>

  );

};


export default DashboardPage;