export interface Agent {
  id: number;
  name: string;
  demographics: {
    gender: string;
    age: number;
    education: string;
    occupation: string;
    political_belief: string;
    religion: string;
  };
  attentions: number[];
  tweets: { content: string }[];
}

export interface SimulationResult {
  agent_id: number;
  name: string;
  demographics: {
    gender: string;
    age: number;
    education: string;
    occupation: string;
    political_belief: string;
    religion: string;
  };
  attentions: number[];
  tweets: { content: string }[];
  result?: string;
}

export interface SimulationData {
  step: number;
  hesitancy: number[];
  policy_type: string;
  policy_effort: string;
  results: SimulationResult[];
  agents: Agent[];
}