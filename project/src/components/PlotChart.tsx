import React, { useEffect, useRef } from 'react';
import { SimulationData } from '../types';

interface PlotChartProps {
  simulation: SimulationData;
}

const PlotChart: React.FC<PlotChartProps> = ({ simulation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Add y-axis labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 10}%`, padding - 5, y + 3);
    }
    
    // Generate historical data (assume each step adds a new point)
    const historyLength = Math.min(simulation.step + 1, 10);
    const dataPoints = Array(historyLength).fill(0).map((_, i) => {
      return {
        step: i,
        value: i === simulation.step 
          ? simulation.hesitancy[0] 
          : Math.max(0.1, simulation.hesitancy[0] + (simulation.step - i) * 0.05)
      };
    });
    
    // X-axis labels
    for (let i = 0; i < historyLength; i++) {
      const x = padding + (chartWidth / Math.max(9, historyLength - 1)) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, height - padding);
      ctx.lineTo(x, height - padding + 5);
      ctx.stroke();
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Week ${simulation.step - (historyLength - 1) + i}`, x, height - padding + 15);
    }
    
    // Axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hesitancy Level', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Percentage', 0, 0);
    ctx.restore();
    
    // Plot data - hesitancy over time
    if (dataPoints.length > 1) {
      // Plot line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      dataPoints.forEach((point, i) => {
        const x = padding + (chartWidth / Math.max(9, historyLength - 1)) * i;
        const y = padding + chartHeight - (chartHeight * point.value);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Plot points
      dataPoints.forEach((point, i) => {
        const x = padding + (chartWidth / Math.max(9, historyLength - 1)) * i;
        const y = padding + chartHeight - (chartHeight * point.value);
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.stroke();
        
        // Show value
        if (i === dataPoints.length - 1) {
          ctx.fillStyle = '#3b82f6';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${(point.value * 100).toFixed(1)}%`, x, y - 10);
        }
      });
    }
  }, [simulation]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Hesitancy Over Time</h2>
      <div className="relative h-64 w-full">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={300} 
          className="absolute inset-0 w-full h-full"
        ></canvas>
      </div>
    </div>
  );
};

export default PlotChart;