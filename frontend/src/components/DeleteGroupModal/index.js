import React, { useState } from "react";
import { Modal } from "../../context/Modal";
import DeleteGroupForm from "../DeleteGroupForm/DeleteGroupForm";

const DeletGroupModal = ({groupId}) => {
  const [showModal, setShowModal] = useState(false);
   const handleCloseModal = () => {
     setShowModal(false);
   };
  return (
    <>
      <button onClick={() => setShowModal(true)}>Delete Group</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <DeleteGroupForm groupId={groupId} onClose={handleCloseModal}/>
        </Modal>
      )}
    </>
  );
};

export default DeletGroupModal;
