import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

interface PolicyImpactSceneProps {
  isPlaying: boolean;
  playbackSpeed: number;
}

interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'ambassador' | 'mandate';
  strength: 'weak' | 'strong';
  impact: number;
  timeEvolution: TimeEvolutionData[];
}

interface TimeEvolutionData {
  week: number;
  against: number;
  neutral: number;
  for: number;
}

interface NetworkNode {
  id: number;
  group: number;
  status: 'Pro-vaccine' | 'Hesitant' | 'Neutral';
  x: number;
  y: number;
}

interface NetworkLink {
  source: number;
  target: number;
}

const TOTAL_NODES = 10;

// Calculate scaled counts ensuring they sum to TOTAL_NODES
function calculateScaledCounts(evolution: TimeEvolutionData): { pro: number; hesitant: number; neutral: number } {
  const total = evolution.for + evolution.against + evolution.neutral;
  const scaleFactor = TOTAL_NODES / total;
  
  let pro = Math.round(evolution.for * scaleFactor);
  let hesitant = Math.round(evolution.against * scaleFactor);
  let neutral = Math.round(evolution.neutral * scaleFactor);
  
  // Adjust to ensure total is exactly TOTAL_NODES
  const currentTotal = pro + hesitant + neutral;
  const diff = TOTAL_NODES - currentTotal;
  
  if (diff !== 0) {
    // Add or subtract the difference from the largest group
    if (pro >= hesitant && pro >= neutral) {
      pro += diff;
    } else if (hesitant >= pro && hesitant >= neutral) {
      hesitant += diff;
    } else {
      neutral += diff;
    }
  }
  
  return { pro, hesitant, neutral };
}

const policies: Policy[] = [
  { 
    id: 'fin-weak', 
    name: "Financial Incentive (Weak)", 
    description: "$10 cash card for first dose.", 
    type: 'financial', 
    strength: 'weak', 
    impact: 0.05, 
    timeEvolution: [ 
      { week: 0, against: 3, neutral: 2, for: 5 }, 
      { week: 4, against: 3, neutral: 2, for: 5 }, 
      { week: 8, against: 2, neutral: 3, for: 5 }, 
      { week: 12, against: 2, neutral: 2, for: 6 } 
    ] 
  },
  { 
    id: 'fin-strong', 
    name: "Financial Incentive (Strong)", 
    description: "$50 cash card for first dose.", 
    type: 'financial', 
    strength: 'strong', 
    impact: 0.15, 
    timeEvolution: [ 
      { week: 0, against: 3, neutral: 2, for: 5 }, 
      { week: 4, against: 2, neutral: 2, for: 6 }, 
      { week: 8, against: 1, neutral: 2, for: 7 }, 
      { week: 12, against: 1, neutral: 1, for: 8 } 
    ] 
  },
  { 
    id: 'amb-weak', 
    name: "Ambassador Program (Weak)", 
    description: "Local leaders share info.", 
    type: 'ambassador', 
    strength: 'weak', 
    impact: 0.08, 
    timeEvolution: [ 
      { week: 0, against: 3, neutral: 2, for: 5 }, 
      { week: 4, against: 3, neutral: 2, for: 5 }, 
      { week: 8, against: 2, neutral: 2, for: 6 }, 
      { week: 12, against: 2, neutral: 2, for: 6 } 
    ] 
  },
  { 
    id: 'amb-strong', 
    name: "Ambassador Program (Strong)", 
    description: "Trusted leaders encourage vax.", 
    type: 'ambassador', 
    strength: 'strong', 
    impact: 0.20, 
    timeEvolution: [ 
      { week: 0, against: 3, neutral: 2, for: 5 }, 
      { week: 4, against: 2, neutral: 1, for: 7 }, 
      { week: 8, against: 1, neutral: 1, for: 8 }, 
      { week: 12, against: 1, neutral: 0, for: 9 } 
    ] 
  }
];

