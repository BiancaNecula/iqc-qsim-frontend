
import React from 'react';
import { useDrag } from 'react-dnd';


const QuantumGate = ({ type, label, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        // Check if the drop occurred on a valid target (line)
        if (dropResult.isValidTarget) {
          onDrop(label, dropResult.positionX, dropResult.positionY);
        }
      }
    },
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid #ccc',
        padding: '0.2rem',
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
        fontSize: '12px',
        fontWeight: 'bold',
        marginRight: '10px', // Adjust spacing between gates
      }}
    >
      {label}
    </div>
  );
};

export default QuantumGate;