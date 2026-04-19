import React, { useState, useEffect } from "react";
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
  clients?: Client[]
): SaleFormData => ({
  amount: initialData?.amount ?? 0,
  status: (initialData?.status as SaleStatus) ?? "EN_ATTENTE",
  clientId: initialData?.clientId ?? clients?.[0]?.id ?? 0,
});

const SaleForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  clients,
  initialData,
}) => {
  const [formData, setFormData] = useState<SaleFormData>(
    getInitialForm(initialData, clients)
  );

  useEffect(() => {
    setFormData(getInitialForm(initialData, clients));
  }, [initialData, clients]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "amount" || name === "clientId"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);

    if (!initialData) {
      setFormData(getInitialForm(null, clients));
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

        <button className="btn-close" onClick={onCancel}></button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Client */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Client</label>
          <select
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
            💸 Commission estimée : <strong>{commission} €</strong>
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
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Modifier" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;