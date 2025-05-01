import React from 'react';
import { motion } from 'framer-motion';

// Simple node type
interface DiagramNode {
  id: string;
  label: string;
  type: 'source' | 'process' | 'filter' | 'category';
}

// Simple connection type
interface DiagramConnection {
  from: string;
  to: string;
}

interface DiagramVisualizationProps {
  title: string;
  description: string;
}

// Pre-defined data collection pipeline for COVID-19 data
const nodes: DiagramNode[] = [
  { id: 'fc', label: 'Factuality Check', type: 'source' },
  { id: 'api', label: 'Social Media API', type: 'source' },
  { id: 'ws', label: 'Web Scraper', type: 'process' },
  { id: 'smd', label: 'Data Collector', type: 'process' },
  { id: 'fr', label: 'Classification', type: 'process' },
  { id: 'ai', label: 'AI Classifier', type: 'filter' },
  { id: 'kw', label: 'Keywords', type: 'filter' },
  { id: 'pm', label: 'Analysis Models', type: 'process' },
  { id: 'pv', label: 'Pro-Vaccine', type: 'category' },
  { id: 'av', label: 'Anti-Vaccine', type: 'category' },
  { id: 'mf', label: 'Misinfo', type: 'category' },
  { id: 'sf', label: 'Safety', type: 'category' },
];

const connections: DiagramConnection[] = [
  { from: 'fc', to: 'ws' },
  { from: 'ws', to: 'fr' },
  { from: 'api', to: 'smd' },
  { from: 'smd', to: 'ai' },
  { from: 'smd', to: 'kw' },
  { from: 'fr', to: 'pm' },
  { from: 'ai', to: 'pm' },
  { from: 'kw', to: 'pm' },
  { from: 'pm', to: 'pv' },
  { from: 'pm', to: 'av' },
  { from: 'pm', to: 'mf' },
  { from: 'pm', to: 'sf' },
];

const DiagramVisualization: React.FC<DiagramVisualizationProps> = ({ title, description }) => {
  // Get node position by ID with more compact layout
  const getNodePosition = (id: string): { x: number; y: number } => {
    const nodeIndex = nodes.findIndex(node => node.id === id);
    
    // Column definitions - even more reduced spacing
    const columns = {
      source: 0,
      process: 1,
      filter: 2, 
      category: 3
    };
    
    const node = nodes[nodeIndex];
    
    // Base positions with ultra-compact layout
    let x = columns[node.type] * 140 + 70;
    
    // Special cases for filters - ultra-compact
    if (node.type === 'filter') {
      if (node.id === 'ai') {
        x = columns.filter * 140 + 35;
      } else if (node.id === 'kw') {
        x = columns.filter * 140 + 105;
      }
    }
    
    // Calculate Y position based on type - ultra-compact
    let y = 0;
    
    if (node.type === 'source') {
      y = nodeIndex * 60 + 60;
    } else if (node.type === 'process') {
      const typeNodes = nodes.filter(n => n.type === 'process');
      const typeIndex = typeNodes.findIndex(n => n.id === id);
      y = typeIndex * 60 + 90;
    } else if (node.type === 'filter') {
      const filterIndex = node.id === 'ai' ? 0 : 1;
      y = filterIndex * 40 + 120;
    } else if (node.type === 'category') {
      const categoryIndex = nodes.filter(n => n.type === 'category').findIndex(n => n.id === id);
      y = categoryIndex * 35 + 80;
    }
    
    return { x, y };
  };

  // Get color based on node type
  const getNodeColor = (type: string): { bg: string; border: string } => {
    switch (type) {
      case 'source':
        return { bg: '#4299e1', border: '#2b6cb0' };
      case 'process':
        return { bg: '#2d3748', border: '#4a5568' };
      case 'filter':
        return { bg: '#1a365d', border: '#2a4365' };
      case 'category':
        return { bg: '#48bb78', border: '#2f855a' };
      default:
        return { bg: '#718096', border: '#4a5568' };
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center scale-90">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <h2 className="text-lg font-bold text-white mb-2 text-center">
          {title}
        </h2>
        
        <div className="w-full bg-gray-800 rounded-lg p-2 shadow-lg overflow-hidden">
          <svg 
            viewBox="0 0 560 240" 
            className="w-full" 
            style={{ maxHeight: "240px" }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw connections first (so they're under the nodes) */}
            {connections.map((conn, index) => {
              const fromPos = getNodePosition(conn.from);
              const toPos = getNodePosition(conn.to);
              
              return (
                <motion.path
                  key={`conn-${index}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ delay: 0.2 + index * 0.02, duration: 0.3 }}
                  d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                  stroke="#64748b"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Define arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="4"
                refX="6"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill="#64748b" />
              </marker>
            </defs>
            
            {/* Draw nodes */}
            {nodes.map((node, index) => {
              const pos = getNodePosition(node.id);
              const colors = getNodeColor(node.type);
              
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.02, duration: 0.2 }}
                  transform={`translate(${pos.x}, ${pos.y})`}
                >
                  <rect
                    x="-40"
                    y="-10"
                    width="80"
                    height="20"
                    rx="3"
                    fill={colors.bg}
                    stroke={colors.border}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                  >
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-300 mt-2 text-center max-w-xl mx-auto text-xs"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

export default DiagramVisualization; 