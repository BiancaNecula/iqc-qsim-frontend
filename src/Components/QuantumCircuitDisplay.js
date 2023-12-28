import React, { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import QuantumGate from './QuantumGate';
import Line from './Line';
import { v4 as uuidv4 } from 'uuid';

const QuantumCircuitDisplay = ({ circuit, onDrop }) => {
  const [lineGatePositions, setLineGatePositions] = useState(Array.from({ length: 2 }, () => ({ qubitState: '0', gates: [] })));

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

    const gateIndex = newLineGatePositions[lineIndex].gates.length || 0;

    newLineGatePositions[lineIndex].gates.push({
      positionX,
      positionY: gateIndex * 40, // Adjust the Y position as needed
      label: item.label,
    });

    setLineGatePositions(newLineGatePositions);

    var response = simulateQuantum();
    console.log(response)

    console.log(lineGatePositions)
  };

  const onStateClick = (lineIndex, newQubitState) => {
    console.log(`State clicked on line ${lineIndex} with new state ${newQubitState}`);
    const newLineGatePositions = [...lineGatePositions];

    if (!newLineGatePositions[lineIndex]) {
      newLineGatePositions[lineIndex] = {
        qubitState: newQubitState,
        gates: [],
      };
    } else {
      newLineGatePositions[lineIndex].qubitState = newQubitState;
    }

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
            gates={gatesForLine(lineGatePositions, 0)}
          />
          <Line
            lineIndex={1}
            onDrop={(item, positionX) => handleGateDrop(item, 1, positionX)}
            onStateClick={onStateClick}
            gates={gatesForLine(lineGatePositions, 1)}
          />
          {/* Add more lines as needed */}
        </div>
      </div>
    </div>
  );
};

const gatesForLine = (lineGatePositions, lineIndex) => {
  return lineGatePositions[lineIndex]?.gates || [];
};

export default QuantumCircuitDisplay;