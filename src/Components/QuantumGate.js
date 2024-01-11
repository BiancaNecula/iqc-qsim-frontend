import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';

const QuantumGate = ({ type, label, matrix, series, positionX, positionY, onDrop, style, onDragEnd }) => {
  const gateRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { label, matrix, series },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult) {
        // Gate is dropped outside any drop target
        onDragEnd(item, label); // Call the provided onDragEnd handler
      }
      // if (!monitor.didDrop()) {
      //   onDragEnd(item, label); // Use onDragEnd here
      // }
    },
  });

  useEffect(() => {
    if (gateRef.current) {
      const rect = gateRef.current.getBoundingClientRect();
      const gatePositionX = rect.left + window.scrollX;
      const gatePositionY = rect.top + window.scrollY;
      onDrop(label, gatePositionX, gatePositionY);
    }
  }, [isDragging]);

  const gateStyle = {
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
    marginRight: '50px', // Adjust spacing between gates
    zIndex: 1,
    ...(positionX !== undefined && positionY !== undefined && {
      position: 'absolute',
      top: `${positionY}px`,
      left: `${positionX}px`,
    }),
    ...style, // Allow external styles to override
  };

  return (
    <div ref={(node) => { gateRef.current = node; drag(node); }} style={gateStyle}>
      {label}
    </div>
  );
};

export default QuantumGate;
