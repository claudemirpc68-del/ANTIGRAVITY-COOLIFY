import { useState, useEffect } from 'react';
import api from './services/api';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import './App.css';

function App() {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="container">
      <h1>Client Management System</h1>
      <div className="grid">
        <ClientForm onClientAdded={fetchClients} />
        <ClientList clients={clients} />
      </div>
    </div>
  );
}

export default App;
