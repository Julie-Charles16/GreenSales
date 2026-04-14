import React, { useState, useEffect } from "react";
import type { Client, ClientFormData } from "../../../types/client";

interface Props {
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  initialData?: Client | null;
}

const getInitialForm = (initialData?: Client | null): ClientFormData => ({
  name: initialData?.name || "",
  firstName: initialData?.firstName || "",
  address: initialData?.address || "",
  city: initialData?.city || "",
  postalCode: initialData?.postalCode || "",
  email: initialData?.email || "",
  phone: initialData?.phone || "",
  projectType: initialData?.projectType || "",
  status: initialData?.status || "PROSPECT",
});

const ClientForm: React.FC<Props> = ({ onSubmit,onCancel, initialData }) => {
  const [formData, setFormData] = useState<ClientFormData>(
    getInitialForm(initialData)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);

    if (!initialData) {
      setFormData(getInitialForm(null));
    }
  };

  useEffect(() => {
  setFormData(getInitialForm(initialData));
}, [initialData]);

  return (
  <div className="card shadow-sm p-4">
    <h5 className="mb-4 text-primary">
      <i className="bi bi-person-lines-fill me-2"></i>
      {initialData ? "Modifier le client" : "Nouveau client"}
    </h5>

    <form onSubmit={handleSubmit}>
      {/* Nom + prénom */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom"
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
            <input
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
            />
          </div>
        </div>
      </div>

      {/* Email + téléphone */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-envelope"></i>
          </span>
          <input
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-telephone"></i>
          </span>
          <input
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Téléphone"
          />
        </div>
      </div>

      {/* Adresse */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-geo-alt"></i>
          </span>
          <input
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Adresse"
          />
        </div>
      </div>

      {/* Ville + code postal */}
      <div className="row">
        <div className="col-md-8 mb-3">
          <input
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ville"
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            className="form-control"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Code postal"
          />
        </div>
      </div>

      {/* Projet */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-briefcase"></i>
          </span>
          <input
            className="form-control"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            placeholder="Type de projet"
          />
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Statut</label>
        <select
          className="form-select"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="PROSPECT">Prospect</option>
          <option value="NEGOCIATION">Négociation</option>
          <option value="DEVIS_ENVOYE">Devis envoyé</option>
          <option value="SIGNE">Signé</option>
          <option value="PERDU">Perdu</option>
        </select>
      </div>

      {/* Boutons */}
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          <i className="bi bi-x-circle me-1"></i>
          Annuler
        </button>

        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check-circle me-1"></i>
          Enregistrer
        </button>
      </div>
    </form>
  </div>
);
};

export default ClientForm;