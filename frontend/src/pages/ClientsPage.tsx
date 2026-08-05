import React, { useEffect, useMemo, useState, useRef } from "react";
import type { Client, ClientFormData } from "../types/client";
import { getClients, createClient, updateClient, deleteClient } from "../services/clientService";
import { Modal } from "bootstrap";

import { useAuth } from "../context/auth/useAuth";
import { canEditOwnData, canDeleteOwnData, canCreateBusinessData} from "../utils/permissions";

import ManagerTabs from "../components/common/ManagerTabs";
import PageHeader from "../components/common/PageHeader";
// import ClientsFilters from "../components/clients/ClientsFilters";
import ClientsKPI from "../components/clients/ClientsKPI";
import ClientsTable from "../components/clients/ClientsTable";
import ClientsCards from "../components/clients/ClientsCards";
import ClientForm from "../components/clients/modals/ClientFormModal";
import ClientDetailModal from "../components/clients/modals/ClientDetailModal";
import ClientDeleteModal from "../components/clients/modals/ClientDeleteModal";

import { matchStartSearch } from "../utils/search";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useToast } from "../context/toast/useToast";
import FiltersBar from "../components/common/FiltersBar";

const ClientsPage: React.FC = () => {

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
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
  const [activeTab, setActiveTab] = useState<"mine" | "team">("mine");

  // ==============================
  // 🔹 STATE - gestion modales / UI
  // ==============================
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { showToast } = useToast();
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
  // 🔹 API - chargement
  // ==============================
  
  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Erreur chargement clients :", error);
    }
  };

  // ==============================
  // 🔹 EFFECTS - initialisation
  // ==============================

  // Init Bootstrap modals
  useEffect(() => {
    if (formModalRef.current) {
      setFormModal(new Modal(formModalRef.current));
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
      await loadClients();
    };

    void fetchClients();
  }, []);

  // ==============================
  // 🔹 DATA - calculées
  // ==============================

  // Liste filtrée + triée
  const filteredClients = useMemo(() => {
    return clients
      .filter(
        (c) =>
          matchStartSearch(search, c.name) &&
          (filterCity ? c.city === filterCity : true) &&
          (filterStatus ? c.status === filterStatus : true)
      )
      .sort((a, b) => a.name.localeCompare(b.name));

  }, [clients, search, filterCity, filterStatus]);

  const displayedClients = useMemo(() => {

    if (user?.role !== "MANAGER") {
      return filteredClients;
    }

    return filteredClients.filter(client =>
      activeTab === "mine"
        ? client.userId === user.id
        : client.userId !== user.id
    );

  }, [filteredClients, activeTab, user]);

  // Options filtres
  const cities = useMemo(
    () => Array.from(new Set(clients.map(c => c.city))).sort(),
    [clients]
  );

  const statuses = useMemo(
    () => Array.from(new Set(clients.map(c => c.status))),
    [clients]
  );

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
  // 🔹 ACTIONS - CRUD
  // ==============================

  const handleAdd = () => {
    if (!user || !canCreateBusinessData(user.role)) return;
    setEditingClient(null);
    formModal?.show();
  };

  const handleEdit = (client: Client) => {
    if (!user || !canEditOwnData(user.role, client.userId, user.id)) return;
    setEditingClient(client);
    formModal?.show();
  };

  const handleSubmit = async (data: ClientFormData) => {
    if (!user) return;
    if (editingClient) {
      if (!canEditOwnData(user.role, editingClient.userId, user.id)) return;
      await updateClient(editingClient.id, data);
      showToast({
        message: "Client modifié !",
        variant: "info",
      });  
    } else {
      if (!canCreateBusinessData(user.role)) return;
      await createClient(data);
      showToast({
        message: "Client ajouté !",
        variant: "success",
      });    
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
    if (!user || !canDeleteOwnData(user.role, client.userId, user.id)) return;
    setClientToDelete(client);
    deleteModal?.show();
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    if (!user || !canDeleteOwnData(user.role, clientToDelete.userId, user.id)) return;

    await deleteClient(clientToDelete.id);
    showToast({
      message: "Client supprimé !",
      variant: "danger",
    });    
    setClientToDelete(null);
    deleteModal?.hide();

    await loadClients();
  };

  const headerConfig = {
    title: "Clients",

    subtitle: isAdmin
      ? "Consultez l'ensemble des clients enregistrés."
      : user?.role === "MANAGER" && activeTab === "team"
        ? "Consultez les clients de votre équipe."
        : "Gérez et suivez vos relations clients.",

    views: isAdmin
      ? [
          {
            value: "table" as const,
            label: "Liste",
          },
        ]
      : [
          {
            value: "table" as const,
            label: "Liste",
          },
          {
            value: "cards" as const,
            label: "Cartes",
          },
        ],
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <PageHeader
        title={headerConfig.title}
        subtitle={headerConfig.subtitle}
        views={headerConfig.views}
        view={view}
        setView={setView}
        onAdd={handleAdd}
        canCreate={
          user
            ? canCreateBusinessData(user.role)
            : false
        }
        addIcon="bi-person-plus"
      />

      {user?.role === "MANAGER" && (
        <ManagerTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mineLabel="Mes clients"
          teamLabel="Équipe"
        />
      )}

      {/* FILTRES */}
      {/* <ClientsFilters
        search={search}
        setSearch={setSearch}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        cities={cities}
        statuses={statuses}
      /> */}

      <FiltersBar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Rechercher un client..."
        selects={[
          {
            value: filterCity,
            setValue: setFilterCity,
            placeholder: "Toutes les villes",
            options: cities.map(city => ({
              value: city,
              label: city,
            })),
          },
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
      {/* KPI MINI */}
      <ClientsKPI clients={displayedClients} />

      {/* TABLE */}
      {view === "table" && (
      <ClientsTable
        clients={displayedClients}
        getStatusColor={getStatusColor}
        getStatusBorderColor={getStatusBorderColor}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}

        canEdit={(client) =>
          user
            ? canEditOwnData(
                user.role,
                client.userId,
                user.id
              )
            : false
        }

        canDelete={(client) =>
          user
            ? canDeleteOwnData(
                user.role,
                client.userId,
                user.id
              )
            : false
        }
      />
      )}
      
      {/* CARDS */}
      {headerConfig.views.some(v => v.value === "cards") &&
      view === "cards" && (
        <ClientsCards
        clients={displayedClients}
        getStatusColor={getStatusColor}
        getStatusBorderColor={getStatusBorderColor}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        canEdit={(client) => user ? canEditOwnData(user.role, client.userId, user.id) : false}
        canDelete={(client) => user ? canDeleteOwnData(user.role, client.userId, user.id) : false}
        />
      )}

      {/* MODAL FORM ADD/EDIT*/}
      <div className="modal fade" ref={formModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
              <ClientForm
                key={editingClient?.id || "new"}
                initialData={editingClient}
                onSubmit={handleSubmit}
                onCancel={() => formModal?.hide()}
              />
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
      
    </div>
  );
};

export default ClientsPage;
