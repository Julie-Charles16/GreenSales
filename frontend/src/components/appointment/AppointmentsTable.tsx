import type { Appointment } from "../../types/appointment";
import type { Client } from "../../types/client";

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
}) => {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Client</th>
              <th>Date</th>
              <th>Adresse</th>
              {/* <th>Commentaire</th> */}
              <th>Statut</th>
              <th>Actions</th>
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
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(appt)}
                    >
                    <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(appt)}
                    >
                    <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;