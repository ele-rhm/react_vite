import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroductionScene from './scenes/IntroductionScene';
import InformationFlowScene from './scenes/InformationFlowScene';
import PolicyImpactScene from './scenes/PolicyImpactScene';
import StoryControls from './StoryControls';

export type Scene = 'introduction' | 'information-flow' | 'policy-impact';

const scenes = {
  'introduction': IntroductionScene,
  'information-flow': InformationFlowScene,
  'policy-impact': PolicyImpactScene,
} as const;

export default function Story() {
  const [currentScene, setCurrentScene] = useState<Scene>('introduction');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleSceneChange = (newScene: Scene) => {
    if (scenes[newScene]) {
      setCurrentScene(newScene);
    } else {
      console.error('Invalid scene:', newScene);
      setCurrentScene('introduction');
    }
  };

  const CurrentScene = scenes[currentScene];
  
  if (!CurrentScene) {
    console.error('Scene not found:', currentScene);
    return null;
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <CurrentScene
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
          />
        </motion.div>
      </AnimatePresence>
      
      <StoryControls
        currentScene={currentScene}
        setCurrentScene={handleSceneChange}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
      />
    </div>
  );
} 