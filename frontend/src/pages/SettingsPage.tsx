import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/auth/useAuth";
import {
  updateUser,
  updatePassword,
  deleteAccount,
} from "../services/userService";
import axios from "axios";

const SettingsPage: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">("profile");

  // ======================
  // PROFILE STATE
  // ======================
  const [formData, setFormData] = useState({
    pseudo: user?.pseudo || "",
    email: user?.email || "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // ======================
  // PASSWORD STATE
  // ======================
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 👁️ TOGGLE VISIBILITY
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // ======================
  // DELETE STATE
  // ======================
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [countdown, setCountdown] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // ======================
  // PROFILE HANDLER
  // ======================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await updateUser(formData);
      login(localStorage.getItem("token")!, res.user);

      setProfileMessage("Profil mis à jour ✅");
      setProfileError("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setProfileError(err.response?.data?.message || "Erreur API");
      } else {
        setProfileError("Erreur inconnue");
      }
    }
  };

  // ======================
  // PASSWORD HANDLER
  // ======================
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePassword(passwordData);

      setPasswordMessage("Mot de passe mis à jour 🔐");
      setPasswordError("");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.message || "Erreur API");
      } else {
        setPasswordError("Erreur inconnue");
      }
    }
  };

  // ======================
  // DELETE INIT
  // ======================
  const handleDeleteInit = (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmText !== "SUPPRIMER") {
      setDeleteError("Tape SUPPRIMER pour confirmer");
      return;
    }

    setDeleteError("");
    setIsDeleting(true);
    setCountdown(5);

    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  };

  // ======================
  // DELETE EXECUTION
  // ======================
  useEffect(() => {
    if (!isDeleting) return;

    if (countdown <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const runDelete = async () => {
        try {
          await deleteAccount({ password: deletePassword });

          setDeleteMessage("Compte supprimé avec succès");

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/login";
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            setDeleteError(err.response?.data?.message || "Erreur API");
          } else {
            setDeleteError("Erreur inconnue");
          }

          setIsDeleting(false);
        }
      };

      runDelete();
    }
  }, [countdown, isDeleting, deletePassword]);

  // ======================
  // UI
  // ======================
  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="mb-1">Paramètres</h1>
        <p className="text-muted mb-0">
          Gérez vos informations personnelles et la sécurité de votre compte
        </p>
      </div>

      {/* TABS */}
      <div className="d-flex gap-2 mb-4">
        <button className={`btn ${activeTab === "profile" ? "btn-dark" : "btn-outline-secondary"}`} onClick={() => setActiveTab("profile")}>
          <i className="bi bi-person me-1"></i> Profil
        </button>

        <button className={`btn ${activeTab === "security" ? "btn-dark" : "btn-outline-secondary"}`} onClick={() => setActiveTab("security")}>
          <i className="bi bi-shield-lock me-1"></i> Sécurité
        </button>

        <button className={`btn ${activeTab === "danger" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setActiveTab("danger")}>
          <i className="bi bi-exclamation-triangle me-1"></i> Danger
        </button>
      </div>

      <div className="card shadow-sm p-4">

        {/* PROFILE */}
        {activeTab === "profile" && (
          <>
            <h5 className="mb-4 text-primary">Informations personnelles</h5>

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Pseudo</label>
                <input name="pseudo" className="form-control" value={formData.pseudo} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input name="email" className="form-control" value={formData.email} onChange={handleChange} />
              </div>

              {profileMessage && <div className="col-12 alert alert-success">{profileMessage}</div>}
              {profileError && <div className="col-12 alert alert-danger">{profileError}</div>}

              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-primary px-4">Enregistrer</button>
              </div>
            </form>
          </>
        )}

        {/* PASSWORD */}
        {activeTab === "security" && (
          <>
            <h5 className="mb-4 text-warning">Sécurité du compte</h5>

            <form onSubmit={handlePasswordSubmit} className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Ancien mot de passe</label>
                <div className="input-group">
                  <input type={showOldPassword ? "text" : "password"} name="oldPassword" className="form-control" value={passwordData.oldPassword} onChange={handlePasswordChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowOldPassword(!showOldPassword)}>
                    <i className={`bi ${showOldPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Nouveau mot de passe</label>
                <div className="input-group">
                  <input type={showNewPassword ? "text" : "password"} name="newPassword" className="form-control" value={passwordData.newPassword} onChange={handlePasswordChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                    <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              {passwordMessage && <div className="col-12 alert alert-success">{passwordMessage}</div>}
              {passwordError && <div className="col-12 alert alert-danger">{passwordError}</div>}

              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-warning px-4">🔐 Mettre à jour</button>
              </div>
            </form>
          </>
        )}

        {/* DELETE */}
        {activeTab === "danger" && (
          <>
            <h5 className="mb-3 text-danger">Zone dangereuse</h5>

            <div className="alert alert-danger">
              Cette action est irréversible. Toutes vos données seront supprimées.
            </div>

            <form onSubmit={handleDeleteInit} className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Mot de passe</label>
                <div className="input-group">
                  <input type={showDeletePassword ? "text" : "password"} className="form-control" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} disabled={isDeleting} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeletePassword(!showDeletePassword)} disabled={isDeleting}>
                    <i className={`bi ${showDeletePassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Confirmation</label>
                <input type="text" className="form-control" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Tapez SUPPRIMER" disabled={isDeleting} />
              </div>

              {countdown > 0 && <div className="col-12 alert alert-warning text-center">Suppression dans {countdown}s...</div>}
              {deleteMessage && <div className="col-12 alert alert-success">{deleteMessage}</div>}
              {deleteError && <div className="col-12 alert alert-danger">{deleteError}</div>}

              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-danger px-4" disabled={isDeleting}>
                  Supprimer le compte
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default SettingsPage;