import React, { useEffect, useState, useRef } from "react";
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from "../services/saleService";
import { getClients } from "../services/clientService";

import type { Sale, SaleFormData } from "../types/sale";
import type { Client } from "../types/client";

import SaleForm from "../components/SaleForm";

import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

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
      const [salesData, clientsData] = await Promise.all([
        getSales(),
        getClients(),
      ]);
      setSales(salesData);
      setClients(clientsData);
    };

    void fetchData();
  }, []);

  const loadSales = async () => {
    const data = await getSales();
    setSales(data);
  };

  // 🔹 helpers
  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} ${client.firstName}` : "Client inconnu";
  };

  const getClientProjectType = (clientId: number): string => {
   const client = clients.find((c) => c.id === clientId);
   return client ? client.projectType : "Non défini";
  };

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

  // 🔹 filtres
  const filteredSales = sales.filter(
    (s) =>
      getClientName(s.clientId)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filterStatus ? s.status === filterStatus : true)
  );

  const statuses = Array.from(new Set(sales.map((s) => s.status)));

  // 🔹 actions
  const handleAdd = () => {
    setEditingSale(null); // nouvelle vente = formulaire vide
    formModal?.show();
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale); // modification = pré-remplir
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

  // 🔹 toast auto
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ventes</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Ajouter
        </button>
      </div>

      {/* FILTRES */}
      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Rechercher par client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tous statuts</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Client</th>
                <th>Montant</th>
                <th>Commission</th>
                <th>Projet</th>
                <th>Statut</th>
                <th>Signé le</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{getClientName(sale.clientId)}</td>
                  <td>{sale.amount} €</td>
                  <td>{sale.commission} €</td>
                  <td>{getClientProjectType(sale.clientId)}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td>{sale.signedAt}</td>

                  <td className="text-end">
                
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(sale)}
                    >
                      Modifier
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteClick(sale)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
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
      <div className="modal fade" ref={deleteModalRef} tabIndex={-1}>
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
              <p>Voulez-vous vraiment supprimer cette vente ?</p>

              {saleToDelete && (
                <div className="alert alert-light border">
                  <strong>{getClientName(saleToDelete.clientId)}</strong>
                  <br />
                  <small>{saleToDelete.amount} €</small>
                </div>
              )}

              <p className="text-danger mb-0">Action irréversible</p>
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
      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          className={`toast align-items-center text-bg-success ${
            toastMsg ? "show" : ""
          }`}
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

export default SalesPage;