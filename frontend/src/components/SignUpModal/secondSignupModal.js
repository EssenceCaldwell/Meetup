import React, { useState } from "react";
import { Modal } from "../../context/Modal";
import SignupForm from "../SignupFormPage";
import "../LandingPage/LandingPage.css"

function SecondSignupFormModal() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button className="buttons" onClick={() => setShowModal(true)}>
        Join What's Up
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupForm />
        </Modal>
      )}
    </>
  );
}
export default SecondSignupFormModal;
