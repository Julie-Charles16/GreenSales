import React, { useEffect, useState, useRef } from "react";
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

import SalesHeader from "../components/sales/SalesHeader";
import SalesFilters from "../components/sales/SalesFilters";
import SalesKPI from "../components/sales/SalesKPI";
import SalesPipeline from "../components/sales/SalesPipeline";
import SalesTable from "../components/sales/SalesTable";
import SaleForm from "../components/sales/modals/SaleFormModal";
import SaleDeleteModal from "../components/sales/modals/SaleDeleteModal";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const SalesPage: React.FC = () => {

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
  const [view, setView] = useState<"table" | "pipeline">("pipeline");

  // ==============================
  // 🔹 STATE - gestion UI / modales
  // ==============================
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const { showToast } = useToast();
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
    const client = clients.find((c) => c.id === clientId);
    return client
      ? `${client.name} ${client.firstName}`
      : "Client inconnu";
  };

  const getClientProjectType = (clientId: number): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.projectType : "Non défini";
  };
  
  // ==============================
  // 🔹 DATA - calculées
  // ==============================

  // Filtrage
  const filteredSales = sales.filter(
    (s) =>
      getClientName(s.clientId)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filterStatus ? s.status === filterStatus : true)
  );


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
    setEditingSale(null);
    formModal?.show();
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    formModal?.show();
  };

  const handleSubmit = async (data: SaleFormData) => {
    if (editingSale) {
      await updateSale(editingSale.id, data);
      showToast({
        message: "Vente modifiée !",
        variant: "info",
      }); 
    } else {
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
    setSaleToDelete(sale);
    deleteModal?.show();
  };

  const confirmDelete = async () => {
    if (!saleToDelete) return;

    await deleteSale(saleToDelete.id);
    showToast({
      message: "Vente supprimée !",
      variant: "danger",
    });    
    setSaleToDelete(null);
    deleteModal?.hide();

    await loadSales();
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <SalesHeader
        view={view}
        setView={setView}
        onAdd={handleAdd}
      />

      {/* FILTRES */}
      <SalesFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        statuses={statuses}
      />

      {/* KPI COMMISSION */}
      <SalesKPI sales={filteredSales} />


      {/* Pipeline */}
      {view === "pipeline" &&(
        <SalesPipeline
        sales={filteredSales}
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      )}
      {/* Tableau */}
      {view === "table" &&(
      <SalesTable
        clients={clients}
        sales={sales}
        filteredSales={filteredSales}
        getClientName={getClientName}
        getClientProjectType={getClientProjectType}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      )}

      {/* MODAL FORM ADD/EDIT */}
<div className="modal fade" ref={formModalRef} tabIndex={-1}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
        <SaleForm
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