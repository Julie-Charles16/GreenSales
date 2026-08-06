import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";

export const useBootstrapModal = () => {
  const formModalRef = useRef<HTMLDivElement>(null);
  const detailModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [formModal, setFormModal] = useState<Modal | null>(null);
  const [detailModal, setDetailModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);


  useEffect(() => {

    if (formModalRef.current) {
      setFormModal(
        new Modal(formModalRef.current, {
          backdrop: true,
          keyboard: true,
        })
      );
    }


    if (detailModalRef.current) {
      setDetailModal(
        new Modal(detailModalRef.current)
      );
    }


    if (deleteModalRef.current) {
      setDeleteModal(
        new Modal(deleteModalRef.current)
      );
    }

  }, []);


  return {
    formModalRef,
    detailModalRef,
    deleteModalRef,

    formModal,
    detailModal,
    deleteModal,
  };
};