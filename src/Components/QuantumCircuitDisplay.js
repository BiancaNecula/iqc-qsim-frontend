import React, { useState, useEffect, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import QuantumGate from './QuantumGate';
import Line from './Line';
import { v4 as uuidv4 } from 'uuid';
import ModalDialog from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';


const defaultCircuitState = Array.from({ length: 2 }, () => ({ qubitState: 0, gates: [] }));

const QuantumCircuitDisplay = React.forwardRef(({ circuit, frontcircuit, onDrop, ws }, ref) => {

  const [lineGatePositions, setLineGatePositions] = useState(frontcircuit || defaultCircuitState);

  const [displayElement, setDisplayElement] = useState(null);

  const [gateRefs, setGateRefs] = useState({});

  const [connectorLines, setConnectorLines] = useState([]);

  const [linePercentages, setLinePercentages] = useState({});

  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [lastAddedGate, setLastAddedGate] = useState(null);

  const [simulationResults, setSimulationResults] = useState([]);

  const [measurementBasis, setMeasurementBasis] = useState('Z');

  const [resetCircuit, setResetCircuit] = useState(false);

  const [psi, setPsi] = useState("");

  const psiInputRef = useRef(null);

  useEffect(() => {
    const element = document.querySelector('.quantum-circuit-display');
    console.log("Display Element:", element);
    setDisplayElement(element);
  }, []);

  const toggleMeasurementBasis = () => {
    setMeasurementBasis(measurementBasis === 'X' ? 'Z' : 'X');
  };

  useEffect(() => {
    var response = simulateQuantum();
    console.log(response);
    console.log(lineGatePositions);
  }
  , [measurementBasis]);

  useEffect(() => {
    if (lineGatePositions && ws) {
      const message = JSON.stringify({ type: 'update_circuit', circuit: lineGatePositions });
      ws.send(message);
    }
  }, [lineGatePositions, ws]);

  useEffect(() => {
    if (frontcircuit && JSON.stringify(frontcircuit) !== JSON.stringify(lineGatePositions)) {
        setLineGatePositions(frontcircuit);
    }
  }, [frontcircuit]);

  const runSimulation = async () => {
    try {
      const data = { ...lineGatePositions, measure: true, measurement_basis: measurementBasis }; // Add 'measure' field
      console.log("data: ", JSON.stringify(data));
      const response = await fetch('http://localhost:8000/quantum/api/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Simulation failed');
      }
  
      const result = await response.json();
      setSimulationResults(result.measurements); 
      setPsi(result.psi);

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
      setShowErrorPopup(true);
    }
  };

  
  const simulateQuantum = async () => {
    try {
      const data = { ...lineGatePositions, measurement_basis: measurementBasis};
      console.log("data: ", JSON.stringify(data));
      const response = await fetch('http://localhost:8000/quantum/api/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error|| 'An error occurred';
        setErrorMessage(errorMessage);
        setShowErrorPopup(true);

        if (lastAddedGate) {
          setLineGatePositions(prevPositions => {
            const { id, lineIndex } = lastAddedGate;
            const updatedPositions = prevPositions.map(line => {
              const updatedGates = line.gates.filter(gate => {
                return gate.id !== id;
              });
              return {
                ...line,
                gates: updatedGates,
              };
            });
            return updatedPositions;
          });
        }

        return;
      }

      const result = await response.json();
      console.log(result);

      setLinePercentages(result.probabilities);
      setPsi(result.psi);

    } catch (error) {

      console.error('Error:', error.message);
      setErrorMessage('An error occurred');
      setShowErrorPopup(true);

      if (lastAddedGate) {
        setLineGatePositions(prevPositions => {
          const { id, lineIndex } = lastAddedGate;
          const updatedPositions = prevPositions.map(line => {
            const updatedGates = line.gates.filter(gate => {
              return gate.id !== id;
            });
            return {
              ...line,
              gates: updatedGates,
            };
          });
          return updatedPositions;
        });
      }

      console.log(lineGatePositions);
    }
  };

  const handleAfterDrop = (gate, label, lineIndex, gatePositionX, gatePositionY) => {
    console.log(`Gate ${label} on ${gate.id} dragged to X: ${gatePositionX}, Y: ${gatePositionY}`);
    const newLineGatePositions = [...lineGatePositions];

    const gates = newLineGatePositions[lineIndex].gates;

    const gateIndex = gates.findIndex((gate) => gate.id === gate.id);

    newLineGatePositions[lineIndex].gates[gateIndex].realPositionX = gatePositionX;

    // setLineGatePositions(newLineGatePositions);

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

    var newItem = {
      id: uuidv4(),
      lineIndex,
      dropValue: position,
      positionX: newPositionX,
      label: item.label,
      matrix: item.matrix,
      series: item.series,
    };
  
    // Insert the new gate at the drop position or at the end if no existing gate is found
    newLineGatePositions[lineIndex].gates.splice(
      insertIndex !== -1 ? insertIndex : gates.length,
      0,
      newItem
    );

  
    // Update the positionX for the gates after the insertion point
    for (let i = insertIndex !== -1 ? insertIndex + 1 : gates.length; i < gates.length; i++) {
      newLineGatePositions[lineIndex].gates[i].positionX = newPositionX + (i - insertIndex) * 40;
    }
  
    console.log(newLineGatePositions);
  
    setLineGatePositions(newLineGatePositions);

    setLastAddedGate({
      id: newItem.id, // Replace with the actual gate ID
      lineIndex,
    });
    
  };

  useEffect(() => {
    if (lastAddedGate) {
      var response = simulateQuantum();
      console.log(response);
      console.log(lineGatePositions);
    }
  }, [lastAddedGate]); 

  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handleGateDragEnd = (item, label, id) => {
      setLineGatePositions(prevPositions => {
        return prevPositions.map(line => {
          if (line.lineIndex === item.lineIndex) {
            return {
              ...line,
              gates: line.gates.filter(gate => gate.id !== id),
            };
          }
          return line;
        });
      });

      // Set the update trigger
      setUpdateTrigger(prev => !prev);
  };

  useEffect(() => {
      // This code will run after lineGatePositions has been updated
      var response = simulateQuantum();
      console.log(response);

      console.log(lineGatePositions);
  }, [updateTrigger]);

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

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  useEffect(() => {
    if (!showErrorPopup && errorMessage) {
      setErrorMessage(null);
      simulateQuantum();
    }
  }, [showErrorPopup, errorMessage]);

  const exportCircuit = () => {
    const dataStr = JSON.stringify(lineGatePositions);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.download = 'circuit.json';
    link.href = url;
    link.click();
  
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const circuitData = JSON.parse(text);
        setLineGatePositions(circuitData);
        simulateQuantum();
      } catch (error) {
        console.error('Error reading file:', error);
        setErrorMessage('Failed to load circuit');
        setShowErrorPopup(true);
      }
    }
  };

  const resetCircuitHandler = () => {
    setResetCircuit(true);
  };

  useEffect(() => {
    if (resetCircuit) {
      setResetCircuit(false);
      setLineGatePositions(defaultCircuitState);
      setSimulationResults([]);
      setLinePercentages({});
      console.log(lineGatePositions);
    }
  }, [resetCircuit]);


  useEffect(() => {
    console.log("Updated lineGatePositions:", lineGatePositions);
    simulateQuantum();
  }, [lineGatePositions]);

  const copyPsiToClipboard = () => {
    navigator.clipboard.writeText(psi);
  };

  const psiWidthRef = useRef(null);

  useEffect(() => {
    if (psiInputRef.current && psiWidthRef.current) {
      const width = psiWidthRef.current.offsetWidth;
      psiInputRef.current.style.width = `${width}px`;
    }
  }, [psi]);
  

  return (
    <div ref={ref} className="quantum-circuit-display">
      {showErrorPopup && (
      <ModalDialog isOpen={showErrorPopup} onRequestClose={closeErrorPopup} title="Error">
        <p>Error: {errorMessage}</p>
      </ModalDialog>
    )}
      <div className="control-panel">
      <h2 className="title">Quantum Circuit Simulator</h2>
      <div className="buttons-container">
        <button className="control-button" onClick={exportCircuit}>Export Circuit</button>
        <input type="file" className="file-input" onChange={handleFileUpload} />
        <button className="control-button" onClick={runSimulation}>Run <FontAwesomeIcon icon={faArrowRight} /></button>
        <button className="control-button" onClick={resetCircuitHandler}><FontAwesomeIcon icon={faSyncAlt} /></button>
        <button className={`control-button ${measurementBasis}`} onClick={toggleMeasurementBasis}>
          Measuring in {measurementBasis}
        </button>
      </div>
      </div>
      <div className="circuit-lines">
          {lineGatePositions.map((line, index) => (
            <Line
              key={index}
              lineIndex={index}
              onDrop={(item, index, positionX) => handleGateDrop(item, index, positionX)}
              qubitStateRec={line.qubitState} 
              onStateClick={onStateClick}
              gates={line.gates || []}
              displayRef={ref}
              onAfterDrop={(gate, label, lineIndex, gatePositionX, gatePositionY) =>
                handleAfterDrop(gate, label, lineIndex, gatePositionX, gatePositionY)
              }
              onDragEnd={handleGateDragEnd}
              percentages={linePercentages[index]} // Pass percentages for each line
              simulationResult={simulationResults[index]}
            />
          ))}
          </div>
      <button onClick={addLine}>Add Line</button>

      {/* Editable and copyable textbox for "psi" */}
      <div className="psi-container">
        <label>psi:</label>
        <input
          type="text"
          ref={psiInputRef}
          value={psi}
          placeholder="Edit 'psi'"
          className="psi-input"
        />
      </div>
    </div>
  );
});

const gatesForLine = (lineGatePositions, lineIndex) => {
  return lineGatePositions[lineIndex]?.gates || [];
};

export default QuantumCircuitDisplay;