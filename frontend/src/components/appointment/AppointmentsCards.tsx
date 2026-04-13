import type { Appointment } from "../../types/appointment";
import type { Client } from "../../types/client";

interface Props {
  appointments: Appointment[];
  clients: Client[];
  getClientName: (clientId: number) => string;
  getClientProjectType: (clientId: number) => string;
  getStatusColor: (status: string) => string;
  getStatusBorderColor: (status: string) => string;
  formatDate: (date: string) => string;
  onEdit: (appt: Appointment) => void;
  onDelete: (appt: Appointment) => void;
}

const AppointmentsCards: React.FC<Props> = ({
  appointments,
  getClientName,
  getClientProjectType,
  getStatusColor,
  getStatusBorderColor,
  formatDate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="row mt-4">
      {appointments.map((appt) => (
        <div className="col-md-4 mb-3" key={appt.id}>
          <div
            className="card shadow-sm h-100"
            style={{
              borderLeft: `4px solid ${getStatusBorderColor(appt.status)}`,
              cursor: "pointer",
            }}
            onClick={() => onEdit(appt)}
          >
            <div className="card-body d-flex flex-column">
              
              {/* HEADER */}
              <div className="mb-2">
                <h5 className="mb-0">
                  {getClientName(appt.clientId)}
                </h5>
                <small className="text-muted">
                  {getClientProjectType(appt.clientId)}
                </small>
              </div>

              {/* DATE */}
              <p className="text-muted mb-2">
                📅 {formatDate(appt.date)}
              </p>

              {/* COMMENT */}
              <p className="flex-grow-1">
                {appt.comment || "Pas de commentaire"}
              </p>

              {/* FOOTER */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                
                {/* STATUS */}
                <span className={`badge bg-${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>

                {/* ACTIONS */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(appt);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(appt);
                    }}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsCards;