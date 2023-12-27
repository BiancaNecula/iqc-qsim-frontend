import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const AppWithDnD = () => (
  <DndProvider backend={HTML5Backend}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </DndProvider>
);

ReactDOM.render(
  <AppWithDnD />,
  document.getElementById('root')
);