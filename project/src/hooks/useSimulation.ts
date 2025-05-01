import { useState, useEffect } from 'react';
import { SimulationData } from '../types';
import { generateInitialSimulation, advanceSimulation } from '../utils/simulationHelpers';

export const useSimulation = () => {
  const [simulation, setSimulation] = useState<SimulationData>(generateInitialSimulation());
  const [isRunning, setIsRunning] = useState(false);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('simulated');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSimulation(parsedData);
      } catch (error) {
        console.error('Error parsing saved simulation data:', error);
      }
    }
  }, []);
  
  // Save to localStorage when simulation changes
  useEffect(() => {
    localStorage.setItem('simulated', JSON.stringify(simulation));
  }, [simulation]);
  
  // Auto advance simulation when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSimulation(prev => advanceSimulation(prev));
      }, 2000); // Advance every 2 seconds
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setSimulation(generateInitialSimulation());
  };
  
  // Advance simulation by one step
  const stepSimulation = () => {
    setSimulation(prev => advanceSimulation(prev));
  };
  
  // Toggle auto-run
  const toggleRunning = () => {
    setIsRunning(prev => !prev);
  };
  
  return {
    simulation,
    isRunning,
    resetSimulation,
    stepSimulation,
    toggleRunning
  };
};