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
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '80%', // Adjust the width as needed
      maxWidth: '400px', // Set a maximum width for the modal
      background: '#fff', // White background
      border: '1px solid #ccc', // Gray border
      borderRadius: '8px', // Rounded corners
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // Shadow
      padding: '20px',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      <h2>Add Multiple Quantum Gate</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Label:</label>
        <input type="text" value={label} onChange={handleLabelChange} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Series:</label>
        <input
          type="text"
          value={series}
          placeholder='X, Y, H, ...'
          onChange={handleCellChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#007bff', // Blue background
          color: '#fff', // White text
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add Gate
      </button>
    </Modal>
  );
};

export default MultipleQuantumGateForm;