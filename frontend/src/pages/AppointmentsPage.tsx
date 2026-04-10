import React, { useEffect, useState, useRef } from "react";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";
import { getClients } from "../services/clientService";

import type { Appointment, AppointmentFormData } from "../types/appointment";
import type { Client } from "../types/client";

import AppointmentCalendar from "../components/AppointmentCalendar";
import AppointmentForm from "../components/AppointmentForm";

import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);

  const [toastMsg, setToastMsg] = useState("");

  // 🔹 refs modales
  const formModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  // 🔹 init modales
  useEffect(() => {
    if (formModalRef.current)
      setFormModal(new Modal(formModalRef.current, { backdrop: "static" }));
    if (deleteModalRef.current)
      setDeleteModal(new Modal(deleteModalRef.current));
  }, []);

  // 🔹 load data
  useEffect(() => {
    const fetchData = async () => {
      const [appointmentsData, clientsData] = await Promise.all([
        getAppointments(),
        getClients(),
      ]);

      setAppointments(appointmentsData);
      setClients(clientsData);
    };

    void fetchData();
  }, []);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  // 🔹 helpers
  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} ${client.firstName}` : "Client inconnu";
  };

  // 🔹 actions calendrier
  const handleEventClick = (appt: Appointment) => {
    setEditing(appt);
    formModal?.show();
  };

  
  const handleDateClick = (date: string) => {
  const formattedDate = new Date(date);

  // 👉 heure par défaut (optionnel mais UX ++)
  formattedDate.setHours(9, 0, 0, 0);

  setEditing({
    id: 0,
    date: formattedDate.toISOString().slice(0, 16), // 🔥 IMPORTANT
    status: "PLANIFIE",
    comment: "",
    clientId: clients[0]?.id || 1,
    userId: 1,
  });

  formModal?.show();
};

  // 🔹 submit
  const handleSubmit = async (data: AppointmentFormData) => {
    if (editing && editing.id !== 0) {
      await updateAppointment(editing.id, data);
      setToastMsg("RDV modifié !");
    } else {
      await createAppointment(data);
      setToastMsg("RDV ajouté !");
    }

    await loadAppointments();
    formModal?.hide();
  };

  // 🔹 delete
  const handleDeleteClick = () => {
    if (!editing) return;
    setToDelete(editing);
    formModal?.hide();
    deleteModal?.show();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    await deleteAppointment(toDelete.id);
    setToastMsg("RDV supprimé !");
    setToDelete(null);
    deleteModal?.hide();
    await loadAppointments();
  };

  // 🔹 toast auto
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📅 Rendez-vous</h2>

      {/* CALENDRIER */}
      <AppointmentCalendar
        appointments={appointments}
        clients={clients}
        getClientName={getClientName}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
      />

      {/* MODAL FORM */}
      <div className="modal fade" ref={formModalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editing && editing.id !== 0 ? "Modifier" : "Ajouter"} un RDV
              </h5>

              <div className="d-flex align-items-center ms-auto gap-2">
                {editing && editing.id !== 0 && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleDeleteClick}
                  >
                    Supprimer
                  </button>
                )}
                <button
                  className="btn-close"
                  onClick={() => formModal?.hide()}
                ></button>
              </div>
            </div>

            <div className="modal-body">
              <AppointmentForm
                initialData={editing}
                onSubmit={handleSubmit}
                onCancel={() => formModal?.hide()}
                clients={clients}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DELETE */}
      <div className="modal fade" ref={deleteModalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="text-danger">⚠️ Supprimer</h5>
              <button
                className="btn-close"
                onClick={() => deleteModal?.hide()}
              ></button>
            </div>

            <div className="modal-body">
              <p>Supprimer ce rendez-vous ?</p>

              {toDelete && (
                <div className="alert alert-light border">
                  <strong>{getClientName(toDelete.clientId)}</strong>
                  <br />
                  <small>
                    {new Date(toDelete.date).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => deleteModal?.hide()}
              >
                Annuler
              </button>

              <button className="btn btn-danger" onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div
          className={`toast text-bg-success ${toastMsg ? "show" : ""}`}
        >
          <div className="d-flex">
            <div className="toast-body">{toastMsg}</div>
            <button
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToastMsg("")}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;