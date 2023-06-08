import React, { useContext } from "react";
import ReactDOM from "react-dom";
import ModalContext from "../../context/Modal";
import '../Modal.Modal.css'

const Modal = ({ onClose, children }) => {
  const modalNode = useContext(ModalContext);

  if (!modalNode) {
    return null;
  }

  const handleBackgroundClick = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={handleBackgroundClick}></div>
      <div id="modal-content">{children}</div>
    </div>,
    modalNode
  );
};

export default Modal;
