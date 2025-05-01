import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AgentProcessingSceneProps {
  isPlaying: boolean;
  playbackSpeed: number;
}

interface Agent {
  id: number;
  name: string;
  attitude: number;
  memory: string[];
  currentThought: string;
  demographics: {
    gender: string;
    age: string;
    education: string;
    occupation: string;
    political_belief: string;
    religion: string;
  };
  attitudeHistory: number[];
  color: string;
}

export default function AgentProcessingScene({ isPlaying, playbackSpeed }: AgentProcessingSceneProps) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 0, name: "Young Educator", attitude: 3, memory: [], currentThought: "...",
      demographics: { gender: "M", age: "18-25", education: "Bach.", occupation: "Edu.", political_belief: "Con.", religion: "Jud." },
      attitudeHistory: [3,1,4,4,4,4,3,3,4,3,1,3,4,3,4,4,3,4,3,2],
      color: '#4CAF50'
    },
    {
      id: 1, name: "Retired Conservative", attitude: 4, memory: [], currentThought: "...",
      demographics: { gender: "F", age: "66+", education: "Bach.", occupation: "Ret.", political_belief: "Con.", religion: "None" },
      attitudeHistory: [4,4,4,4,3,1,1,2,4,1,2,4,1,3,1,3,1,4,4,4],
      color: '#9C27B0'
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const maxSteps = 20;
  const chartRef = useRef(null);

  const informationEvents = [
    { event: "Initial study", impacts: { 0: "Convincing", 1: "Trusts" } as { [key: number]: string }, type: "sci" },
    { event: "Social media side effects", impacts: { 0: "Concerned", 1: "Shares" } as { [key: number]: string }, type: "mis" },
    { event: "Doctor explains benefits", impacts: { 0: "Values expert", 1: "Positive" } as { [key: number]: string }, type: "med" },
    { event: "Community vax rates up", impacts: { 0: "Positive resp.", 1: "Sees neighbors" } as { [key: number]: string }, type: "com" },
    { event: "Mandate debate", impacts: { 0: "Freedom vs Health", 1: "Opposes" } as { [key: number]: string }, type: "pol" },
    { event: "New variant", impacts: { 0: "Need protection", 1: "Doubts vax" } as { [key: number]: string }, type: "news" },
    { event: "Friend reports effects", impacts: { 0: "Risks vs Persp.", 1: "Hesitant" } as { [key: number]: string }, type: "pers" },
    { event: "Updated safety data", impacts: { 0: "Reviews data", 1: "Sees safety" } as { [key: number]: string }, type: "sci" },
    { event: "Conspiracy theory", impacts: { 0: "Dismisses", 1: "Concerning" } as { [key: number]: string }, type: "mis" },
    { event: "Health dept. reco.", impacts: { 0: "Aligns w/ guide", 1: "Questions auth." } as { [key: number]: string }, type: "off" },
    { event: "Family gets vax", impacts: { 0: "Positive exp.", 1: "Reconsiders" } as { [key: number]: string }, type: "pers" },
    { event: "Religious leader discussion", impacts: { 0: "Ethical consid.", 1: "Values spirit." } as { [key: number]: string }, type: "rel" },
    { event: "Breakthrough reported", impacts: { 0: "Understands limits", 1: "Questions vax" } as { [key: number]: string }, type: "news" },
    { event: "Workplace policy", impacts: { 0: "Supports safety", 1: "Job concerns" } as { [key: number]: string }, type: "pol" },
    { event: "Vax passport system", impacts: { 0: "Public health", 1: "Govt overreach" } as { [key: number]: string }, type: "off" },
    { event: "Mobile clinic drive", impacts: { 0: "Access appreciated", 1: "Skeptical" } as { [key: number]: string }, type: "com" },
    { event: "Financial incentive", impacts: { 0: "Helps goals", 1: "Questions motives" } as { [key: number]: string }, type: "pol" },
    { event: "Religious exemption clarity", impacts: { 0: "Balanced approach", 1: "Appreciates" } as { [key: number]: string }, type: "pol" },
    { event: "Global success stories", impacts: { 0: "Intl evidence", 1: "Compares" } as { [key: number]: string }, type: "glob" },
    { event: "Local outbreak", impacts: { 0: "Immediate threat", 1: "Witnesses impact" } as { [key: number]: string }, type: "news" }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 2000 / playbackSpeed;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % maxSteps;
        if (nextStep === 0) {
          // Reset thoughts at the start of a cycle
          setAgents(prevAgents => prevAgents.map(agent => ({ ...agent, currentThought: "..." })))
        }
        return nextStep;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  useEffect(() => {
    if (currentStep === 0 && !isPlaying) return;
    const currentEvent = informationEvents[currentStep];
    if (!currentEvent) return;

    setAgents(prevAgents => 
      prevAgents.map(agent => ({
        ...agent,
        attitude: agent.attitudeHistory[currentStep],
        currentThought: currentEvent.impacts[agent.id] ?? "No specific impact noted"
      }))
    );
  }, [currentStep, isPlaying]);

  const getAttitudeLabel = (attitude: number): string => {
    const labels = ["Strongly Against", "Somewhat Against", "Neutral", "Somewhat For", "Strongly For"];
    return labels[attitude] || "Unknown";
  };

  const chartData = {
    labels: Array.from({ length: maxSteps }, (_, i) => `${i + 1}`),
    datasets: agents.map(agent => ({
      label: agent.name,
      data: agent.attitudeHistory.slice(0, currentStep + 1),
      borderColor: agent.color,
      backgroundColor: agent.color,
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.1,
      borderWidth: 2
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: { 
          boxWidth: 10, 
          padding: 10, 
          font: { size: 11 }
        }
      },
      title: { 
        display: true, 
        text: 'Attitude Changes Over Time', 
        font: { size: 14 }, 
        padding: { top: 5, bottom: 10 }
      },
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 12 },
        bodyFont: { size: 11 },
        padding: 10
      }
    },
    scales: {
      y: { 
        min: 0, 
        max: 4, 
        ticks: { 
          stepSize: 1, 
          font: { size: 10 },
          callback: function(value: string | number) {
            if (typeof value === 'number') {
              return getAttitudeLabel(value);
            }
            return value;
          } 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        } 
      },
      x: { 
        ticks: { 
          font: { size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    animation: {
      duration: 0
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
      {/* Agent Info Panel */}
      <div className="w-full md:w-1/2 flex flex-col gap-2 overflow-y-auto bg-gray-900 rounded p-3">
        <h3 className="text-sm font-bold text-center mb-2">Agent Responses</h3>
        {agents.map(agent => (
          <div 
            key={agent.id} 
            className="bg-gray-800 p-3 rounded flex flex-col shrink-0"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold" style={{ color: agent.color }}>{agent.name}</h3>
              <span className="text-xs opacity-70">
                {agent.demographics.age} • {agent.demographics.education} • {agent.demographics.political_belief}
              </span>
            </div>
            <div className="text-xs mb-1">
              <span className="font-semibold">Attitude:</span> {getAttitudeLabel(agent.attitude)}
            </div>
            <div className="text-xs mb-1">
              <span className="font-semibold">Impact:</span>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-xs font-medium">{informationEvents[currentStep]?.event || 'Starting...'}</p>
              <p className="text-xs italic opacity-80">{agent.currentThought}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Panel */}
      <div className="w-full md:w-1/2 bg-gray-800 p-3 rounded flex flex-col">
        <div className="mb-2 text-center">
          <h3 className="text-sm font-bold">How Information Shapes Attitudes</h3>
          <p className="text-xs opacity-80">
            Step {currentStep + 1}: {informationEvents[currentStep]?.event || 'Starting...'}
          </p>
        </div>
        <div className="flex-grow min-h-0 relative">
          <div ref={chartRef} className="w-full h-full">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}