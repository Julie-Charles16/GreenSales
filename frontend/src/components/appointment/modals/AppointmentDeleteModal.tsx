import React from "react";
import type { Appointment } from "../../../types/appointment";

interface Props {
  appointment: Appointment | null;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onConfirm: () => void;
  getClientName: (clientId: number) => string;
}

const AppointmentDeleteModal: React.FC<Props> = ({
  appointment,
  modalRef,
  onClose,
  onConfirm,
  getClientName,
}) => {
  return (
    <div className="modal fade" ref={modalRef} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="text-danger">
              ⚠️ Supprimer
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            <p>Voulez-vous vraiment supprimer ce rendez-vous ?</p>

            {appointment && (
              <div className="alert alert-light border">
                <strong>
                  {getClientName(appointment.clientId)}
                </strong>
                <br />
                <small>
                  {new Date(appointment.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
                {/* <span className="badge bg-secondary ms-2">
                    {appointment.status}
                </span> */}
              </div>
            )}

            <p className="text-danger mb-0">
              Action irréversible
            </p>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>

            <button className="btn btn-danger" onClick={onConfirm}>
              Supprimer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppointmentDeleteModal;