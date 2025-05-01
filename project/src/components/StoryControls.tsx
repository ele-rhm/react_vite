import { Play, Pause, SkipBack, SkipForward, FastForward, Rewind } from 'lucide-react';
import { Scene } from './Story';

interface StoryControlsProps {
  currentScene: Scene;
  setCurrentScene: (scene: Scene) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const scenes: Scene[] = [
  'introduction',
  'information-flow',
  'policy-impact'
];

export default function StoryControls({
  currentScene,
  setCurrentScene,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed
}: StoryControlsProps) {
  const currentIndex = scenes.indexOf(currentScene);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentScene(scenes[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === scenes.length - 1}
            className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleSpeedChange}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            {playbackSpeed}x
          </button>
          
          <div className="flex space-x-2">
            {scenes.map((scene, index) => (
              <button
                key={scene}
                onClick={() => setCurrentScene(scene)}
                className={`w-2 h-2 rounded-full ${
                  currentScene === scene ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 