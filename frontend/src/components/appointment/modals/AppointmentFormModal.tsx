import React, { useState, useRef } from "react";
import type { Appointment, AppointmentFormData } from "../../../types/appointment";
import type { Client } from "../../../types/client";

interface Props {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  clients: Client[];
  initialData?: Appointment | null;
}

const getInitialForm = (
  initialData?: Appointment | null
): AppointmentFormData => ({
  date: initialData ? initialData.date.slice(0, 16) : "",
  status: initialData?.status || "PLANIFIE",
  comment: initialData?.comment || "",
  clientId: initialData?.clientId ?? 0, // 🔥 important
});

const AppointmentForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  onDelete,
  clients,
  initialData,
}) => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AppointmentFormData>(() =>
    getInitialForm(initialData)
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "clientId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.clientId === 0) {
      setError("Veuillez sélectionner un client");
      return;
    }

    if (!formData.date) {
      setError("Veuillez renseigner une date");
      return;
    }

    setError(null);

    onSubmit({
      ...formData,
      date: new Date(formData.date).toISOString(),
    });

    // reset seulement en création
    if (!initialData) {
      setFormData(getInitialForm(null));
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAutoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const isEdit = initialData && initialData.id !== 0;

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-primary m-0">
          <i className="bi bi-calendar-check me-2"></i>
          {isEdit ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
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
        {/* Date */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Date</label>
          <input
            type="datetime-local"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Client */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Client</label>

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

        {/* Statut */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Statut</label>

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

        {/* Commentaire */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Commentaire</label>

          <textarea
            ref={textareaRef}
            name="comment"
            className="form-control"
            value={formData.comment}
            onChange={(e) => {
              handleChange(e);
              handleAutoResize();
            }}
            rows={2}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Modifier" : "Ajouter"}
          </button>

          {isEdit && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onDelete}
            >
              Supprimer
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;