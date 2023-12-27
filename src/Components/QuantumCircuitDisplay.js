import React, { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import QuantumGate from './QuantumGate';
import Line from './Line';
import { v4 as uuidv4 } from 'uuid';

const QuantumCircuitDisplay = ({ circuit, onDrop, onStateClick }) => {
  const [lineGatePositions, setLineGatePositions] = useState([]);

  const simulateQuantum = async () => {
    try {
      const data = lineGatePositions;
      const response = await fetch('http://localhost:8000/quantum/api/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleGateDrop = (item, lineIndex, positionX) => {
    const newLineGatePositions = [...lineGatePositions];

    // Check if the line already has positions
    if (!newLineGatePositions[lineIndex]) {
      newLineGatePositions[lineIndex] = [];
    }

    const gateIndex = newLineGatePositions[lineIndex]?.length || 0;
    newLineGatePositions[lineIndex].push({
      positionX,
      positionY: gateIndex * 40, // Adjust the Y position as needed
      label: item.label, // Store the label of the gate
    });

    setLineGatePositions(newLineGatePositions);

    var response = simulateQuantum();
    console.log(response)

    console.log(lineGatePositions)
  };

  return (
    <div
      style={{
        border: '2px dashed #ccc',
        padding: '1rem',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div>
          <h2>Qubit States</h2>
          <Line
            lineIndex={0}
            onDrop={(item, positionX) => handleGateDrop(item, 0, positionX)}
            onStateClick={onStateClick}
            gates={lineGatePositions[0] || []}
          />
          <Line
            lineIndex={1}
            onDrop={(item, positionX) => handleGateDrop(item, 1, positionX)}
            onStateClick={onStateClick}
            gates={lineGatePositions[1] || []}
          />
          {/* Add more lines as needed */}
        </div>
      </div>
    </div>
  );
};

export default QuantumCircuitDisplay;