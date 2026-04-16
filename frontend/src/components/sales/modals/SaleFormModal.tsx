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

  // 🔹 si initialData change (modification), mettre à jour le formulaire
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

    // réinitialiser formulaire si nouvelle vente
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

  return (
    <div className="card shadow-sm p-4">
      <h5 className="mb-4 text-primary">
        <i className="bi bi-cash-coin me-2"></i>
        {initialData ? "Modifier la vente" : "Nouvelle vente"}
      </h5>

      <form onSubmit={handleSubmit}>
        {/* Client */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Client</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
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
        </div>

        {/* Montant */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Montant</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-currency-euro"></i>
            </span>
            <input
              className="form-control"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Montant (€)"
            />
          </div>
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
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-flag"></i>
            </span>
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

export default SaleForm;