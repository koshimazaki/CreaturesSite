import React, { useEffect, useRef } from 'react';
import AudioVisualizer from './AudioVisualizer';
import useAudioStore from './audioStore';
import { makeInteractive } from '../utils/styles';

const AudioPlayer = ({ width, position }) => {
  const { isInitialized, cleanup, gainNode, audioContext } = useAudioStore();
  const unmountingRef = useRef(false);
  const FADE_TIME = 100;

  useEffect(() => {
    return () => {
      unmountingRef.current = true;
      
      if (isInitialized && gainNode && audioContext && audioContext.state !== 'closed') {
        // Only fade if context is still active
        const currentTime = audioContext.currentTime;
        gainNode.gain.linearRampToValueAtTime(0, currentTime + FADE_TIME / 1000);

        // Wait for fade before cleanup
        setTimeout(() => {
          if (unmountingRef.current && isInitialized) {
            cleanup();
          }
        }, FADE_TIME);
      }
    };
  }, [cleanup, isInitialized, gainNode, audioContext]);

  if (!isInitialized) return null;

  return (
    <div {...makeInteractive}>
      <AudioVisualizer width={width} position={position} />
    </div>
  );
};

export default AudioPlayer;