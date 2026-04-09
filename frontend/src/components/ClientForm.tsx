import React, { useState } from "react";
import type { Client, ClientFormData } from "../types/client";

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
  userId: 1,
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <input className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
      </div>

      <div className="mb-2">
        <input className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" />
      </div>

      <div className="mb-2">
        <input className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      </div>

      <div className="mb-2">
        <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" />
      </div>

      <div className="mb-2">
        <input className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
      </div>

      <div className="row">
        <div className="col">
          <input className="form-control" name="city" value={formData.city} onChange={handleChange} placeholder="Ville" />
        </div>
        <div className="col">
          <input className="form-control" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Code postal" />
        </div>
      </div>

      <div className="mt-2">
        <input className="form-control" name="projectType" value={formData.projectType} onChange={handleChange} placeholder="Projet" />
      </div>

      <div className="mt-2">
        <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
          <option value="PROSPECT">Prospect</option>
          <option value="NEGOCIATION">Négociation</option>
          <option value="DEVIS_ENVOYE">Devis envoyé</option>
          <option value="SIGNE">Signé</option>
          <option value="PERDU">Perdu</option>
        </select>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ClientForm;