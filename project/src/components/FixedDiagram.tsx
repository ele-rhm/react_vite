import React from 'react';

interface FixedDiagramProps {
  title: string;
  description: string;
}

const FixedDiagram: React.FC<FixedDiagramProps> = ({ title, description }) => {
  return (
    <div className="w-full max-w-full flex flex-col items-center">
      <h2 className="text-sm font-bold text-white mb-1 text-center">
        {title}
      </h2>
      
      <div className="w-full max-w-full bg-gray-800 rounded-lg p-2 shadow-lg overflow-hidden">
        <svg 
          viewBox="0 0 400 200" 
          width="100%" 
          height="200"
          style={{ maxHeight: "200px" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Data Collection Diagram */}
          
          {/* Source Nodes */}
          <g transform="translate(50,60)">
            <rect x="-40" y="-10" width="80" height="20" rx="3" fill="#4299e1" stroke="#2b6cb0" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Social Media API</text>
          </g>
          
          <g transform="translate(50,120)">
            <rect x="-40" y="-10" width="80" height="20" rx="3" fill="#4299e1" stroke="#2b6cb0" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Factuality Check</text>
          </g>
          
          {/* Process Nodes */}
          <g transform="translate(150,60)">
            <rect x="-40" y="-10" width="80" height="20" rx="3" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Data Collector</text>
          </g>
          
          <g transform="translate(150,120)">
            <rect x="-40" y="-10" width="80" height="20" rx="3" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Web Scraper</text>
          </g>
          
          <g transform="translate(150,170)">
            <rect x="-40" y="-10" width="80" height="20" rx="3" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Classification</text>
          </g>
          
          {/* Filter Nodes */}
          <g transform="translate(235,45)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#1a365d" stroke="#2a4365" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">AI Classifier</text>
          </g>
          
          <g transform="translate(235,75)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#1a365d" stroke="#2a4365" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Keywords</text>
          </g>
          
          <g transform="translate(250,140)">
            <rect x="-40" y="-10" width="80" height="20" rx="3" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Analysis Models</text>
          </g>
          
          {/* Category Nodes */}
          <g transform="translate(350,60)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#48bb78" stroke="#2f855a" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Pro-Vaccine</text>
          </g>
          
          <g transform="translate(350,90)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#48bb78" stroke="#2f855a" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Anti-Vaccine</text>
          </g>
          
          <g transform="translate(350,120)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#48bb78" stroke="#2f855a" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Misinfo</text>
          </g>
          
          <g transform="translate(350,150)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#48bb78" stroke="#2f855a" strokeWidth="1" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8">Safety</text>
          </g>
          
          {/* Connections */}
          {/* Source to Process */}
          <line x1="50" y1="60" x2="150" y2="60" stroke="#64748b" strokeWidth="1" />
          <line x1="50" y1="120" x2="150" y2="120" stroke="#64748b" strokeWidth="1" />
          <line x1="50" y1="120" x2="150" y2="170" stroke="#64748b" strokeWidth="1" />
          
          {/* Process to Filter */}
          <line x1="150" y1="60" x2="235" y2="45" stroke="#64748b" strokeWidth="1" />
          <line x1="150" y1="60" x2="235" y2="75" stroke="#64748b" strokeWidth="1" />
          <line x1="150" y1="170" x2="250" y2="140" stroke="#64748b" strokeWidth="1" />
          
          {/* Filter to Analysis */}
          <line x1="235" y1="45" x2="250" y2="140" stroke="#64748b" strokeWidth="1" />
          <line x1="235" y1="75" x2="250" y2="140" stroke="#64748b" strokeWidth="1" />
          
          {/* Analysis to Categories */}
          <line x1="250" y1="140" x2="350" y2="60" stroke="#64748b" strokeWidth="1" />
          <line x1="250" y1="140" x2="350" y2="90" stroke="#64748b" strokeWidth="1" />
          <line x1="250" y1="140" x2="350" y2="120" stroke="#64748b" strokeWidth="1" />
          <line x1="250" y1="140" x2="350" y2="150" stroke="#64748b" strokeWidth="1" />
          
          {/* Arrowheads */}
          <defs>
            <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="4" refY="1.5" orient="auto">
              <polygon points="0 0, 4 1.5, 0 3" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </div>
      
      <p className="text-gray-300 mt-1 text-center max-w-full mx-auto text-xs">
        {description}
      </p>
    </div>
  );
};

export default FixedDiagram; 