import React, { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import QuantumGate from './QuantumGate';
import Line from './Line';
import { v4 as uuidv4 } from 'uuid';

const QuantumCircuitDisplay = React.forwardRef(({ circuit, onDrop }, ref) => {
  const [lineGatePositions, setLineGatePositions] = useState(Array.from({ length: 2 }, () => ({ qubitState: 0, gates: [] })));

  const [displayElement, setDisplayElement] = useState(null);

  const [gateRefs, setGateRefs] = useState({});

  const [connectorLines, setConnectorLines] = useState([]);

  useEffect(() => {
    const element = document.querySelector('.quantum-circuit-display');
    console.log("Display Element:", element);
    setDisplayElement(element);
  }, []);

  // useEffect(() => {
  //   var response = simulateQuantum();
  //   console.log(response);
  //   console.log(lineGatePositions);
  // }, [lineGatePositions]);
  
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

  const handleAfterDrop = (gate, label, lineIndex, gatePositionX, gatePositionY) => {
    console.log(`Gate ${label} on ${gate.id} dragged to X: ${gatePositionX}, Y: ${gatePositionY}`);
    const newLineGatePositions = [...lineGatePositions];

    const gates = newLineGatePositions[lineIndex].gates;

    const gateIndex = gates.findIndex((gate) => gate.id === gate.id);

    newLineGatePositions[lineIndex].gates[gateIndex].realPositionX = gatePositionX;

    setLineGatePositions(newLineGatePositions);

    // var response = simulateQuantum();
    // console.log(response);
  
    // console.log(lineGatePositions);

  };


  const handleGateDrop = (item, lineIndex, position, qubitState) => {
    if (!displayElement) {
      console.error("Display element not found");
      return;
    }
  
    const newLineGatePositions = [...lineGatePositions];
  
    const gates = newLineGatePositions[lineIndex].gates;
  
    console.log("Drop position:", position);
  
    // Calculate the actual positionY in window coordinates
    const rect = ref.current.getBoundingClientRect();
    const windowPositionX = rect.left + window.scrollX;
  
    // Find the index of the gate after the drop position based on positionX
    const insertIndex = gates.findIndex((gate) => gate.realPositionX > position);
  
    // Calculate the positionX for the new gate
    const newPositionX =
      //windowPositionX + 
      (insertIndex !== -1 ? insertIndex * 40 : gates.length * 40);

    console.log("newPositionX" + newPositionX)
  
    // Insert the new gate at the drop position or at the end if no existing gate is found
    newLineGatePositions[lineIndex].gates.splice(
      insertIndex !== -1 ? insertIndex : gates.length,
      0,
      {
        id: uuidv4(),
        lineIndex,
        dropValue: position,
        positionX: newPositionX,
        label: item.label,
        matrix: item.matrix
      }
    );
  
    // Update the positionX for the gates after the insertion point
    for (let i = insertIndex !== -1 ? insertIndex + 1 : gates.length; i < gates.length; i++) {
      newLineGatePositions[lineIndex].gates[i].positionX = newPositionX + (i - insertIndex) * 40;
    }
  
    console.log(newLineGatePositions);
  
    setLineGatePositions(newLineGatePositions);

    var response = simulateQuantum();
    console.log(response);
  
    console.log(lineGatePositions);
  };

  const handleGateDragEnd = (item, label, id) => {
    // Update the state to remove the gate
    
    setLineGatePositions(prevPositions => {
      return prevPositions.map(line => {
        if (line.lineIndex === item.lineIndex) {
          console.log(line.gates);
          console.log(item);
          return {
            ...line,
            gates: line.gates.filter(gate => gate.id !== id),
          };
        }
        return line;
      });
    });


    var response = simulateQuantum();
    console.log(response);

    console.log(lineGatePositions);

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

  const addLine = () => {
    setLineGatePositions([...lineGatePositions, { qubitState: 0, gates: [] }]);
  };

  return (
    <div
      ref={ref}
      className="quantum-circuit-display"
      style={{
        border: '2px dashed #ccc',
        padding: '1rem',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f6f6f6',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div>
          <h2>Qubit States</h2>
          {lineGatePositions.map((line, index) => (
            <Line
              key={index}
              lineIndex={index}
              onDrop={(item, index, positionX) => handleGateDrop(item, index, positionX)}
              onStateClick={onStateClick}
              gates={line.gates || []}
              displayRef={ref}
              onAfterDrop={(gate, label, lineIndex, gatePositionX, gatePositionY) => handleAfterDrop(gate, label, lineIndex, gatePositionX, gatePositionY)}
              onDragEnd={handleGateDragEnd}
            />
          ))}
        </div>
      </div>
      <button onClick={addLine}>Add Line</button>
    </div>
  );
});

const gatesForLine = (lineGatePositions, lineIndex) => {
  return lineGatePositions[lineIndex]?.gates || [];
};

export default QuantumCircuitDisplay;