export default function PolicyImpactScene({ isPlaying, playbackSpeed }: PolicyImpactSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [networkState, setNetworkState] = useState<'before' | 'after'>('before');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [proVaccineCount, setProVaccineCount] = useState(5);
  const [hesitantCount, setHesitantCount] = useState(3);
  const [neutralCount, setNeutralCount] = useState(2);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(200, width),
          height: Math.max(200, Math.min(width, height))
        });
      }
    };
    
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Auto-select first policy if none selected
  useEffect(() => {
    if (!selectedPolicy && policies.length > 0) {
      setSelectedPolicy(policies[0]);
    }
  }, [selectedPolicy]);

  // Week progression
  useEffect(() => {
    if (!isPlaying || !selectedPolicy) return;
    const weekInterval = setInterval(() => {
      setCurrentWeek(prev => (prev + 4) % 16);
    }, 4000 / playbackSpeed);
    return () => clearInterval(weekInterval);
  }, [isPlaying, selectedPolicy, playbackSpeed]);

  // Update node counts based on current week
  useEffect(() => {
    if (!selectedPolicy) return;
    const weekIndex = Math.floor(currentWeek / 4);
    const evolution = selectedPolicy.timeEvolution[weekIndex];
    if (!evolution) return;
    const { pro, hesitant, neutral } = calculateScaledCounts(evolution);
    setProVaccineCount(pro);
    setHesitantCount(hesitant);
    setNeutralCount(neutral);
  }, [currentWeek, selectedPolicy]);

  const handleNetworkStateChange = useCallback((state: 'before' | 'after') => {
    setNetworkState(state);
    setCurrentWeek(state === 'before' ? 0 : 4);
  }, []);

  // Network visualization
  useEffect(() => {
    if (!svgRef.current || !dimensions) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create nodes
    const nodes: NetworkNode[] = [];
    const statuses = ['Pro-vaccine', 'Hesitant', 'Neutral'] as const;
    const counts = [proVaccineCount, hesitantCount, neutralCount];
    let nodeIndex = 0;

    statuses.forEach((status, groupIndex) => {
      for (let i = 0; i < counts[groupIndex]; i++) {
        nodes.push({
          id: nodeIndex++,
          group: groupIndex,
          status: status,
          x: centerX + (Math.random() * 0.6 - 0.3) * width,
          y: centerY + (Math.random() * 0.6 - 0.3) * height
        });
      }
    });

    // Create links
    const links: NetworkLink[] = [];
    nodes.forEach((node, i) => {
      const numLinks = 1 + Math.floor(Math.random() * 2);
      const possibleTargets = nodes.filter((_, index) => index !== i);
      
      for (let j = 0; j < numLinks && possibleTargets.length > 0; j++) {
        const targetIndex = Math.floor(Math.random() * possibleTargets.length);
        const targetNode = possibleTargets[targetIndex];
        
        if (!links.some(l => 
          (l.source === node.id && l.target === targetNode.id) || 
          (l.source === targetNode.id && l.target === node.id)
        )) {
          links.push({ source: node.id, target: targetNode.id });
          possibleTargets.splice(targetIndex, 1);
        }
      }
    });

    // Set up SVG
    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    // Node colors
    const nodeColors: Record<'Pro-vaccine' | 'Hesitant' | 'Neutral', string> = {
      'Pro-vaccine': '#4CAF50', 
      'Hesitant': '#F44336', 
      'Neutral': '#FFEB3B'
    };

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 60}, 10)`);

    Object.entries(nodeColors).forEach(([status, color], i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 15})`);
      legendRow.append('rect').attr('width', 8).attr('height', 8).attr('fill', color);
      legendRow.append('text')
        .attr('x', 12)
        .attr('y', 8)
        .attr('text-anchor', 'start')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .text(status);
    });

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#4a5568')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 0.5);

    // Add nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', d => nodeColors[d.status]);

    // Set up force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(30).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('collision', d3.forceCollide().radius(8));

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [selectedPolicy, networkState, proVaccineCount, hesitantCount, neutralCount, dimensions]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
      {/* Left Panel: Stats & Policies */}
      <div className="w-full md:w-1/2 flex flex-col gap-3">
        {/* Current Stats */}
        <div className="bg-gray-800 p-3 rounded">
          <h3 className="text-sm font-bold mb-2">Current Statistics</h3>
          <p className="text-xs mb-1">Week {Math.floor(currentWeek/4) * 4}: Hesitancy Rate: {((hesitantCount / TOTAL_NODES) * 100).toFixed(0)}%</p>
          <div className="flex justify-around mt-2 text-xs">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-1"></span>
              Pro: {proVaccineCount}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-1"></span>
              Hes: {hesitantCount}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block mr-1"></span>
              Neu: {neutralCount}
            </span>
          </div>
        </div>

        {/* Policy Selection */}
        <div className="bg-gray-800 p-3 rounded flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-bold mb-2">Select a Policy</h3>
          
          <div className="flex space-x-2 mb-2">
            <button 
              onClick={() => handleNetworkStateChange('before')} 
              className={`flex-1 text-xs py-1 rounded ${networkState === 'before' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              Before
            </button>
            <button 
              onClick={() => handleNetworkStateChange('after')} 
              disabled={!selectedPolicy} 
              className={`flex-1 text-xs py-1 rounded ${networkState === 'after' ? 'bg-blue-600' : 'bg-gray-700'} ${!selectedPolicy ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              After
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {policies.map(policy => (
              <div
                key={policy.id}
                className={`p-2 rounded cursor-pointer transition-colors ${selectedPolicy?.id === policy.id ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => setSelectedPolicy(policy)}
              >
                <h4 className="text-xs font-bold mb-1">{policy.name}</h4>
                <p className="text-xs opacity-80">{policy.description}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs opacity-70">Type: {policy.type}</span>
                  <span className="text-xs opacity-70">Strength: {policy.strength}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Network Visualization */}
      <div 
        ref={containerRef}
        className="w-full md:w-1/2 bg-gray-800 rounded p-3 flex flex-col"
      >
        <h3 className="text-sm font-bold mb-2 text-center">Network Visualization</h3>
        <div className="flex-grow relative">
          <svg 
            ref={svgRef} 
            className="w-full h-full"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}