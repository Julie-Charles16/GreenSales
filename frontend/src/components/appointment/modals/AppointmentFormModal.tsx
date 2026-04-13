import React, { useState, useEffect, useRef} from "react";
import type { Appointment, AppointmentFormData } from "../../../types/appointment";
import type { Client } from "../../../types/client";

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
    
    <div className="card shadow-sm p-4">
  <h5 className="mb-4 text-primary">
    <i className="bi bi-calendar-check me-2"></i>
    {initialData?.id ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
  </h5>

  <form onSubmit={handleSubmit}>
    {/* Date */}
    <div className="mb-3">
      <label className="form-label fw-semibold">Date</label>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-calendar-event"></i>
        </span>
        <input
          type="datetime-local"
          name="date"
          className="form-control"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    {/* Client */}
    <div className="mb-3">
      <label className="form-label fw-semibold">Client</label>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-person"></i>
        </span>
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
    </div>

    {/* Statut */}
    <div className="mb-3">
      <label className="form-label fw-semibold">Statut</label>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-flag"></i>
        </span>
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
    </div>

    {/* Commentaire */}
    <div className="mb-4">
      <label className="form-label fw-semibold">Commentaire</label>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-chat-left-text"></i>
        </span>
        <textarea
          name="comment"
          className="form-control"
          value={formData.comment}
          placeholder="Ajouter un commentaire..."
          onChange={(e) => {
            handleChange(e);
            handleAutoResize();
          }}
          rows={2}
        />
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

export default AppointmentForm;