import React, { useState, useEffect, useRef} from "react";
import type { Appointment, AppointmentFormData } from "../types/appointment";
import type { Client } from "../types/client";

interface Props {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
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
  onCancel,
  clients,
  initialData,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>(
    getInitialForm(initialData, clients)
  );

  // 🔥 FIX pré-remplissage
  useEffect(() => {
    setFormData(getInitialForm(initialData, clients));
  }, [initialData, clients]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;

    setFormData({
      ...formData,
      [target.name]:
        target.name === "clientId" ? Number(target.value) : target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      date: new Date(formData.date).toISOString(),
    });

    if (!initialData) {
      setFormData(getInitialForm(null, clients));
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

const handleAutoResize = () => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="form-label">Date</label>
        <input
          type="datetime-local"
          name="date"
          className="form-control"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Client</label>
        <select
          name="clientId"
          className="form-select"
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
        <label className="form-label">Statut</label>
        <select
          name="status"
          className="form-select"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="PLANIFIE">Planifié</option>
          <option value="TERMINE">Terminé</option>
          <option value="ANNULE">Annulé</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Commentaire</label>
        <textarea
          name="comment"
          className="form-control"
          value={formData.comment}
          placeholder="Commentaire"
          onChange={(e) => {
            handleChange(e);
            handleAutoResize();
          }}
        />
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

export default AppointmentForm;