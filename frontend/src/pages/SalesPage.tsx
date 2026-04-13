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

import SalesHeader from "../components/sales/SalesHeader";
import SalesFilters from "../components/sales/SalesFilters";
import SalesKPI from "../components/sales/SalesKPI";
import SalesPipeline from "../components/sales/SalesPipeline";
import SalesTable from "../components/sales/SalesTable";
import SaleForm from "../components/sales/modals/SaleFormModal";
import SaleDeleteModal from "../components/sales/modals/SaleDeleteModal";
import ToastMessage from "../components/ToastMessage";

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
  const [toastMsg, setToastMsg] = useState("");

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
      setFormModal(new Modal(formModalRef.current, { backdrop: "static" }));
    }
    if (deleteModalRef.current) {
      setDeleteModal(new Modal(deleteModalRef.current));
    }
  }, []);

  // Chargement initial (sales + clients)
  useEffect(() => {
    const fetchData = async () => {
      const [salesData, clientsData] = await Promise.all([
        getSales(),
        getClients(),
      ]);
      setSales(salesData);
      setClients(clientsData);
    };

    void fetchData();
  }, []);

  // Toast auto-disparition
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

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

  // KPI
  const totalCommission = filteredSales.reduce(
    (acc, s) => acc + s.commission,
    0
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
      setToastMsg("Vente modifiée !");
    } else {
      await createSale(data);
      setToastMsg("Vente ajoutée !");
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
    setToastMsg("Vente supprimée !");
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
      <SalesKPI sales={filteredSales} totalCommission={totalCommission} />


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
            <div className="modal-header">
              <h5>{editingSale ? "Modifier" : "Ajouter"} une vente</h5>
              <button
                className="btn-close"
                onClick={() => formModal?.hide()}
              ></button>
            </div>
            <div className="modal-body">
              <SaleForm
                initialData={editingSale}
                onSubmit={handleSubmit}
                onCancel={() => formModal?.hide()}
                clients={clients}
              />
            </div>
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

      {/* TOAST */}
      <ToastMessage
        message={toastMsg}
        onClose={() => setToastMsg("")}
        variant="success"
      />
    </div>
  );
};

export default SalesPage;