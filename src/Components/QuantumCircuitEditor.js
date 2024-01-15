import React from 'react';
import QuantumCircuitDisplay from './QuantumCircuitDisplay';
import QuantumGate from './QuantumGate';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CustomQuantumGateForm from './QuantumGateForm';
import MultipleQuantumGateForm from './MultipleQuantumGateForm';

const QuantumCircuitEditor = ({frontcircuit, ws}) => {
  const [quantumCircuit, setQuantumCircuit] = React.useState([]);
  const [circuit, setFrontCircuit] = React.useState(frontcircuit);
  const [isCustomGateFormOpen, setCustomGateFormOpen] = useState(false);
  const [isCompositionGateFormOpen, setCompositionGateFormOpen] = useState(false);
  const [customGates, setCustomGates] = useState([]);

  const handleDrop = (gate, lineIndex, positionX) => {
    const newCircuit = [...quantumCircuit, { label: gate, lineIndex, positionX }];
    setQuantumCircuit(newCircuit);
  };

  useEffect(() => {
    setFrontCircuit(frontcircuit);
  }, [frontcircuit]);

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

  const addCompositionGate = (series, label) => {
    // Create a custom quantum gate object with the matrix
    const newCustomGate = {
      id: uuidv4(),
      label,
      positionX: 0, // Set the initial positionX as needed
      positionY: 0, // Set the initial positionY as needed
      series, // The 2x2 matrix entered by the user
    };

    // Add the custom gate to the list of custom gates
    const newCustomGates = [...customGates, newCustomGate];
    setCustomGates(newCustomGates);

    // Close the custom gate form
    setCompositionGateFormOpen(false);

  };


  return (
    <div className="quantum-circuit-editor">

    <QuantumCircuitDisplay circuit={quantumCircuit} frontcircuit={circuit} ref={displayRef} ws={ws} onDrop={handleDrop} />

    <div className="editor-flex-container">

      <div className="button-panel">
        <div className="gate-section">
          <button className="gate-button" onClick={() => setCustomGateFormOpen(true)}>Add Custom Gate</button>
        </div>
        <div className="gate-section">
          <button className="gate-button" onClick={() => setCompositionGateFormOpen(true)}>Add Composition Gate</button>
        </div>
      </div>
      
  
      <div className="quantum-gates-container">
  
        {/* Gate Groups */}
        <div className="gate-group">
          {['H', 'X', 'Y', 'Z', 'I'].map(gateLabel => (
            <QuantumGate key={gateLabel} type="quantum-gate" label={gateLabel} onDrop={handleDrop} onDragEnd={handleDragEnd} />
          ))}
        </div>
  
        <div className="gate-group">
          <QuantumGate type="quantum-gate" label="." onDrop={handleDrop} onDragEnd={handleDragEnd} />
          <QuantumGate type="quantum-gate" label="SWAP" onDrop={handleDrop} onDragEnd={handleDragEnd} />
        </div>
  
        <div className="gate-group">
          {['S', 'T'].map(gateLabel => (
            <QuantumGate key={gateLabel} type="quantum-gate" label={gateLabel} onDrop={handleDrop} onDragEnd={handleDragEnd} />
          ))}
        </div>
  
        <div className="gate-group">
          {customGates.map(customGate => (
            <QuantumGate
              key={customGate.id}
              type="quantum-gate"
              label={customGate.label}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              matrix={customGate.matrix}
              series={customGate.series}
            />
          ))}
        </div>
      </div>

      </div>
  
      <CustomQuantumGateForm isOpen={isCustomGateFormOpen} onClose={() => setCustomGateFormOpen(false)} onAddCustomGate={addCustomGate} />
      <MultipleQuantumGateForm isOpen={isCompositionGateFormOpen} onClose={() => setCompositionGateFormOpen(false)} onAddCustomGate={addCompositionGate} />
    </div>
  );
};

export default QuantumCircuitEditor;