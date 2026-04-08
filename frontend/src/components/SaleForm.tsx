import React, { useState } from "react";
import type { Sale, SaleFormData, SaleStatus } from "../types/sale";
import type { Client } from "../types/client";

interface Props {
  onSubmit: (data: SaleFormData) => void;
  clients: Client[];
  initialData?: Sale | null;
  onCancel?: () => void;
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
  clients,
  initialData,
  onCancel,
}) => {
  const [formData, setFormData] = useState<SaleFormData>(
    getInitialForm(initialData, clients)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "clientId" || name === "userId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    onSubmit(formData);

    if (!initialData) {
      setFormData(getInitialForm(null, clients));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="amount"
        placeholder="Montant (€)"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="EN_ATTENTE">En attente</option>
        <option value="ANNULEE">Annulée</option>
        <option value="TERMINEE">Terminée</option>
      </select>

      <select name="clientId" value={formData.clientId} onChange={handleChange}>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} {client.firstName}
          </option>
        ))}
      </select>

      <button type="submit">Enregistrer</button>

      {onCancel && (
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      )}
    </form>
  );
};

export default SaleForm;