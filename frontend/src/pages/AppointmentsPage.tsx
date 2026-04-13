import React, { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";
import { getClients } from "../services/clientService";

import type { Appointment, AppointmentFormData } from "../types/appointment";
import type { Client } from "../types/client";

import AppointmentCalendar from "../components/appointment/AppointmentCalendar";
import AppointmentsTable from "../components/appointment/AppointmentsTable";
import AppointmentsCards from "../components/appointment/AppointmentsCards";
import AppointmentForm from "../components/appointment/modals/AppointmentFormModal";
import AppointmentsHeader from "../components/appointment/AppointmentsHeader";
import AppointmentsKPI from "../components/appointment/AppointmentsKPI";
import AppointmentsFilters from "../components/appointment/AppointmentsFilters";
import AppointmentDeleteModal from "../components/appointment/modals/AppointmentDeleteModal";
import ToastMessage from "../components/ToastMessage";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);

  const [toastMsg, setToastMsg] = useState("");

  const [viewMode, setViewMode] = useState<"calendar" | "list" | "cards">("calendar");

  // ✅ FILTRES (placés AVANT utilisation)
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const getClientProjectType = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.projectType || "Non défini";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANIFIE": return "info";
      case "ANNULE": return "warning";
      case "TERMINE": return "success";
      default: return "secondary";
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (getStatusColor(status)) {
      case "warning": return "#f59f00";
      case "success": return "#20c997";
      case "info": return "#339af0";
      default: return "#adb5bd";
    }
  };

  // ✅ STATUSES dynamiques
  const statuses = Array.from(new Set(appointments.map((a) => a.status)));

  // ✅ FILTRE CORRIGÉ
  const filteredAppointments = appointments
    .filter((appt) => {
      const client = clients.find((c) => c.id === appt.clientId);

      const searchable = `
        ${client?.name || ""}
        ${client?.firstName || ""}
        ${client?.email || ""}
      `.toLowerCase();

      return (
        searchable.includes(search.toLowerCase()) &&
        (filterStatus ? appt.status === filterStatus : true)
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 🔹 actions calendrier
  const handleEventClick = (appt: Appointment) => {
    setEditing(appt);
    formModal?.show();
  };

  const handleDateClick = (date: string) => {
    const formattedDate = new Date(date);
    formattedDate.setHours(9, 0, 0, 0);

    setEditing({
      id: 0,
      date: formattedDate.toISOString().slice(0, 16),
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
      <AppointmentsHeader
        view={viewMode}
        setView={setViewMode}
        onAdd={() => {
          handleDateClick(new Date().toISOString());
        }}
      />
      
      <AppointmentsFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        statuses={statuses}
      />

      <AppointmentsKPI appointments={filteredAppointments} />


      {/* CALENDRIER */}
      {viewMode === "calendar" && (
      <AppointmentCalendar
        appointments={filteredAppointments}
        clients={clients}
        getClientName={getClientName}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
      />
      )}

      {/* LISTE */}
      {viewMode === "list" && (
      <AppointmentsTable
        appointments={filteredAppointments}
        clients={clients}
        getClientName={getClientName}
        getClientProjectType={getClientProjectType}
        getStatusColor={getStatusColor}
        getStatusBorderColor={getStatusBorderColor}
        formatDate={formatDate}
        onEdit={(appt) => {
          setEditing(appt);
          formModal?.show();
        }}
        onDelete={(appt) => {
          setToDelete(appt);
          deleteModal?.show();
        }}
      />
      )}

      {/* CARDS */}
      {viewMode === "cards" && (
      <AppointmentsCards
        appointments={filteredAppointments}
        clients={clients}
        getClientName={getClientName}
        getClientProjectType={getClientProjectType}
        getStatusColor={getStatusColor}
        getStatusBorderColor={getStatusBorderColor}
        formatDate={formatDate}
        onEdit={(appt) => {
          setEditing(appt);
          formModal?.show();
        }}
        onDelete={(appt) => {
          setToDelete(appt);
          deleteModal?.show();
        }}
      />
      )}

      {/* MODAL FORM ADD/EDIT */}
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
      <AppointmentDeleteModal
        appointment={toDelete}
        modalRef={deleteModalRef}
        onClose={() => deleteModal?.hide()}
        onConfirm={confirmDelete}
        getClientName={getClientName}
      />

      {/* TOAST */}
      <ToastMessage
        message={toastMsg}
        onClose={() => setToastMsg("")}
        variant="success"
      />
    </div>
  );
};

export default AppointmentsPage;