import React from 'react';
import { SimulationData } from '../types';

interface AnalysisProps {
  simulation: SimulationData;
}

const Analysis: React.FC<AnalysisProps> = ({ simulation }) => {
  // Count pro-vaccine agents (those with first attention value < 0.4)
  const proVaccineCount = simulation.agents.filter(agent => agent.attentions[0] < 0.4).length;
  
  // Calculate average hesitancy
  const averageHesitancy = simulation.hesitancy.length > 0 
    ? (simulation.hesitancy.reduce((sum, val) => sum + val, 0) / simulation.hesitancy.length)
    : 0;
    
  // Calculate the change in hesitancy since start
  const hesitancyChange = simulation.step > 0
    ? (simulation.hesitancy[0] - averageHesitancy) / simulation.hesitancy[0] * 100
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Simulation Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">Current Step</div>
          <div className="text-2xl font-bold text-blue-800">Week {simulation.step}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 mb-1">Pro-Vaccine Agents</div>
          <div className="text-2xl font-bold text-green-800">
            {proVaccineCount} / {simulation.agents.length}
            <span className="text-sm font-normal ml-1">
              ({((proVaccineCount / Math.max(1, simulation.agents.length)) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 mb-1">Average Hesitancy</div>
          <div className="text-2xl font-bold text-purple-800">
            {(averageHesitancy * 100).toFixed(1)}%
            {hesitancyChange !== 0 && (
              <span className={`text-sm font-normal ml-2 ${hesitancyChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {hesitancyChange > 0 ? '↑' : '↓'} {Math.abs(hesitancyChange).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Policy Impact</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-sm">Policy Type:</span>
              <p className="font-medium capitalize">{simulation.policy_type || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Policy Effort:</span>
              <p className="font-medium capitalize">{simulation.policy_effort || 'Not set'}</p>
            </div>
          </div>
          
          {hesitancyChange !== 0 && (
            <div className="mt-4">
              <span className="text-gray-500 text-sm">Effectiveness:</span>
              <p className={`font-medium ${hesitancyChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {hesitancyChange < 0 
                  ? `Reduced hesitancy by ${Math.abs(hesitancyChange).toFixed(1)}%` 
                  : `Increased hesitancy by ${Math.abs(hesitancyChange).toFixed(1)}%`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Agent Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Agent</th>
                <th className="px-4 py-2 text-left">Initial Attitude</th>
                <th className="px-4 py-2 text-left">Current Attitude</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {simulation.agents.map((agent, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{agent.name}</td>
                  <td className="px-4 py-2">{(simulation.hesitancy[0] * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2">{(agent.attentions[0] * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      agent.attentions[0] < 0.4 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {agent.attentions[0] < 0.4 ? 'Pro-vaccine' : 'Hesitant'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analysis;