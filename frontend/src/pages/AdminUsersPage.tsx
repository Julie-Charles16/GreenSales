import { useEffect, useState } from "react";
import { useAuth } from "../context/auth/useAuth";
import { useToast } from "../context/toast/useToast";
import { deleteManagedUser, getUsers, updateManagedUserRole, updateManagedUserManager } from "../services/adminService";
import type { AdminUser, Role } from "../types/user";
import { roleConfig } from "../utils/roleConfig";
// import RoleBadge from "../components/common/RoleBadge";

import { useBootstrapModal } from "../hooks/useBootstrapModal";
import UserDeleteModal from "../components/common/UserDeleteModal";

import PageHeader from "../components/common/PageHeader";
import FiltersBar from "../components/common/FiltersBar";
import UsersKPI from "../components/common/UsersKPI";
import UsersTable from "../components/common/UsersTable";


const roles: Role[] = ["COMMERCIAL", "MANAGER", "ADMIN"];

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const {
    deleteModalRef,
    deleteModal,
  } = useBootstrapModal();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");

  const managers = users.filter(
  (user) => user.role === "MANAGER"
  );

  const filteredUsers = users.filter((managedUser) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      managedUser.pseudo.toLowerCase().includes(searchValue) ||
      managedUser.email.toLowerCase().includes(searchValue);

    const matchesRole =
      !roleFilter ||
      managedUser.role === roleFilter;

    const matchesManager =
      !managerFilter ||
      managedUser.managerId === Number(managerFilter);

    return (
      matchesSearch &&
      matchesRole &&
      matchesManager
    );
  });

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

  const changeManager = async (
    managedUser: AdminUser,
    managerId: number | null
  ) => {
    try {
      setUpdatingId(managedUser.id);

      const updated = await updateManagedUserManager(
        managedUser.id,
        managerId
      );

      setUsers((previous) =>
        previous.map((item) =>
          item.id === updated.id
            ? { ...item, ...updated }
            : item
        )
      );

      showToast({
        message: "Manager modifié.",
        variant: "success",
      });

    } catch {
      showToast({
        message: "La modification du manager a échoué.",
        variant: "danger",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const openDeleteModal = (managedUser: AdminUser) => {
    setSelectedUser(managedUser);
    deleteModal?.show();
  };

  const closeDeleteModal = () => {
    deleteModal?.hide();
    setSelectedUser(null);
  };

  const removeUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdatingId(selectedUser.id);

      await deleteManagedUser(selectedUser.id);

      setUsers((previous) =>
        previous.filter((item) => item.id !== selectedUser.id)
      );

      showToast({
        message: "Utilisateur supprimé.",
        variant: "success",
      });

      closeDeleteModal();
    } catch (requestError: unknown) {
      const message =
        requestError &&
        typeof requestError === "object" &&
        "response" in requestError
          ? (
              requestError as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      showToast({
        message: message || "La suppression a échoué.",
        variant: "danger",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes, les rôles et l'organisation des équipes commerciales."
      />

      <FiltersBar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Rechercher un utilisateur..."
        selects={[
          {
            value: roleFilter,
            setValue: setRoleFilter,
            placeholder: "Tous les rôles",
            options: roles.map((role) => ({
              value: role,
              label: roleConfig[role].label,
            })),
          },
          {
            value: managerFilter,
            setValue: setManagerFilter,
            placeholder: "Tous les managers",
            options: managers.map((manager) => ({
              value: String(manager.id),
              label: manager.pseudo,
            })),
          },
        ]}
      />

      <UsersKPI users={users} />

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card shadow-sm">
          <div className="card-body p-4 text-muted">
            Chargement des utilisateurs…
          </div>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          currentUserId={currentUser?.id}
          updatingId={updatingId}
          roles={roles}
          managers={managers}
          onChangeRole={(user, role) => void changeRole(user, role)}
          onChangeManager={(user, managerId) =>
            void changeManager(user, managerId)
          }
          onDelete={openDeleteModal}
        />
      )}

      <UserDeleteModal
        user={selectedUser}
        modalRef={deleteModalRef}
        onClose={closeDeleteModal}
        onConfirm={() => void removeUser()}
      />
    </div>
  );
};

export default AdminUsersPage;
