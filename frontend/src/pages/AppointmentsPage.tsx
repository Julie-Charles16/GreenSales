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
import { useToast } from "../context/toast/useToast";

import AppointmentCalendar from "../components/appointment/AppointmentCalendar";
import AppointmentsTable from "../components/appointment/AppointmentsTable";
import AppointmentsCards from "../components/appointment/AppointmentsCards";
import AppointmentForm from "../components/appointment/modals/AppointmentFormModal";
import AppointmentsHeader from "../components/appointment/AppointmentsHeader";
import AppointmentsKPI from "../components/appointment/AppointmentsKPI";
import AppointmentsFilters from "../components/appointment/AppointmentsFilters";
import AppointmentDeleteModal from "../components/appointment/modals/AppointmentDeleteModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);

  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "cards">("calendar");

  // FILTRES (placés AVANT utilisation)
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // refs modales
  const formModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  // init modales
  useEffect(() => {
    if (formModalRef.current) {
      const modal = new Modal(formModalRef.current, {
        backdrop: true,
        keyboard: true,
      });

      setFormModal(modal);
    }

    if (deleteModalRef.current) {
      setDeleteModal(new Modal(deleteModalRef.current));
    }
  }, []);

  // RESET quand modal se ferme
  useEffect(() => {
  const el = formModalRef.current;
  if (!el) return;

  const handleHidden = () => {
    setEditing(null);
  };

  el.addEventListener("hidden.bs.modal", handleHidden);

  return () => {
    el.removeEventListener("hidden.bs.modal", handleHidden);
  };
}, []);




  // load data
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [appointmentsData, clientsData] = await Promise.all([
        getAppointments(),
        getClients(),
      ]);

      setAppointments(appointmentsData);
      setClients(clientsData);

    } catch (error) {
      console.error("Erreur chargement appointments :", error);
    }
  };

  fetchData();
}, []);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  // helpers
  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} ${client.firstName}` : "Client inconnu";
  };

  const getClientAddress = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.address} , ${client.city}` : "Non défini";
  }
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

  // STATUSES
  const statuses = Array.from(new Set(appointments.map((a) => a.status)));

  // FILTRE
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

  // actions calendrier
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
      showToast({
        message: "RDV modifié !",
        variant: "info",
      });  
    } else {
      await createAppointment(data);
      showToast({
        message: "RDV ajouté !",
        variant: "success",
      }); 
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
      showToast({
        message: "RDV supprimé !",
        variant: "danger",
      });  
      setToDelete(null);
      deleteModal?.hide();
    await loadAppointments();
  };
  
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
        getClientAddress={getClientAddress}
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
        getClientAddress={getClientAddress}
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
      <div className="modal fade" ref={formModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <AppointmentForm
              initialData={editing}
              onSubmit={handleSubmit}
              onCancel={() => formModal?.hide()}
              onDelete={handleDeleteClick}
              clients={clients}
            />
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
    </div>
  );
};

export default AppointmentsPage;