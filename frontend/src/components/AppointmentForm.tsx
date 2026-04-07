import React, { useState } from "react";
import type { Appointment, AppointmentFormData } from "../types/appointment";
import type { Client } from "../types/client";

interface Props {
  onSubmit: (data: AppointmentFormData) => void;
  clients: Client[];
  initialData?: Appointment | null;
}

const getInitialForm = (
  initialData?: Appointment | null,
  clients?: Client[]
): AppointmentFormData => ({
  date: initialData ? initialData.date.slice(0, 16) : "",
  status: initialData?.status || "PLANIFIE",
  comment: initialData?.comment || "",
  clientId: initialData?.clientId || clients?.[0]?.id || 1,
  userId: initialData?.userId || 1,
});

const AppointmentForm: React.FC<Props> = ({
  onSubmit,
  clients,
  initialData,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>(
    getInitialForm(initialData, clients)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "clientId" || name === "userId" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    onSubmit({
      ...formData,
      date: new Date(formData.date).toISOString(),
    });

    // reset uniquement en création
    if (!initialData) {
      setFormData(getInitialForm(null, clients));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="PLANIFIE">Planifié</option>
        <option value="TERMINE">Terminé</option>
        <option value="ANNULE">Annulé</option>
      </select>

      <select name="clientId" value={formData.clientId} onChange={handleChange}>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} {client.firstName}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="comment"
        placeholder="Commentaire"
        value={formData.comment}
        onChange={handleChange}
      />

      <button type="submit">Enregistrer</button>
      <button type="button">Annuler</button>
    </form>
  );
};

export default AppointmentForm;