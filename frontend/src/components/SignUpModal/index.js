import React, { useState } from "react";
import { Modal } from "../../context/Modal";
import SignupForm from "../SignupFormPage";
import '../LoginFormModal/LoginForm.css'

function SignupFormModal() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button className="login" onClick={() => setShowModal(true)}>
       Sign Up
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupForm />
        </Modal>
      )}
    </>
  );
}
export default SignupFormModal;
