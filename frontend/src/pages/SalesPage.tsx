import React, { useEffect, useState, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from "../services/saleService";
import { getClients } from "../services/clientService";

import type { Sale, SaleFormData } from "../types/sale";
import type { Client } from "../types/client";

import { useToast } from "../context/toast/useToast";
import { useAuth } from "../context/auth/useAuth";
import { canCreateBusinessData, canDeleteOwnData, canEditOwnData } from "../utils/permissions";

import PageHeader from "../components/common/PageHeader";
// import SalesFilters from "../components/sales/SalesFilters";
import SalesKPI from "../components/sales/SalesKPI";
import SalesPipeline from "../components/sales/SalesPipeline";
import SalesTable from "../components/sales/SalesTable";
import SaleForm from "../components/sales/modals/SaleFormModal";
import SaleDeleteModal from "../components/sales/modals/SaleDeleteModal";
import ManagerTabs from "../components/common/ManagerTabs";

import { matchStartSearch } from "../utils/search";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import FiltersBar from "../components/common/FiltersBar";

const SalesPage: React.FC = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const canCreate = user
    ? canCreateBusinessData(user.role)
    : false;

  // ==============================
  // 🔹 STATE - données principales
  // ==============================
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // ==============================
  // 🔹 STATE - filtres & affichage
  // ==============================
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [view, setView] = useState<"table" | "pipeline">(
    isAdmin ? "table" : "pipeline"
  );
  const [activeTab, setActiveTab] = useState<"mine" | "team">("mine");

  // ==============================
  // 🔹 STATE - gestion UI / modales
  // ==============================
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const { showToast } = useToast();

  const clientsMap = useMemo(() => {
    return new Map(
      clients.map((client) => [client.id, client])
    );
  }, [clients]);

  // ==============================
  // 🔹 REFS - modales Bootstrap
  // ==============================
  const formModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // ==============================
  // 🔹 STATE - instances modales
  // ==============================
  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  // ==============================
  // 🔹 EFFECTS - initialisation
  // ==============================

  // Init Bootstrap modals
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

// reset quand
  useEffect(() => {
    const el = formModalRef.current;
    if (!el) return;

    const handleHidden = () => {
      setEditingSale(null); // reset form propre
    };

    el.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  // Chargement initial (sales + clients)
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [salesData, clientsData] = await Promise.all([
        getSales(),
        getClients(),
      ]);

      setSales(salesData);
      setClients(clientsData);

    } catch (error) {
      console.error("Erreur chargement sales :", error);
    }
  };

  void fetchData();
}, []);

  // ==============================
  // 🔹 API - chargement
  // ==============================
  const loadSales = async () => {
    const data = await getSales();
    setSales(data);
  };
  
  // ==============================
  // 🔹 HELPERS - utils métier
  // ==============================

  const getClientName = (clientId: number) => {
    const client = clientsMap.get(clientId);

    return client
      ? `${client.name} ${client.firstName}`
      : "Client inconnu";
  };

  const getClientProjectType = (clientId: number): string => {
    const client = clientsMap.get(clientId);
    return client ? client.projectType : "Non défini";
  };
  
  // ==============================
  // 🔹 DATA - calculées
  // ==============================

  // Filtrage
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const client = clientsMap.get(sale.clientId);

      return (
        matchStartSearch(search, client?.name ?? "") &&
        (filterStatus
          ? sale.status === filterStatus
          : true)
      );
    });
  }, [sales, clientsMap, search, filterStatus]);


  const displayedSales = useMemo(() => {
    if (user?.role !== "MANAGER") {
      return filteredSales;
    }

    return filteredSales.filter((sales) =>
      activeTab === "mine"
        ? sales.userId === user.id
        : sales.userId !== user.id
    );
  }, [filteredSales, activeTab, user]);

  // Options filtres
  const statuses = Array.from(new Set(sales.map((s) => s.status)));


  // ==============================
  // 🔹 HELPERS - utils UI
  // ==============================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_ATTENTE":
        return "secondary";
      case "ANNULEE":
        return "danger";
      case "TERMINEE":
        return "success";
      default:
        return "secondary";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ==============================
  // 🔹 ACTIONS - CRUD
  // ==============================

  const handleAdd = () => {
    if (!user || !canCreateBusinessData(user.role)) return;
    setEditingSale(null);
    formModal?.show();
  };

  const handleEdit = (sale: Sale) => {
    if (!user || !canEditOwnData(user.role, sale.userId, user.id)) return;
    setEditingSale(sale);
    formModal?.show();
  };

  const handleSubmit = async (data: SaleFormData) => {
    if (!user) return;
    if (editingSale) {
      if (!canEditOwnData(user.role, editingSale.userId, user.id)) return;
      await updateSale(editingSale.id, data);
      showToast({
        message: "Vente modifiée !",
        variant: "info",
      }); 
    } else {
      if (!canCreateBusinessData(user.role)) return;
      await createSale(data);
      showToast({
        message: "Vente ajoutée !",
        variant: "success",
      });
    }

    await loadSales();
    formModal?.hide();
  };

  // ==============================
  // 🔹 ACTIONS - suppression
  // ==============================

  const handleDeleteClick = (sale: Sale) => {
    if (!user || !canDeleteOwnData(user.role, sale.userId, user.id)) return;
    setSaleToDelete(sale);
    deleteModal?.show();
  };

  const confirmDelete = async () => {
    if (!saleToDelete) return;
    if (!user || !canDeleteOwnData(user.role, saleToDelete.userId, user.id)) return;

    await deleteSale(saleToDelete.id);
    showToast({
      message: "Vente supprimée !",
      variant: "danger",
    });    
    setSaleToDelete(null);
    deleteModal?.hide();

    await loadSales();
  };

  const headerConfig = {
    title: "Ventes",

    subtitle: isAdmin
      ? "Consultez l'ensemble des ventes."
      : user?.role === "MANAGER" && activeTab === "team"
        ? "Consultez les ventes de votre équipe."
        : "Gérez et suivez vos ventes.",

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
            value: "pipeline" as const,
            label: "Pipeline",
          },
        ],
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <PageHeader
        title={headerConfig.title}
        subtitle={headerConfig.subtitle}
        view={view}
        setView={setView}
        views={headerConfig.views}
        onAdd={handleAdd}
        canCreate={canCreate}
        addIcon="bi-cart-plus"
      />

      {user?.role === "MANAGER" && (
        <ManagerTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mineLabel="Mes ventes"
          teamLabel="Équipe"
        />
      )}

      {/* FILTRES */}
      {/* <SalesFilters
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

      {/* KPI COMMISSION */}
      <SalesKPI sales={displayedSales} /> 

      {/* Pipeline */}
      {headerConfig.views.some(v => v.value === "pipeline") &&
      view === "pipeline" && (
        <SalesPipeline
          sales={displayedSales}
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canEdit={(sale) => user ? canEditOwnData(user.role, sale.userId, user.id) : false}
          canDelete={(sale) => user ? canDeleteOwnData(user.role, sale.userId, user.id) : false}
        />
      )}
      
      {/* Tableau */}
      {view === "table" &&(
      <SalesTable
        filteredSales={displayedSales}
        getClientName={getClientName}
        getClientProjectType={getClientProjectType}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        canEdit={(sale) => user ? canEditOwnData(user.role, sale.userId, user.id) : false}
        canDelete={(sale) => user ? canDeleteOwnData(user.role, sale.userId, user.id) : false}
      />
      )}

      {/* MODAL FORM ADD/EDIT */}
      <div className="modal fade" ref={formModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
              <SaleForm
                key={editingSale?.id ?? "new-sale"}
                initialData={editingSale}
                onSubmit={handleSubmit}
                onCancel={() => formModal?.hide()}
                clients={clients}
              />
          </div>
        </div>
      </div>

      {/* MODAL DELETE */}
      <SaleDeleteModal
        sale={saleToDelete}
        modalRef={deleteModalRef}
        getClientName={getClientName}
        onClose={() => deleteModal?.hide()}
        onConfirm={confirmDelete}
       />
    </div>
  );
};

export default SalesPage;
