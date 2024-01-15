import React, { useState } from 'react';
import Modal from 'react-modal';

const CustomQuantumGateForm = ({ isOpen, onClose, onAddCustomGate }) => {
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [label, setLabel] = useState('Custom Gate'); // Default label value

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value === '' ? 0 : parseFloat(value);
    setMatrix(newMatrix);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleSubmit = () => {
    onAddCustomGate(matrix, label);
    setMatrix([[0, 0], [0, 0]]); // Reset the matrix
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
      <h2>Add Custom Quantum Gate</h2>
      <label>Label:</label>
      <input type="text" value={label} onChange={handleLabelChange} />

      <table>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Add Gate</button>
    </Modal>
  );
};

export default CustomQuantumGateForm;