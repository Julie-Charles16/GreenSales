import React, { useEffect, useState, useMemo } from "react";
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

import { useBootstrapModal } from "../hooks/useBootstrapModal";

import PageHeader from "../components/common/PageHeader";
import SalesKPI from "../components/sales/SalesKPI";
import SalesPipeline from "../components/sales/SalesPipeline";
import SalesTable from "../components/sales/SalesTable";
import SaleForm from "../components/sales/modals/SaleFormModal";
import SaleDeleteModal from "../components/sales/modals/SaleDeleteModal";
import ManagerTabs from "../components/common/ManagerTabs";

import { getClientName, getClientProjectType } from "../utils/clientHelpers";
import { formatShortDate } from "../utils/date";
import { canCreateBusinessData, canDeleteOwnData, canEditOwnData } from "../utils/permissions";
import { matchStartSearch } from "../utils/search";
import { getSaleStatusColor } from "../utils/statusColors";

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
  
  // Init Bootstrap modals
  const {
    formModalRef,
    deleteModalRef,
    formModal,
    deleteModal,
  } = useBootstrapModal();

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
  }, [formModalRef]);

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
        getClientName={(id) => getClientName(clients, id)}
        getClientProjectType={(id) =>
          getClientProjectType(clients, id)
        }
        getStatusColor={getSaleStatusColor}
        formatDate={formatShortDate}
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
        getClientName={(id) => getClientName(clients, id)}
        onClose={() => deleteModal?.hide()}
        onConfirm={confirmDelete}
       />
    </div>
  );
};

export default SalesPage;
