import React, { useEffect, useState, useRef, useMemo } from "react";
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
import { useAuth } from "../context/auth/useAuth";
import { canCreateBusinessData, canDeleteOwnData, canEditOwnData } from "../utils/permissions";

import PageHeader from "../components/common/PageHeader";
import AppointmentCalendar from "../components/appointment/AppointmentCalendar";
import AppointmentsTable from "../components/appointment/AppointmentsTable";
import AppointmentsCards from "../components/appointment/AppointmentsCards";
import AppointmentForm from "../components/appointment/modals/AppointmentFormModal";
import AppointmentsKPI from "../components/appointment/AppointmentsKPI";
// import AppointmentsFilters from "../components/appointment/AppointmentsFilters";
import AppointmentDeleteModal from "../components/appointment/modals/AppointmentDeleteModal";
import ManagerTabs from "../components/common/ManagerTabs";

import { matchStartSearch } from "../utils/search";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import FiltersBar from "../components/common/FiltersBar";

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const canCreate = user
    ? canCreateBusinessData(user.role)
    : false;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);

  const { showToast } = useToast();
  const [viewMode, setViewMode] =
    useState<"calendar" | "list" | "cards">(
      isAdmin ? "list" : "calendar"
    );
  const [activeTab, setActiveTab] = useState<"mine" | "team">("mine");

  // FILTRES (placés AVANT utilisation)
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // refs modales
  const formModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  const clientsMap = useMemo(() => {
    return new Map(
      clients.map((client) => [client.id, client])
    );
  }, [clients]);

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
    const client = clientsMap.get(clientId);

    return client
      ? `${client.name} ${client.firstName}`
      : "Client inconnu";
  };

  const getClientAddress = (clientId: number) => {
    const client = clientsMap.get(clientId);

    return client
      ? `${client.address}, ${client.city}`
      : "Non défini";
  };
  const getClientProjectType = (clientId: number) => {
    return (
      clientsMap.get(clientId)?.projectType ??
      "Non défini"
    );
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
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const client = clientsMap.get(
          appointment.clientId
        );

        return (
          matchStartSearch(search, client?.name ?? "") &&
          (filterStatus
            ? appointment.status === filterStatus
            : true)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

  }, [appointments, clientsMap, search, filterStatus]);

  const displayedAppointments = useMemo(() => {
    if (user?.role !== "MANAGER") {
      return filteredAppointments;
    }

    return filteredAppointments.filter((appointment) =>
      activeTab === "mine"
        ? appointment.userId === user.id
        : appointment.userId !== user.id
    );
  }, [filteredAppointments, activeTab, user]);

  // actions calendrier
  const handleEventClick = (appt: Appointment) => {
    if (!user || !canEditOwnData(user.role, appt.userId, user.id)) return;
    setEditing(appt);
    formModal?.show();
  };

  const handleDateClick = (date: string) => {
    if (!user || !canCreateBusinessData(user.role)) return;
    const formattedDate = new Date(date);
    formattedDate.setHours(9, 0, 0, 0);

    setEditing({
      id: 0,
      date: formattedDate.toISOString().slice(0, 16),
      status: "PLANIFIE",
      comment: "",
      clientId: 0,
      userId: user.id,
    });

    formModal?.show();
  };

  // 🔹 submit
  const handleSubmit = async (data: AppointmentFormData) => {
    if (!user) return;
    if (editing && editing.id !== 0) {
      if (!canEditOwnData(user.role, editing.userId, user.id)) return;
      await updateAppointment(editing.id, data);
      showToast({
        message: "RDV modifié !",
        variant: "info",
      });  
    } else {
      if (!canCreateBusinessData(user.role)) return;
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
    if (!user || !canDeleteOwnData(user.role, editing.userId, user.id)) return;
    setToDelete(editing);
    formModal?.hide();
    deleteModal?.show();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    if (!user || !canDeleteOwnData(user.role, toDelete.userId, user.id)) return;

    await deleteAppointment(toDelete.id);
      showToast({
        message: "RDV supprimé !",
        variant: "danger",
      });  
      setToDelete(null);
      deleteModal?.hide();
    await loadAppointments();
  };
  
  const handleAdd = () => {
    if (!user || !canCreateBusinessData(user.role)) return;

    setEditing({
      id: 0,
      date: new Date().toISOString().slice(0, 16),
      status: "PLANIFIE",
      comment: "",
      clientId: 0,
      userId: user.id,
    });

    formModal?.show();
  };

  const headerConfig = {
    title: "Rendez-vous",

    subtitle: isAdmin
      ? "Consultez l'ensemble des rendez-vous."
      : user?.role === "MANAGER" && activeTab === "team"
        ? "Consultez les rendez-vous de votre équipe."
        : "Gérez votre agenda et vos rendez-vous.",

    views: isAdmin
      ? [
          {
            value: "list" as const,
            label: "Liste",
          },
        ]
      : [
          {
            value: "calendar" as const,
            label: "Calendrier",
          },
          {
            value: "list" as const,
            label: "Liste",
          },
          {
            value: "cards" as const,
            label: "Cartes",
          },
        ],
  };

  const handleTableDelete = (appointment: Appointment) => {
    if (!user || !canDeleteOwnData(user.role, appointment.userId, user.id)) return;

    setToDelete(appointment);
    deleteModal?.show();
  };

  return (
    <div className="container mt-4">
      <PageHeader
        title={headerConfig.title}
        subtitle={headerConfig.subtitle}
        view={viewMode}
        setView={setViewMode}
        views={headerConfig.views}
        onAdd={handleAdd}
        canCreate={canCreate}
        addIcon="bi-calendar-plus"
      />

      {user?.role === "MANAGER" && (
        <ManagerTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mineLabel="Mes rendez-vous"
          teamLabel="Équipe"
        />
      )}
      
      {/* <AppointmentsFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        statuses={statuses}
      /> */}

      <FiltersBar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Rechercher par client..."
        selects={[
          {
            value: filterStatus,
            setValue: setFilterStatus,
            placeholder: "Tous statuts",
            options: statuses.map(status => ({
              value: status,
              label: status,
            })),
          },
        ]}
      />

      <AppointmentsKPI appointments={displayedAppointments} />

      {/* CALENDRIER */}
      {headerConfig.views.some(v => v.value === "calendar") &&
      viewMode === "calendar" && (
        <AppointmentCalendar
          appointments={displayedAppointments}
          clients={clients}
          getClientName={getClientName}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          canEdit={(appointment) => user ? canEditOwnData(user.role, appointment.userId, user.id) : false}
          canCreate={user ? canCreateBusinessData(user.role) : false}
        />
      )}

      {/* LISTE */}
      {viewMode === "list" && (
      <AppointmentsTable
        appointments={displayedAppointments}
        clients={clients}
        getClientName={getClientName}
        getClientProjectType={getClientProjectType}
        getClientAddress={getClientAddress}
        getStatusColor={getStatusColor}
        getStatusBorderColor={getStatusBorderColor}
        formatDate={formatDate}
        onEdit={handleEventClick}
        onDelete={handleTableDelete}
        canEdit={(appointment) => user ? canEditOwnData(user.role, appointment.userId, user.id) : false}
        canDelete={(appointment) => user ? canDeleteOwnData(user.role, appointment.userId, user.id) : false}
      />
      )}

      {/* CARDS */}
      {headerConfig.views.some(v => v.value === "cards") &&
      viewMode === "cards" && (
        <AppointmentsCards
          appointments={displayedAppointments}
          clients={clients}
          getClientName={getClientName}
          getClientAddress={getClientAddress}
          getClientProjectType={getClientProjectType}
          getStatusColor={getStatusColor}
          getStatusBorderColor={getStatusBorderColor}
          formatDate={formatDate}
          onEdit={handleEventClick}
          onDelete={handleTableDelete}
          canEdit={(appointment) => user ? canEditOwnData(user.role, appointment.userId, user.id) : false}
          canDelete={(appointment) => user ? canDeleteOwnData(user.role, appointment.userId, user.id) : false}
        />
      )}

      {/* MODAL FORM ADD/EDIT */}
      <div className="modal fade" ref={formModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <AppointmentForm
              key={editing?.id ?? editing?.date ?? "new"}
              initialData={editing}
              onSubmit={handleSubmit}
              onCancel={() => formModal?.hide()}
              onDelete={handleDeleteClick}
              canDelete={user && editing ? canDeleteOwnData(user.role, editing.userId, user.id) : false}
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
