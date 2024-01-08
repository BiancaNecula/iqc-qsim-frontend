import React, { useState } from 'react';
import Modal from 'react-modal';

const MultipleQuantumGateForm = ({ isOpen, onClose, onAddCustomGate }) => {
  const [matrix, setCell] = useState('');
  const [label, setLabel] = useState('Custom Gate'); // Default label value


  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleCellChange = (e) => {
    setCell(e.target.value);
  }

  const handleSubmit = () => {
    onAddCustomGate(matrix, label);
    setCell(''); // Reset the cell
    setLabel('Custom Gate'); // Reset the label
    onClose();
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%', // Adjust the width as needed
      maxWidth: '400px', // Set a maximum width for the modal
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      <h2>Add Multiple Quantum Gate</h2>
      <label>Label:</label>
      <input type="text" value={label} onChange={handleLabelChange} />
      <input type="text" value={matrix} onChange={handleCellChange} />
      <button onClick={handleSubmit}>Add Gate</button>
    </Modal>
  );
};

export default MultipleQuantumGateForm;