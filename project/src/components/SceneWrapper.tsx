import React, { ReactNode } from 'react';

interface SceneWrapperProps {
  children: ReactNode;
}

const SceneWrapper: React.FC<SceneWrapperProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-2 overflow-hidden">
      <div className="w-full h-full max-w-6xl mx-auto bg-gray-800 rounded-lg overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default SceneWrapper;