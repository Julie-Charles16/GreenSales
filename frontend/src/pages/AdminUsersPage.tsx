import { useEffect, useState } from "react";
import { useAuth } from "../context/auth/useAuth";
import { useToast } from "../context/toast/useToast";
import { deleteManagedUser, getUsers, updateManagedUserRole } from "../services/adminService";
import type { AdminUser, Role } from "../types/user";

const roles: Role[] = ["COMMERCIAL", "MANAGER", "ADMIN"];

const roleLabel: Record<Role, string> = {
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  COMMERCIAL: "Commercial",
};

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setUsers(await getUsers());
    } catch {
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const changeRole = async (managedUser: AdminUser, role: Role) => {
    if (managedUser.role === role) return;

    try {
      setUpdatingId(managedUser.id);
      const updated = await updateManagedUserRole(managedUser.id, role);
      setUsers((previous) => previous.map((item) => item.id === updated.id ? { ...item, ...updated } : item));
      showToast({ message: "Rôle utilisateur modifié.", variant: "success" });
    } catch (requestError: unknown) {
      const message = requestError && typeof requestError === "object" && "response" in requestError
        ? (requestError as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      showToast({ message: message || "La modification du rôle a échoué.", variant: "danger" });
    } finally {
      setUpdatingId(null);
    }
  };

  const removeUser = async (managedUser: AdminUser) => {
    if (!window.confirm(`Supprimer définitivement le compte de ${managedUser.pseudo} ?`)) return;

    try {
      setUpdatingId(managedUser.id);
      await deleteManagedUser(managedUser.id);
      setUsers((previous) => previous.filter((item) => item.id !== managedUser.id));
      showToast({ message: "Utilisateur supprimé.", variant: "success" });
    } catch (requestError: unknown) {
      const message = requestError && typeof requestError === "object" && "response" in requestError
        ? (requestError as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      showToast({ message: message || "La suppression a échoué.", variant: "danger" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold">Utilisateurs</h2>
        <small className="text-muted">Gérez les rôles et les comptes de la plateforme.</small>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? <div className="p-4 text-muted">Chargement des utilisateurs…</div> : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-3">Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((managedUser) => {
                    const isCurrentUser = managedUser.id === currentUser?.id;
                    const isUpdating = updatingId === managedUser.id;

                    return (
                      <tr key={managedUser.id}>
                        <td className="ps-3 fw-semibold">
                          {managedUser.pseudo}
                          {isCurrentUser && <span className="badge text-bg-secondary ms-2">Vous</span>}
                        </td>
                        <td>{managedUser.email}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={managedUser.role}
                            disabled={isCurrentUser || isUpdating}
                            aria-label={`Rôle de ${managedUser.pseudo}`}
                            onChange={(event) => void changeRole(managedUser, event.target.value as Role)}
                          >
                            {roles.map((role) => <option key={role} value={role}>{roleLabel[role]}</option>)}
                          </select>
                        </td>
                        <td className="text-end pe-3">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={isCurrentUser || isUpdating}
                            aria-label={`Supprimer ${managedUser.pseudo}`}
                            onClick={() => void removeUser(managedUser)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && <tr><td colSpan={4} className="text-center text-muted p-4">Aucun utilisateur.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
