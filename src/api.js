// frontend/src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5006/api';

export const checkBackend = async () => {
  try {
    const response = await axios.get(`${API_URL}/check`);
    return response.data;
  } catch (error) {
    console.error('Error checking backend:', error);
    throw error;
  }
};

export const addCarbonFootprint = async (email, emission) => {
  try {
    const response = await axios.post(`${API_URL}/carbon-footprint`, { email, emission });
    return response.data;
  } catch (error) {
    console.error('Error adding carbon footprint:', error);
    throw error;
  }
};

export const getCarbonFootprint = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/carbon-footprint/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error getting carbon footprint:', error);
    throw error;
  }
};
