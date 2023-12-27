import React from 'react';
import QuantumCircuitDisplay from './QuantumCircuitDisplay';
import QuantumGate from './QuantumGate';

const QuantumCircuitEditor = () => {
  const [quantumCircuit, setQuantumCircuit] = React.useState([]);

  const handleDrop = (gate, lineIndex, positionX) => {
    const newCircuit = [...quantumCircuit, { label: gate, lineIndex, positionX }];
    setQuantumCircuit(newCircuit);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Quantum Circuit Editor</h1>
      <QuantumCircuitDisplay circuit={quantumCircuit} onDrop={handleDrop} />

      {/* Sample Quantum Gates */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <QuantumGate type="quantum-gate" label="H" onDrop={handleDrop} />
        <QuantumGate type="quantum-gate" label="X" onDrop={handleDrop} />
        {/* Add more quantum gates here */}
      </div>
    </div>
  );
};

export default QuantumCircuitEditor;