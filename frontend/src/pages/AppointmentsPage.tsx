import React, { useEffect, useState } from "react";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";
import { getClients } from "../services/clientService";

import type { Appointment } from "../types/appointment";
import type { Client } from "../types/client";
import type { AppointmentFormData } from "../types/appointment";

import AppointmentForm from "../components/AppointmentForm";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Appointment | null>(null);

  // chargement initial
  useEffect(() => {
    const fetchData = async () => {
      const [appointmentsData, clientsData] = await Promise.all([
        getAppointments(),
        getClients(),
      ]);

      setAppointments(appointmentsData);
      setClients(clientsData);
    };

    fetchData();
  }, []);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  // CREATE
  const handleCreate = async (data: AppointmentFormData) => {
    await createAppointment(data);
    await loadAppointments();
  };

  // UPDATE
  const handleUpdate = async (data: AppointmentFormData) => {
    if (!editing) return;

    await updateAppointment(editing.id, data);
    setEditing(null);
    await loadAppointments();
  };

  // DELETE
  const handleDelete = async (id: number) => {
    await deleteAppointment(id);
    await loadAppointments();
  };

  const getClientName = (clientId: number): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} ${client.firstName}` : "Client inconnu";
  };

  return (
    <div>
      <h1>Rendez-vous</h1>

      <h2>{editing ? "Modifier un RDV" : "Ajouter un RDV"}</h2>

      <AppointmentForm
        key={editing?.id || "new"}
        initialData={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        clients={clients}
      />

      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {new Date(appt.date).toLocaleString()} -{" "}
            {getClientName(appt.clientId)} - {appt.status}

            <button onClick={() => setEditing(appt)}>Modifier</button>
            <button onClick={() => handleDelete(appt.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsPage;