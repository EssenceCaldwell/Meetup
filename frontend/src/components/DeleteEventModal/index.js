import React, { useState } from "react";
import { Modal } from "../../context/Modal";
import DeleteEventForm from "../DeleteEventForm/DeleteEventForm";

const DeleteEventModal = ({ eventId }) => {
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
          border: "2px solid black",
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
      >
        Delete Event
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <DeleteEventForm eventId={eventId} onClose={handleCloseModal} />
        </Modal>
      )}
    </>
  );
};

export default DeleteEventModal;
