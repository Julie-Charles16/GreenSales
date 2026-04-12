import React, { useEffect, useState, useRef } from "react";
import type { Client, ClientFormData } from "../types/client";
import { getClients, createClient, updateClient, deleteClient } from "../services/clientService";
import { Modal } from "bootstrap";

import ClientsHeader from "../components/clients/ClientsHeader";
import ClientsFilters from "../components/clients/ClientsFilters";
import ClientsKPI from "../components/clients/ClientsKPI";
import ClientsTable from "../components/clients/ClientsTable";
import ClientsCards from "../components/clients/ClientsCards";
import ClientForm from "../components/clients/modals/ClientFormModal";
import ClientDetailModal from "../components/clients/modals/ClientDetailModal";
import ClientDeleteModal from "../components/clients/modals/ClientDeleteModal";
import ToastMessage from "../components/ToastMessage";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ClientsPage: React.FC = () => {

  // ==============================
  // 🔹 STATE - données principales
  // ==============================
  const [clients, setClients] = useState<Client[]>([]);

  // ==============================
  // 🔹 STATE - filtres & affichage
  // ==============================
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");

  // ==============================
  // 🔹 STATE - gestion modales / UI
  // ==============================
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // ==============================
  // 🔹 REFS - modales Bootstrap
  // ==============================
  const formModalRef = useRef<HTMLDivElement>(null);
  const detailModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // ==============================
  // 🔹 STATE - instances modales
  // ==============================
  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [detailModal, setDetailModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  // ==============================
  // 🔹 EFFECTS - initialisation
  // ==============================

  // Init Bootstrap modals
  useEffect(() => {
    if (formModalRef.current) {
      setFormModal(new Modal(formModalRef.current, { backdrop: 'static' }));
    }
    if (detailModalRef.current) {
      setDetailModal(new Modal(detailModalRef.current));
    }
    if (deleteModalRef.current) {
      setDeleteModal(new Modal(deleteModalRef.current));
    }
  }, []);

  // Chargement initial des clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Erreur chargement clients :", error);
      }
    };
    void fetchClients();
  }, []);

  // Toast auto-disparition
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  // ==============================
  // 🔹 DATA - calculées
  // ==============================

  // Liste filtrée + triée
  const filteredClients = clients
    .filter(c =>
      `${c.name} ${c.firstName} ${c.email}`.toLowerCase().includes(search.toLowerCase()) &&
      (filterCity ? c.city === filterCity : true) &&
      (filterStatus ? c.status === filterStatus : true)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Options filtres
  const cities = Array.from(new Set(clients.map(c => c.city))).sort();
  const statuses = Array.from(new Set(clients.map(c => c.status)));

  // ==============================
  // 🔹 HELPERS - utils UI
  // ==============================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROSPECT": return "secondary";
      case "NEGOCIATION": return "warning";
      case "DEVIS_ENVOYE": return "info";
      case "SIGNE": return "success";
      case "PERDU": return "danger";
      default: return "secondary";
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (getStatusColor(status)) {
      case "success": return "#20c997";
      case "danger": return "#fa5252";
      case "warning": return "#f59f00";
      case "info": return "#339af0";
      default: return "#adb5bd";
    }
  };

  // ==============================
  // 🔹 API - chargement
  // ==============================
  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  // ==============================
  // 🔹 ACTIONS - CRUD
  // ==============================

  const handleAdd = () => {
    setEditingClient(null);
    formModal?.show();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    formModal?.show();
  };

  const handleSubmit = async (data: ClientFormData) => {
    if (editingClient) {
      await updateClient(editingClient.id, data);
      setToastMsg("Client modifié !");
    } else {
      await createClient(data);
      setToastMsg("Client ajouté !");
    }

    await loadClients();
    formModal?.hide();
  };

  // ==============================
  // 🔹 ACTIONS - détail
  // ==============================
  const handleViewDetail = (client: Client) => {
    setDetailClient(client);
    detailModal?.show();
  };

  const handleCloseDetail = () => {
    detailModal?.hide();
  };

  // ==============================
  // 🔹 ACTIONS - suppression
  // ==============================
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    deleteModal?.show();
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    await deleteClient(clientToDelete.id);
    setToastMsg("Client supprimé !");
    setClientToDelete(null);
    deleteModal?.hide();

    await loadClients();
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <ClientsHeader
        view={view}
        setView={setView}
        onAdd={handleAdd}
      />

      {/* FILTRES */}
      <ClientsFilters
        search={search}
        setSearch={setSearch}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        cities={cities}
        statuses={statuses}
      />
      {/* KPI MINI */}
      <ClientsKPI clients={filteredClients}/>

      {/* TABLE */}
      {view === "table" && (
      <ClientsTable
        clients={filteredClients}
        getStatusColor={getStatusColor}
        getStatusBorderColor={getStatusBorderColor}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      )}
      
      {/* CARDS */}
      {view === "cards" && (
      <ClientsCards
        clients={filteredClients}
        getStatusColor={getStatusColor}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      )}

      {/* MODAL FORM ADD/EDIT*/}
      <div className="modal fade" ref={formModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{editingClient ? "Modifier" : "Ajouter"} un client</h5>
              <button className="btn-close" onClick={() => formModal?.hide()}></button>
            </div>
            <div className="modal-body">
              <ClientForm
                key={editingClient?.id || "new"}
                initialData={editingClient}
                onSubmit={handleSubmit}
                onCancel={() => formModal?.hide()}
              />     
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      <ClientDetailModal
        client={detailClient}
        modalRef={detailModalRef}
        onClose={handleCloseDetail}
        getStatusColor={getStatusColor}
      />

      {/* 🔥 MODAL DELETE */}
      <ClientDeleteModal
        client={clientToDelete}
        modalRef={deleteModalRef}
        onClose={() => deleteModal?.hide()}
        onConfirm={confirmDelete}
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

export default ClientsPage;