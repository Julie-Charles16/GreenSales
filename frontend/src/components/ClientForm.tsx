import React, { useState } from "react";
import type { Client, ClientFormData } from "../types/client";

interface Props {
  onSubmit: (data: ClientFormData) => void;
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

const ClientForm: React.FC<Props> = ({ onSubmit, initialData }) => {
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

    // reset UNIQUEMENT en création
    if (!initialData) {
      setFormData(getInitialForm(null));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="Ville" />
      <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Code postal" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" />
      <input name="projectType" value={formData.projectType} onChange={handleChange} placeholder="Projet" />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="PROSPECT">Prospect</option>
        <option value="NEGOCIATION">Négociation</option>
        <option value="DEVIS_ENVOYE">Devis envoyé</option>
        <option value="SIGNE">Signé</option>
        <option value="PERDU">Perdu</option>
      </select>

      <button type="submit">Enregistrer</button>
      <button type="submit">Annuler</button>
    </form>
  );
};

export default ClientForm;