import React, { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import QuantumGate from './QuantumGate';

const Line = ({ lineIndex, onDrop, onStateClick, gates }) => {
  const [isDraggingGate, setIsDraggingGate] = useState(false);
  const [{ isOver }, drop] = useDrop({
    accept: 'quantum-gate',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const positionX = clientOffset.x;
        setIsDraggingGate(false);
        onDrop(item, lineIndex, positionX);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'quantum-gate',
    item: () => {
      setIsDraggingGate(true);
      return {}; // Return an empty object or item data as needed
    },
    end: () => setIsDraggingGate(false),
  });

  const [qubitState, setQubitState] = useState(0);

  const handleStateClick = () => {
    const newQubitState = 1 - qubitState;
    setQubitState(newQubitState);
    onStateClick(lineIndex, newQubitState);
  };

  useEffect(() => {
    console.log(`Qubit State ${lineIndex}:`, qubitState);
  }, [qubitState, lineIndex]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', position: 'relative' }}>
      <button
        style={{
          padding: '0.5rem',
          backgroundColor: qubitState === 1 ? '#007bff' : '#fff',
          color: qubitState === 1 ? '#fff' : '#000',
          border: '1px solid #007bff',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleStateClick}
      >
        |{qubitState}⟩
      </button>

      <div
        ref={drop}
        style={{
          marginLeft: '10px',
          width: isDraggingGate ? '50%' : '40px', // Adjust the width as needed
          height: '2px',
          backgroundColor: isOver ? 'red' : '#333',
        }}
      />

      {gates.map((gate) => (
        <QuantumGate
          key={gate.id}
          type="quantum-gate"
          label={gate.label}
          positionX={gate.positionX}
          positionY={gate.positionY}
        />
      ))}
    </div>
  );
};

export default Line;