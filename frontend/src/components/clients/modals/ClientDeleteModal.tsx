import React from "react";
import type { Client } from "../../../types/client";

interface Props {
  client: Client | null;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onConfirm: () => void;
}

const ClientDeleteModal: React.FC<Props> = ({
  client,
  modalRef,
  onClose,
  onConfirm,
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
            <p>Voulez-vous vraiment supprimer ce client ?</p>

            {client && (
              <div className="alert alert-light border">
                <strong>
                  {client.name} {client.firstName}
                </strong>
                <br />
                <small>{client.email}</small>
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

export default ClientDeleteModal;