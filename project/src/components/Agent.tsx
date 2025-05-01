import React from 'react';
import { Agent as AgentType } from '../types';

interface AgentProps {
  agent: AgentType;
  index: number;
}

const Agent: React.FC<AgentProps> = ({ agent, index }) => {
  // Calculate attitude level class based on value
  const getAttitudeClass = (value: number) => {
    if (value < 0.3) return 'text-green-600 font-semibold';
    if (value < 0.6) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">{agent.name}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          ID: {agent.id}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Gender</span>
          <span className="font-medium">{agent.demographics.gender}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Age</span>
          <span className="font-medium">{agent.demographics.age}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Education</span>
          <span className="font-medium">{agent.demographics.education}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Occupation</span>
          <span className="font-medium">{agent.demographics.occupation}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Political Belief</span>
          <span className="font-medium">{agent.demographics.political_belief}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Religion</span>
          <span className="font-medium">{agent.demographics.religion}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">Attitude Levels</h4>
        <div className="space-y-2">
          {agent.attentions.map((attention, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-xs w-16">Level {idx + 1}:</span>
              <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    attention < 0.3 ? 'bg-green-500' : 
                    attention < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${attention * 100}%` }}
                ></div>
              </div>
              <span className={`ml-2 text-xs ${getAttitudeClass(attention)}`}>
                {(attention * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-700">Latest Tweets</h4>
        <div className="space-y-2 text-xs text-gray-600">
          {agent.tweets.map((tweet, idx) => (
            <div key={idx} className="bg-gray-50 p-2 rounded">
              "{tweet.content}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agent;