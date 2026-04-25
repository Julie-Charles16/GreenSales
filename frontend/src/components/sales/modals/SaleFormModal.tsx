import React, { useState } from "react";
import type { Sale, SaleFormData, SaleStatus } from "../../../types/sale";
import type { Client } from "../../../types/client";

interface Props {
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
  clients: Client[];
  initialData?: Sale | null;
}

const getInitialForm = (
  initialData?: Sale | null,
  // clients?: Client[]
): SaleFormData => ({
  amount: initialData?.amount ?? 0,
  status: (initialData?.status as SaleStatus) ?? "EN_ATTENTE",
  // clientId: initialData?.clientId ?? clients?.[0]?.id ?? 0,
    clientId: initialData?.clientId ?? 0, // 🔥 important

});

const SaleForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  clients,
  initialData,
}) => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SaleFormData>(() =>
    getInitialForm(initialData)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "clientId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      setError("Le montant doit être supérieur à 0 €");
      return;
    }

    setError(null);
    onSubmit(formData);

    if (!initialData) {
      setFormData(getInitialForm(null));
    }
  };

  const calculateCommission = (amount: number) => {
    if (amount >= 20000) return amount * 0.10;
    if (amount >= 10000) return amount * 0.07;
    return amount * 0.05;
  };

  const commission = calculateCommission(formData.amount);
  const isEdit = !!initialData;

  return (
    <div className="card shadow-sm p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-primary m-0">
          <i className="bi bi-cash-coin me-2"></i>
          {isEdit ? "Modifier la vente" : "Nouvelle vente"}
        </h5>

        <button
          className="btn-close"
          onClick={() => {
            setError(null);
            onCancel();
          }}
        ></button>
      </div>

      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Client */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Client</label>
          {/* <select
            className="form-select"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.firstName}
              </option>
            ))}
          </select> */}
          <select
            name="clientId"
            className={`form-select ${formData.clientId === 0 ? "is-invalid" : ""}`}
            value={formData.clientId}
            onChange={handleChange}
          >
            <option value={0}>-- Sélectionner un client --</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.firstName}
              </option>
            ))}
          </select>
        </div>

        {/* Montant */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Montant</label>
          <input
            className="form-control"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        {/* Commission */}
        <div className="mb-3">
          <div className="alert alert-success py-2 mb-0">
            <i className="bi bi-cash-coin me-2 text-success"></i>
            Commission estimée : <strong>{commission} €</strong>
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
            <option value="EN_ATTENTE">En attente</option>
            <option value="ANNULEE">Annulée</option>
            <option value="TERMINEE">Terminée</option>
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
          >
            {isEdit ? "Modifier" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;