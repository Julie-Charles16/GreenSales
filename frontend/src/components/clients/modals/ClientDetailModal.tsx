import React from "react";
import type { Client } from "../../../types/client";

interface Props {
  client: Client | null;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  getStatusColor: (status: string) => string;
}

const ClientDetailModal: React.FC<Props> = ({
  client,
  modalRef,
  onClose,
  getStatusColor,
}) => {
  return (
    <div className="modal fade" ref={modalRef} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">

          {/* HEADER */}
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title text-primary">
              <i className="bi bi-person-vcard me-2"></i>
              Détails du client
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* BODY */}
          <div className="modal-body pt-3">
            {client && (
              <div className="d-flex flex-column gap-3">

                <div>
                  <small className="text-muted">Client</small>
                  <div className="fw-semibold fs-5">
                    <i className="bi bi-person me-2"></i>
                    {client.firstName} {client.name}
                  </div>
                </div>

                <div className="border-top pt-3">
                  <small className="text-muted">Contact</small>
                  <div>
                    <i className="bi bi-envelope-at me-2"></i>
                    {client.email}
                  </div>
                  <div>
                    <i className="bi bi-telephone me-2"></i>
                    {client.phone}
                  </div>
                </div>

                <div className="border-top pt-3">
                  <small className="text-muted">Adresse</small>
                  <div>
                    <i className="bi bi-geo-alt me-2"></i>
                    {client.address}
                  </div>
                  <div>
                    {client.postalCode} {client.city}
                  </div>
                </div>

                <div className="border-top pt-3">
                  <small className="text-muted">Projet</small>
                  <div>
                    <i className="bi bi-briefcase me-2"></i>
                    {client.projectType}
                  </div>
                </div>

                <div className="border-top pt-3">
                  <small className="text-muted">Statut</small>
                  <div>
                    <span className={`badge bg-${getStatusColor(client.status)} px-3 py-2`}>
                      {client.status}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailModal;