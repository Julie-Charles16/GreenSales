import type { Appointment } from "../../types/appointment";
import type { Client } from "../../types/client";
import UserBadge from "../common/UserBadge";

interface Props {
  appointments: Appointment[];
  clients: Client[];
  getClientName: (clientId: number) => string;
  getClientProjectType: (clientId: number) => string;
  getClientAddress: (clientId: number) => string;
  getStatusColor: (status: string) => string;
  getStatusBorderColor: (status: string) => string;
  formatDate: (date: string) => string;
  onEdit: (appt: Appointment) => void;
  onDelete: (appt: Appointment) => void;
  canEdit: (appt: Appointment) => boolean;
  canDelete: (appt: Appointment) => boolean;
  showCommercial: boolean;
}

const AppointmentsTable: React.FC<Props> = ({
  appointments,
  getClientName,
  getClientProjectType,
  getClientAddress,
  getStatusColor,
  getStatusBorderColor,
  formatDate,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  showCommercial,
}) => {
  const hasActions = appointments.some((appointment) => canEdit(appointment) || canDelete(appointment));
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {showCommercial && <th>Commercial</th>}
              <th>Client</th>
              <th>Date</th>
              <th>Adresse</th>
              {/* <th>Commentaire</th> */}
              <th>Statut</th>
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {appointments.map((appt) => (
              <tr
                key={appt.id}
                style={{
                  borderLeft: `4px solid ${getStatusBorderColor(appt.status)}`,
                }}
              >

                {showCommercial && (
                  <td>
                    {appt.user && (
                      <UserBadge
                        pseudo={appt.user.pseudo}
                        role={appt.user.role}
                      />
                    )}
                  </td>
                )}       
                {/* Client */}
                <td>
                  <div className="fw-semibold">
                    {getClientName(appt.clientId)}
                  </div>
                  <small className="text-muted">
                    {getClientProjectType(appt.clientId)}
                  </small>
                </td>

                {/* Date */}
                <td>
                  <small className="text-muted">
                    {formatDate(appt.date)}
                  </small>
                </td>

                {/* Adresse */}
                <td>
                  {getClientAddress(appt.clientId)}
                </td>

                {/* Commentaire */}
                {/* <td>
                  <span className="text-muted">
                    {appt.comment || "—"}
                  </span>
                </td> */}

                {/* Statut */}
                <td>
                  <span className={`badge bg-${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </td>

                {/* Actions */}
                {hasActions && <td>
                  <div className="d-flex gap-2">
                    {canEdit(appt) && <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(appt)}
                    >
                    <i className="bi bi-pencil"></i>
                    </button>}

                    {canDelete(appt) && <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(appt)}
                    >
                    <i className="bi bi-trash"></i>
                    </button>}
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
