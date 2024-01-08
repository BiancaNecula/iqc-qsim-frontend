import React from 'react';
import QuantumCircuitDisplay from './QuantumCircuitDisplay';
import QuantumGate from './QuantumGate';
import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CustomQuantumGateForm from './QuantumGateForm';
import MultipleQuantumGateForm from './MultipleQuantumGateForm';

const QuantumCircuitEditor = () => {
  const [quantumCircuit, setQuantumCircuit] = React.useState([]);
  const [isCustomGateFormOpen, setCustomGateFormOpen] = useState(false);
  const [isCompositionGateFormOpen, setCompositionGateFormOpen] = useState(false);
  const [customGates, setCustomGates] = useState([]);

  const handleDrop = (gate, lineIndex, positionX) => {
    const newCircuit = [...quantumCircuit, { label: gate, lineIndex, positionX }];
    setQuantumCircuit(newCircuit);
  };

  const handleDragEnd = (gateId, lineIndex) => {
  };

  const displayRef = useRef(null);

  const addCustomGate = (matrix, label) => {
    // Create a custom quantum gate object with the matrix
    const newCustomGate = {
      id: uuidv4(),
      label,
      positionX: 0, // Set the initial positionX as needed
      positionY: 0, // Set the initial positionY as needed
      matrix, // The 2x2 matrix entered by the user
    };

    // Add the custom gate to the list of custom gates
    const newCustomGates = [...customGates, newCustomGate];
    setCustomGates(newCustomGates);

    // Close the custom gate form
    setCustomGateFormOpen(false);

  };

  const addCompositionGate = (matrix, label) => {
    // Create a custom quantum gate object with the matrix
    const newCustomGate = {
      id: uuidv4(),
      label,
      positionX: 0, // Set the initial positionX as needed
      positionY: 0, // Set the initial positionY as needed
      matrix, // The 2x2 matrix entered by the user
    };

    // Add the custom gate to the list of custom gates
    const newCustomGates = [...customGates, newCustomGate];
    setCustomGates(newCustomGates);

    // Close the custom gate form
    setCompositionGateFormOpen(false);

  };


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Quantum Circuit Editor</h1>
      <QuantumCircuitDisplay circuit={quantumCircuit} ref={displayRef} onDrop={handleDrop} />
  
      {/* Quantum Gates */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setCustomGateFormOpen(true)}>Add Custom Gate</button>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setCompositionGateFormOpen(true)}>Add Composition Gate</button>
        </div>
        {/* Group 1 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
          <QuantumGate type="quantum-gate" label="H" onDrop={handleDrop} onDragEnd={handleDragEnd} style={{ marginRight: '50px' }}/>
          <QuantumGate type="quantum-gate" label="X" onDrop={handleDrop} onDragEnd={handleDragEnd} style={{ marginRight: '50px' }} />
          <QuantumGate type="quantum-gate" label="Y" onDrop={handleDrop} onDragEnd={handleDragEnd} style={{ marginRight: '50px' }} />
          <QuantumGate type="quantum-gate" label="Z" onDrop={handleDrop} onDragEnd={handleDragEnd} style={{ marginRight: '50px' }} />
          {/* Add more gates to Group 1 */}
        </div>
  
        {/* Group 2 (Control Gates) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
          <QuantumGate type="quantum-gate" label="." onDrop={handleDrop} onDragEnd={handleDragEnd} />
          <QuantumGate type="quantum-gate" label="SWAP" onDrop={handleDrop} onDragEnd={handleDragEnd} style={{ marginRight: '50px' }} />
          {/* Add more control gates to Group 2 */}
        </div>
  
        {/* Group 3 (Additional Gates) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
          <QuantumGate type="quantum-gate" label="S" onDrop={handleDrop} onDragEnd={handleDragEnd} />
          <QuantumGate type="quantum-gate" label="T" onDrop={handleDrop} onDragEnd={handleDragEnd} style={{ marginRight: '50px' }} />
          {/* Add more gates to Group 3 */}
        </div>
  
        {/* Add more groups if needed */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        {customGates.map((customGate) => (
          <QuantumGate
            key={customGate.id}
            type="quantum-gate" // You can use a unique type for custom gates
            label={customGate.label}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            matrix={customGate.matrix}
          />
        ))}
        </div>
      </div>
      <CustomQuantumGateForm
        isOpen={isCustomGateFormOpen}
        onClose={() => setCustomGateFormOpen(false)}
        onAddCustomGate={addCustomGate}
      />
      <MultipleQuantumGateForm
        isOpen={isCompositionGateFormOpen}
        onClose={() => setCompositionGateFormOpen(false)}
        onAddCustomGate={addCompositionGate}
      />
    </div>
  );
};

export default QuantumCircuitEditor;