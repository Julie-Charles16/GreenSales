import React, { useEffect, useState, useRef } from "react";
import { getClients, createClient, updateClient, deleteClient } from "../services/clientService";
import type { Client, ClientFormData } from "../types/client";
import ClientForm from "../components/ClientForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "bootstrap";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // 🔹 refs modales
  const formModalRef = useRef<HTMLDivElement>(null);
  const detailModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [detailModal, setDetailModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  // 🔹 init modales
  useEffect(() => {
    if (formModalRef.current) setFormModal(new Modal(formModalRef.current, { backdrop: 'static' }));
    if (detailModalRef.current) setDetailModal(new Modal(detailModalRef.current));
    if (deleteModalRef.current) setDeleteModal(new Modal(deleteModalRef.current));
  }, []);

  // 🔹 chargement clients
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

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  // 🔹 filtres
  const filteredClients = clients
    .filter(c =>
      `${c.name} ${c.firstName} ${c.email}`.toLowerCase().includes(search.toLowerCase()) &&
      (filterCity ? c.city === filterCity : true) &&
      (filterStatus ? c.status === filterStatus : true)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

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

  // 🔹 actions
  const handleAdd = () => {
    setEditingClient(null);
    formModal?.show();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    formModal?.show();
  };

  const handleViewDetail = (client: Client) => {
    setDetailClient(client);
    detailModal?.show();
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

  // 🔥 ouverture modal suppression
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    deleteModal?.show();
  };

  // 🔥 confirmation suppression
  const confirmDelete = async () => {
    if (!clientToDelete) return;

    await deleteClient(clientToDelete.id);
    setToastMsg("Client supprimé !");
    setClientToDelete(null);
    deleteModal?.hide();
    await loadClients();
  };

  // 🔹 filtres options
  const cities = Array.from(new Set(clients.map(c => c.city))).sort();
  const statuses = Array.from(new Set(clients.map(c => c.status)));

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
        <h2>Clients</h2>
        <button className="btn btn-primary" onClick={handleAdd}>+ Ajouter</button>
      </div>

      {/* FILTRES */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterCity} onChange={e => setFilterCity(e.target.value)}>
            <option value="">Toutes les villes</option>
            {cities.map(city => <option key={city}>{city}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tous statuts</option>
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Ville</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name} {client.firstName}</td>
                  <td>{client.email}</td>
                  <td>{client.city}</td>
                  <td><span className={`badge bg-${getStatusColor(client.status)}`}>{client.status}</span></td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleViewDetail(client)}>Voir</button>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(client)}>Modifier</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(client)}>Supprimer</button>
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
              <h5>{editingClient ? "Modifier" : "Ajouter"} un client</h5>
              <button className="btn-close" onClick={() => formModal?.hide()}></button>
            </div>
            <div className="modal-body">
              <ClientForm initialData={editingClient} onSubmit={handleSubmit} onCancel={() => formModal?.hide()} />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      <div className="modal fade" ref={detailModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Détails</h5>
              <button className="btn-close" onClick={() => detailModal?.hide()}></button>
            </div>
            <div className="modal-body">
               {detailClient && (
                <div>
                  <p><strong>Nom :</strong> {detailClient.name} {detailClient.firstName}</p>
                  <p><strong>Email :</strong> {detailClient.email}</p>
                  <p><strong>Adresse :</strong> {detailClient.address}, {detailClient.city} {detailClient.postalCode}</p>
                  <p><strong>Téléphone :</strong> {detailClient.phone}</p>
                  <p><strong>Projet :</strong> {detailClient.projectType}</p>
                  <p><strong>Statut :</strong> <span className={`badge bg-${getStatusColor(detailClient.status)}`}>{detailClient.status}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL DELETE */}
      <div className="modal fade" ref={deleteModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="text-danger">⚠️ Supprimer</h5>
              <button className="btn-close" onClick={() => deleteModal?.hide()}></button>
            </div>
            <div className="modal-body">
              <p>Voulez-vous vraiment supprimer ce client ?</p>
              {clientToDelete && (
                <div className="alert alert-light border">
                  <strong>{clientToDelete.name} {clientToDelete.firstName}</strong>
                  <br />
                  <small>{clientToDelete.email}</small>
                </div>
              )}
              <p className="text-danger mb-0">Action irréversible</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => deleteModal?.hide()}>Annuler</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div className={`toast align-items-center text-bg-success ${toastMsg ? "show" : ""}`} role="alert">
          <div className="d-flex">
            <div className="toast-body">{toastMsg}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMsg("")}></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;