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
      <button
        style={{
          backgroundColor: "#999999",
          color: "white",
          boxShadow: "4px 4px 0px 1px black",
          border: "2px solid black"
        }}
        onClick={() => setShowModal(true)}
      >
        Delete Group
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <DeleteGroupForm groupId={groupId} onClose={handleCloseModal} />
        </Modal>
      )}
    </>
  );
};

export default DeletGroupModal;
