import React, { useState, useEffect } from "react";
import type { Sale, SaleFormData, SaleStatus } from "../types/sale";
import type { Client } from "../types/client";

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
  userId: initialData?.userId ?? 1,
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
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
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
      
      <div className="mb-2">
        <input
          className="form-control"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Montant (€)"
        />
      </div>
      <p className="text-success mt-2">
        💸 Commission estimée : <strong>{commission} €</strong>
      </p>

      <div className="mb-2">
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


      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Annuler
        </button>

        <button type="submit" className="btn btn-primary">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default SaleForm;