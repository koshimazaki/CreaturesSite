import React, { useEffect } from 'react';
import AudioVisualizer from './AudioVisualizer';
import useAudioStore from './audioStore';

const AudioPlayer = ({ width, position }) => {
  const { isInitialized, cleanup } = useAudioStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!isInitialized) return null;

  return <AudioVisualizer width={width} position={position} />;
};

export default AudioPlayer;