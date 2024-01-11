import React, { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import QuantumGate from './QuantumGate';

const Line = ({ lineIndex, onDrop, onStateClick, gates, displayRef, onAfterDrop, onDragEnd, percentages }) => {

  const [qubitState, setQubitState] = useState(0);

  const [gatePositions, setGatePositions] = useState(gates);

  const [isDraggingGate, setIsDraggingGate] = useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: 'quantum-gate',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        // const displayRect = displayRef.current.getBoundingClientRect();

        // console.log("Display Rect:", displayRect);
      
        // // Convert client offset to display element relative position
        // const positionX = clientOffset.x - displayRect.left + window.scrollX;
        // const positionY = clientOffset.y - displayRect.top + window.scrollY;

        // console.log("Position X drop:", positionX);
        // console.log("Position Y drop:", positionY);
      
        const positionX = clientOffset.x;
        const positionY = clientOffset.y;
        setIsDraggingGate(false);
        handleDrop(item, positionX, positionY);
        console.log("item", item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // I want to pass this as the real positions of the gates
  const handleGateDrag = (gate, label, gatePositionX, gatePositionY) => {
    // Handle gate drag if needed
    console.log(`Gate ${label} dragged to X: ${gatePositionX}, Y: ${gatePositionY}, matrix: ${gate.matrix}, series: ${gate.series}`);
    onAfterDrop(gate, label, lineIndex, gatePositionX, gatePositionY);
  }

  const [{ isDragging }, drag] = useDrag({
    type: 'quantum-gate',
    item: () => {
      setIsDraggingGate(true);
      return {}; // Return an empty object or item data as needed
    },
    end: () => setIsDraggingGate(false),
  });

  const handleDrop = (item, positionX) => {
    onDrop(item, lineIndex, positionX, qubitState);
  };

  const handleStateClick = () => {
    const newQubitState = qubitState === 0 ? 1 : 0;
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
          position: 'relative',
          zIndex: 2,
        }}
        onClick={handleStateClick}
      >
        |{qubitState}⟩
      </button>
  
      <div style={{ marginLeft: '10px' }}>
        <div
          ref={drop}
          style={{
            marginLeft: '10px',
            width: '600px',
            height: '2px',
            backgroundColor: isOver ? 'red' : '#333',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />
      </div>
  
      {gates.map((gate) => (
        <QuantumGate
          key={gate.id}
          type="quantum-gate"
          label={gate.label}
          positionX={gate.positionX}
          positionY={gate.positionY}
          onDrop={(label, gatePositionX, gatePositionY) => handleGateDrag(gate, label, gatePositionX, gatePositionY)}
          onDragEnd={(item, label) => onDragEnd(item, label, gate.id)}
          matrix={gate.matrix}
          series={gate.series}
        />
      ))}
  
      {percentages !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '650px', // Adjust this value to place it after the line
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>{`${percentages}`}</span>
        </div>
      )}
    </div>
  );
  
};

export default Line;