import React from 'react';
import { SimulationData } from '../types';

interface DashboardProps {
  simulation: SimulationData;
  isRunning: boolean;
  onStep: () => void;
  onReset: () => void;
  onToggleRunning: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  simulation, 
  isRunning, 
  onStep, 
  onReset, 
  onToggleRunning 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Simulation Dashboard</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={onStep}
            disabled={isRunning}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isRunning 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
            }`}
          >
            Next Step
          </button>
          <button
            onClick={onToggleRunning}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isRunning
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRunning ? 'Pause' : 'Auto-Run'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Week {simulation.step}</h3>
            <p className="text-sm text-blue-600">
              {isRunning ? 'Simulation running...' : 'Simulation paused'}
            </p>
          </div>
          
          <div className="mt-3 sm:mt-0">
            <span className="text-xs text-blue-700 font-medium">Initial Hesitancy:</span>
            <div className="flex items-center mt-1">
              {simulation.hesitancy.map((value, idx) => (
                <div 
                  key={idx}
                  className="mx-1 flex flex-col items-center"
                >
                  <div className="h-16 w-4 bg-gray-200 rounded-full overflow-hidden relative">
                    <div 
                      className={`absolute bottom-0 w-full rounded-full ${
                        value < 0.3 ? 'bg-green-500' : 
                        value < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${value * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">G{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Policy Type</h4>
          <p className="text-lg font-medium capitalize">{simulation.policy_type || 'Not set'}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Policy Effort</h4>
          <p className="text-lg font-medium capitalize">{simulation.policy_effort || 'Not set'}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Current Agents</h4>
          <p className="text-lg font-medium">{simulation.agents.length}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Average Hesitancy</h4>
          <p className="text-lg font-medium">
            {simulation.hesitancy.length > 0 
              ? `${((simulation.hesitancy.reduce((sum, val) => sum + val, 0) / simulation.hesitancy.length) * 100).toFixed(1)}%` 
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;