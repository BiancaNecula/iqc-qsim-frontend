// iqc-qsim-frontend/src/App.js
import React, { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import QuantumCircuitEditor from './Components/QuantumCircuitEditor';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [ws, setWs] = useState(null);
  const [clients, setClients] = useState([]);
  const [circuit, setCircuit] = useState([]);


  const createRoom = () => {
    const roomId = uuidv4();
    window.location.href = `/ws/quantum_simulator/${roomId}`;
  };

  const leaveRoom = () => {
    if (ws) {
      const exit_user = localStorage.getItem('username');
      ws.send(JSON.stringify({type:'leave_room', message:exit_user}));
      ws.close();
      window.location.href = `/`;
    }
  };


  useEffect(() => {
    const roomId = window.location.pathname.split('/')[3];
    if (roomId) {

      let username = localStorage.getItem('username');
        if (!username) {
          username = prompt('Please set your username');
          localStorage.setItem('username', username);
        }

      const websocket = new ReconnectingWebSocket(`ws://localhost:8000/ws/quantum_simulator/${roomId}/`);
      setWs(websocket);

      websocket.onopen = () => {
        console.log('connected');
        websocket.send(JSON.stringify({type:'join_room', message:username }));

      };
      

      websocket.onmessage = (evt) => {
        // handle received message
        console.log("evt: ",evt);
        const message = JSON.parse(evt.data);
        console.log("message: ",message)
        // console.log("message.type: ",message.clients)
        // console.log("message key: ",Object.keys(message))
        // if (message.join_room) {
        //   if (!clients.includes(message.join_room)) {
        //   setClients([message.join_room]);
        //   console.log("clients: ",clients);
        //   }
        // }
        if (message.join_room) {
          setClients(message.join_room);
        }
        if (message.leave_room) {
          setClients(message.leave_room);
        }
        if (message.circuit && message.type === 'circuit_change') {
          setCircuit(message.circuit);
        }
        
      };
      

    };
  }, []);

  

  

  return (
    <div>
      {!ws && <button onClick={createRoom}>Create Room</button>}
      {ws && <button onClick={leaveRoom}>Leave Room</button>}
      {ws && clients.length > 0 && (
      <><h2>Clients in the room:</h2><ul>
          {clients.map((client, index) => (
            <li key={index}>{client}</li>
          ))}
        </ul></>)}
      <h1>Quantum Circuit Simulator App</h1>
      <QuantumCircuitEditor frontcircuit={circuit} ws={ws} />
    </div>
  );
};

export default App;