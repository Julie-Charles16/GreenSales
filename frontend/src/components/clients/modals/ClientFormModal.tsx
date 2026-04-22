import React, { useState, useEffect } from "react";
import type { Client, ClientFormData } from "../../../types/client";

interface Props {
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Client | null;
  isOpen?: boolean; // 🔥 AJOUT IMPORTANT
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
});

const ClientForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  initialData,
  isOpen,
}) => {
  const [formData, setFormData] = useState<ClientFormData>(
    getInitialForm(initialData)
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 RESET COMPLET QUAND MODAL S’OUVRE
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialForm(initialData));
      setError(null);
      setLoading(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name.trim() ||
      !formData.firstName.trim() ||
      !formData.email.trim()
    ) {
      setError("Nom, prénom et email sont obligatoires");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);

      if (!initialData) {
        setFormData(getInitialForm(null));
      }
    } catch (err: unknown) {
      let message = "Email déjà existant";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const response = (err as {
          response?: { data?: { message?: string } };
        }).response;

        if (typeof response?.data?.message === "string") {
          message = response.data.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData;

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-primary m-0">
          <i className="bi bi-person-lines-fill me-2"></i>
          {isEdit ? "Modifier le client" : "Nouveau client"}
        </h5>

        <button className="btn-close" onClick={onCancel}></button>
      </div>

      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom"
              />
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-envelope-at"></i>
            </span>
            <input
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-telephone"></i>
            </span>
            <input
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Téléphone"
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-geo-alt"></i>
            </span>
            <input
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 mb-3">
            <input
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ville"
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              className="form-control"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Code postal"
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-briefcase"></i>
            </span>
            <input
              className="form-control"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              placeholder="Type de projet"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Statut</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="PROSPECT">Prospect</option>
            <option value="NEGOCIATION">Négociation</option>
            <option value="DEVIS_ENVOYE">Devis envoyé</option>
            <option value="SIGNE">Signé</option>
            <option value="PERDU">Perdu</option>
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Chargement..." : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                {isEdit ? "Modifier" : "Ajouter"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;