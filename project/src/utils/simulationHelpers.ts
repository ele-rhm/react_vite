import { SimulationData, Agent } from '../types';

// Generate dummy data for simulation
export const generateInitialSimulation = (): SimulationData => {
  return {
    step: 0,
    hesitancy: [0.7, 0.65, 0.6, 0.55],
    policy_type: 'financial',
    policy_effort: 'strong',
    results: [],
    agents: generateAgents(4),
  };
};

// Generate random agents
export const generateAgents = (count: number): Agent[] => {
  const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD'];
  const occupations = ['Healthcare Worker', 'Teacher', 'Engineer', 'Student'];
  const politicalBeliefs = ['Liberal', 'Conservative', 'Moderate', 'Libertarian'];
  const religions = ['Christianity', 'Islam', 'Judaism', 'Buddhism', 'Atheism'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Agent ${String.fromCharCode(65 + i)}`, // A, B, C, D...
    demographics: {
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      age: Math.floor(Math.random() * 50) + 20, // Age between 20 and 70
      education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      political_belief: politicalBeliefs[Math.floor(Math.random() * politicalBeliefs.length)],
      religion: religions[Math.floor(Math.random() * religions.length)],
    },
    attentions: Array.from({ length: 4 }, () => parseFloat((Math.random() * 0.8 + 0.1).toFixed(2))),
    tweets: [
      { content: "Just heard about the new vaccine policy. Interesting approach." },
      { content: "I wonder how this will affect healthcare workers like me." }
    ]
  }));
};

// Advance simulation by one step
export const advanceSimulation = (data: SimulationData): SimulationData => {
  const newStep = data.step + 1;
  // Simulate changing hesitancy over time
  const newHesitancy = data.hesitancy.map(h => 
    Math.max(0.1, parseFloat((h - Math.random() * 0.15).toFixed(2)))
  );
  
  // Update agents' attitudes
  const updatedAgents = data.agents.map(agent => ({
    ...agent,
    attentions: agent.attentions.map(a => 
      Math.max(0.1, parseFloat((a - Math.random() * 0.1).toFixed(2)))
    ),
    tweets: [
      ...agent.tweets,
      { content: `Week ${newStep}: My hesitancy level is now ${agent.attentions[0] - Math.random() * 0.1}` }
    ].slice(-3) // Keep only the most recent 3 tweets
  }));
  
  // Update results
  const newResults = updatedAgents.map(agent => ({
    agent_id: agent.id,
    name: agent.name,
    demographics: agent.demographics,
    attentions: agent.attentions,
    tweets: agent.tweets,
    result: agent.attentions[0] < 0.4 ? 'Pro-vaccine' : 'Hesitant'
  }));
  
  return {
    ...data,
    step: newStep,
    hesitancy: newHesitancy,
    agents: updatedAgents,
    results: newResults
  };
};