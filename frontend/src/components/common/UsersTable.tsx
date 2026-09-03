import type { AdminUser, Role } from "../../types/user";
import { roleConfig } from "../../utils/roleConfig";

interface Props {
  users: AdminUser[];
  currentUserId?: number;
  updatingId: number | null;
  roles: Role[];
  managers: AdminUser[];
  onChangeRole: (user: AdminUser, role: Role) => void;
  onChangeManager: (user: AdminUser, managerId: number | null) => void;
  onDelete: (user: AdminUser) => void;
}

const UsersTable: React.FC<Props> = ({
  users,
  currentUserId,
  updatingId,
  roles,
  managers,
  onChangeRole,
  onChangeManager,
  onDelete,
}) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th style={{ minWidth: "170px" }}>Rôle</th>
                <th style={{ minWidth: "200px" }}>Manager</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((managedUser) => {
                const isCurrentUser = managedUser.id === currentUserId;
                const isUpdating = updatingId === managedUser.id;
                const roleColor = roleConfig[managedUser.role].color;

                return (
                  <tr
                    key={managedUser.id}
                    className="table-row-hover"
                    style={{
                      borderLeft: `4px solid var(--bs-${roleColor})`,
                    }}
                  >
                    {/* Utilisateur */}
                    <td>
                      <div className="fw-semibold">
                        {managedUser.pseudo}

                        {isCurrentUser && (
                          <span className="badge text-bg-secondary ms-2">
                            Vous
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="text-muted">
                      {managedUser.email}
                    </td>

                    {/* Rôle */}
                    <td className="pe-4">
                      <select
                        className="form-select form-select-sm"
                        value={managedUser.role}
                        disabled={isCurrentUser || isUpdating}
                        aria-label={`Rôle de ${managedUser.pseudo}`}
                        onChange={(event) =>
                          onChangeRole(
                            managedUser,
                            event.target.value as Role
                          )
                        }
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {roleConfig[role].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Manager */}
                    <td className="pe-4">
                      {managedUser.role === "COMMERCIAL" ? (
                        <select
                          className="form-select form-select-sm"
                          value={managedUser.managerId ?? ""}
                          disabled={isUpdating}
                          aria-label={`Manager de ${managedUser.pseudo}`}
                          onChange={(event) =>
                            onChangeManager(
                              managedUser,
                              event.target.value === ""
                                ? null
                                : Number(event.target.value)
                            )
                          }
                        >
                          <option value="">
                            Aucun manager
                          </option>

                          {managers.map((manager) => (
                            <option
                              key={manager.id}
                              value={manager.id}
                            >
                              {manager.pseudo}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={isCurrentUser || isUpdating}
                        aria-label={`Supprimer ${managedUser.pseudo}`}
                        onClick={() => onDelete(managedUser)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-muted p-4"
                  >
                    Aucun utilisateur ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
