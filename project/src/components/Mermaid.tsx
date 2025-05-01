import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#4299e1',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2b6cb0',
        lineColor: '#64748b',
        secondaryColor: '#2b6cb0',
        tertiaryColor: '#1a365d'
      }
    });

    const renderChart = async () => {
      try {
        setError(null);
        const { svg } = await mermaid.render('mermaid-diagram', chart);
        setSvg(svg);
      } catch (err) {
        console.error('Error rendering mermaid chart:', err);
        setError(err.message || 'Error rendering chart');
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-100 rounded-lg">
        Error rendering diagram: {error}
      </div>
    );
  }

  return (
    <div 
      className="w-full overflow-x-auto bg-gray-800 p-4 rounded-lg"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid; 