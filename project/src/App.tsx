// src/App.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FlowchartSlide from './components/FlowchartSlide';

// Placeholder component for other slides/content
const DashboardContent: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">{title}</h1>
      <div className="p-4 border border-gray-200 rounded-lg min-h-96 flex items-center justify-center">
        <p className="text-xl text-gray-500">Dashboard content will be displayed here</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    <FlowchartSlide key="flowchart" />,
    <DashboardContent key="simulation" title="Simulation Parameters" />,
    <DashboardContent key="analysis" title="Results Analysis" />,
    <DashboardContent key="metrics" title="Key Metrics" />
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };
  
  return (
    <div className="relative">
      {/* Current slide */}
      {slides[currentSlide]}
      
      {/* Navigation controls */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`p-2 rounded-full ${
            currentSlide === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Slide indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`p-2 rounded-full ${
            currentSlide === slides.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white'
          }`}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;