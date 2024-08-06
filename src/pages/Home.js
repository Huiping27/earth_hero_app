import React, { useEffect, useState } from 'react';
import { checkBackend, addCarbonFootprint, getCarbonFootprint } from '../api';
import './Home.css'; 

const Home = () => {
  const [backendMessage, setBackendMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emission, setEmission] = useState('');
  const [carbonFootprints, setCarbonFootprints] = useState([]);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  useEffect(() => {
    const fetchBackendMessage = async () => {
      try {
        const data = await checkBackend();
        setBackendMessage(data.message);
      } catch (error) {
        setBackendMessage('Error connecting to backend');
      }
    };

    fetchBackendMessage();
  }, []);

  const handleAddEmission = async (e) => {
    e.preventDefault();
    try {
      await addCarbonFootprint(email, parseFloat(emission));
      const updatedFootprints = await getCarbonFootprint(email);
      setCarbonFootprints(updatedFootprints);
      setEmission('');
      setSuccessMessage('Your CO2 emission has been added successfully!'); // Set success message
    } catch (error) {
      console.error('Error adding emission:', error);
      setSuccessMessage('Failed to add CO2 emission.'); // Set error message if needed
    }
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to Flight Co2 Track!</h1>
        <p>Your journey towards a sustainable lifestyle begins here.</p>
        <p>{backendMessage}</p>
        
        <form onSubmit={handleAddEmission}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Enter CO2 emission" 
            value={emission} 
            onChange={(e) => setEmission(e.target.value)} 
            required 
          />
          <button type="submit">Add CO2 Emission</button>
        </form>

        {successMessage && <p>{successMessage}</p>}

        <h2>CO2 Emissions</h2>
        <ul>
          {carbonFootprints.map((footprint, index) => (
            <li key={index}>
              Date: {new Date(footprint.date).toLocaleDateString()}, Emission: {footprint.emission} kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default Home;
