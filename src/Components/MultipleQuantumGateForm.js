import React, { useState } from 'react';
import Modal from 'react-modal';

const MultipleQuantumGateForm = ({ isOpen, onClose, onAddCustomGate }) => {
  const [series, setCell] = useState('');
  const [label, setLabel] = useState('Custom Gate'); // Default label value


  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleCellChange = (e) => {
    setCell(e.target.value);
  }

  const handleSubmit = () => {
    onAddCustomGate(series, label);
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
      <input type="text" value={series} placeholder='X, Y, H, ...' onChange={handleCellChange} />
      <button onClick={handleSubmit}>Add Gate</button>
    </Modal>
  );
};

export default MultipleQuantumGateForm;