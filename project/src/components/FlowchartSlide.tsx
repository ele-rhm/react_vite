// src/components/FlowchartSlide.tsx
import React, { useState, useEffect } from 'react';

const FlowchartSvg: React.FC = () => {
  // This state tracks the container size to make the SVG responsive
  const [containerSize, setContainerSize] = useState({ width: 800, height: 900 });
  
  // This effect sets up the resize observer to adjust the SVG viewBox
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('flowchart-container');
      if (container) {
        // Adjust the height based on the width to maintain aspect ratio
        const containerWidth = container.clientWidth;
        // Original aspect ratio is 8:9 (800:900)
        const containerHeight = containerWidth * (9/8);
        setContainerSize({ width: containerWidth, height: containerHeight });
      }
    };
    
    // Initial size
    handleResize();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    const container = document.getElementById('flowchart-container');
    if (container) {
      resizeObserver.observe(container);
    }
    
    // Clean up
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  return (
    <div 
      id="flowchart-container" 
      className="w-full h-full overflow-visible"
      style={{ minHeight: `${containerSize.height}px` }}
    >
      <svg 
        viewBox="0 0 800 900" 
        width={containerSize.width} 
        height={containerSize.height}
        preserveAspectRatio="xMidYMid meet"
        aria-labelledby="flowchart-title flowchart-desc"
        className="mx-auto"
      >
        <title id="flowchart-title">Simulation System Flowchart</title>
        <desc id="flowchart-desc">A flowchart showing the process flow of the simulation system</desc>
        
        {/* Styles */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
          </marker>
        </defs>
        
        {/* Initial Setup Phase */}
        {/* Box 1: Initialization */}
        <rect x="300" y="30" width="200" height="60" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="60" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Initialization</text>
        
        {/* Arrow 1 */}
        <line x1="400" y1="90" x2="400" y2="120" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Box 2: Agent Demographics Sampling */}
        <rect x="300" y="120" width="200" height="60" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="140" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Agent Demographics</text>
        <text x="400" y="160" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">Sampling</text>
        
        {/* Arrow 2 */}
        <line x1="400" y1="180" x2="400" y2="210" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Box 3: Agent Creation */}
        <rect x="300" y="210" width="200" height="60" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="240" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Agent Creation</text>
        
        {/* Arrow 3 */}
        <line x1="400" y1="270" x2="400" y2="300" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Box 4: Social Network & News Generation */}
        <rect x="300" y="300" width="200" height="60" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="320" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Social Network &</text>
        <text x="400" y="340" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">News Generation</text>
        
        {/* Arrow 4 */}
        <line x1="400" y1="360" x2="400" y2="390" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

        {/* Simulation Loop */}
        <rect x="150" y="390" width="500" height="60" fill="#e6f2ff" stroke="#4361ee" strokeWidth="2.5" rx="10" ry="10" />
        <text x="400" y="420" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333" fontWeight="bold">Simulation Loop (each step)</text>
        
        {/* Parallel Arrows */}
        <line x1="200" y1="450" x2="200" y2="480" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        <line x1="400" y1="450" x2="400" y2="480" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        <line x1="600" y1="450" x2="600" y2="480" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Parallel Boxes */}
        <rect x="100" y="480" width="200" height="80" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="200" y="510" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Recommend News</text>
        <text x="200" y="530" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">Articles</text>
        
        <rect x="300" y="480" width="200" height="80" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="510" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Recommend Tweets</text>
        <text x="400" y="530" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">from Network</text>
        
        <rect x="500" y="480" width="200" height="80" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="600" y="510" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Disease Risk</text>
        <text x="600" y="530" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">Information</text>
        
        {/* Merge Arrows */}
        <path d="M 200,560 L 200,590 L 400,590" stroke="#555" strokeWidth="2" fill="none" />
        <path d="M 400,560 L 400,590" stroke="#555" strokeWidth="2" fill="none" />
        <path d="M 600,560 L 600,590 L 400,590" stroke="#555" strokeWidth="2" fill="none" />
        <line x1="400" y1="590" x2="400" y2="620" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Decision Process Box */}
        <rect x="200" y="620" width="400" height="100" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="650" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Agent Decision Process</text>
        <text x="400" y="675" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">(Memory update, lesson parsing,</text>
        <text x="400" y="695" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">attitude determination, tweet generation)</text>
        
        {/* Arrow 5 */}
        <line x1="400" y1="720" x2="400" y2="750" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Update Metrics Box */}
        <rect x="200" y="750" width="400" height="80" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="780" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Update Hesitancy Metrics &</text>
        <text x="400" y="800" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">Store Results</text>
        
        {/* Arrow 6 */}
        <line x1="400" y1="830" x2="400" y2="850" stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        
        {/* Final Analysis Box */}
        <rect x="300" y="850" width="200" height="60" fill="#f0f8ff" stroke="#3a86ff" strokeWidth="2" rx="10" ry="10" />
        <text x="400" y="870" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="#333">Final Analysis</text>
        <text x="400" y="890" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#555" fontStyle="italic">& Visualization</text>
      </svg>
    </div>
  );
};

const FlowchartSlide: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 pb-20">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 mb-16">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Simulation System Architecture</h1>
        
        {/* Container with proper sizing to ensure full flowchart visibility */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 w-full">
            <FlowchartSvg />
          </div>
          
          <div className="lg:w-1/4 w-full text-gray-700">
            <h2 className="text-xl font-semibold mb-2">Process Overview</h2>
            <p className="mb-4">
              This flowchart illustrates the complete workflow of our agent-based simulation system, 
              from initialization through the simulation loop to final analysis and visualization.
            </p>
            <h3 className="text-lg font-medium mb-2">Key Components:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><span className="font-medium">Initialization & Setup</span>: System configuration and environment setup</li>
              <li><span className="font-medium">Agent Creation</span>: Demographics sampling and agent instantiation</li>
              <li><span className="font-medium">Social Network</span>: Generation of connections between agents</li>
              <li><span className="font-medium">Simulation Loop</span>: Core iterative process with recommendations and decisions</li>
              <li><span className="font-medium">Analysis</span>: Final data processing and visualization of results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartSlide;