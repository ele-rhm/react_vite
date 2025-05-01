// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import IntroductionScene from './components/scenes/IntroductionScene';
import AgentProcessingScene from './components/scenes/AgentProcessingScene';
import InformationFlowScene from './components/scenes/InformationFlowScene';
import PolicyImpactScene from './components/scenes/PolicyImpactScene';
import SceneWrapper from './components/SceneWrapper';

interface SceneProps {
  isPlaying: boolean;
  playbackSpeed: number;
}

interface Scene {
  component: React.ComponentType<SceneProps>;
  title: string;
  description: string;
}

const App: React.FC = () => {
  console.log('App component rendering');

  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  useEffect(() => {
    console.log('App mounted');
  }, []);

  const scenes: Scene[] = [
    {
      component: IntroductionScene,
      title: "Social Network",
      description: "Explore the network of individuals with diverse backgrounds"
    },
    {
      component: InformationFlowScene,
      title: "Information Flow",
      description: "Watch how information spreads through the network"
    },
    {
      component: AgentProcessingScene,
      title: "Agent Processing",
      description: "See how different agents react to information"
    },
    {
      component: PolicyImpactScene,
      title: "Policy Impact",
      description: "Analyze the effect of different policies"
    }
  ];
  
  const handlePrevious = () => {
    setCurrentScene((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentScene((prev) => Math.min(scenes.length - 1, prev + 1));
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };
  
  const CurrentSceneComponent = scenes[currentScene].component;
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-semibold text-xl">{scenes[currentScene].title}</h1>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-400">
              {currentScene + 1} / {scenes.length}
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-md hidden md:block">
            {scenes[currentScene].description}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <SceneWrapper>
          <CurrentSceneComponent 
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
          />
        </SceneWrapper>
      </main>
      
      {/* Controls Footer */}
      <footer className="p-4 border-t border-gray-800">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={changeSpeed}
              className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              {playbackSpeed}x
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentScene === 0}
              className={`p-2 rounded-full transition-colors ${
                currentScene === 0 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {scenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScene(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentScene === index ? 'bg-white' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to scene ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              disabled={currentScene === scenes.length - 1}
              className={`p-2 rounded-full transition-colors ${
                currentScene === scenes.length - 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Next scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;