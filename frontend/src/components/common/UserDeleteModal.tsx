import React from "react";
import type { AdminUser } from "../../types/user";

interface Props {
  user: AdminUser | null;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onConfirm: () => void;
}

const UserDeleteModal: React.FC<Props> = ({
  user,
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

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            <p>
              Voulez-vous vraiment supprimer cet utilisateur ?
            </p>

            {user && (
              <div className="alert alert-light border">
                <strong>{user.pseudo}</strong>
                <br />
                <small>{user.email}</small>
              </div>
            )}

            <p className="text-danger mb-0">
              Action irréversible
            </p>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Supprimer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;