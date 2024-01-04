import React from 'react';
import QuantumCircuitDisplay from './QuantumCircuitDisplay';
import QuantumGate from './QuantumGate';
import { useRef } from 'react';

const QuantumCircuitEditor = () => {
  const [quantumCircuit, setQuantumCircuit] = React.useState([]);

  const handleDrop = (gate, lineIndex, positionX) => {
    const newCircuit = [...quantumCircuit, { label: gate, lineIndex, positionX }];
    setQuantumCircuit(newCircuit);
  };

  const handleDragEnd = (gateId, lineIndex) => {
  };

  const displayRef = useRef(null);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Quantum Circuit Editor</h1>
      <QuantumCircuitDisplay circuit={quantumCircuit} ref={displayRef} onDrop={handleDrop} />
  
      {/* Quantum Gates */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
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
      </div>
    </div>
  );
};

export default QuantumCircuitEditor;