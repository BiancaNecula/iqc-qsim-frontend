import React from 'react';
import Modal from 'react-modal';
import '../Style/ModalDialog.css'; 

Modal.setAppElement('#root'); // Define the root app element for screen reader accessibility

const ModalDialog = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-dialog"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2>{title}</h2>
        <button className="close-button" onClick={onRequestClose}>
          &times;
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </Modal>
  );
};

export default ModalDialog;