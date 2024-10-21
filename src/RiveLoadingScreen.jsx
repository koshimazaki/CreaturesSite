import React, { useState, useEffect, useCallback } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import LoreText from './LoreText';
import useStore from './zustandStore';

const RiveLoadingScreen = ({ onStart, audioPlayerRef }) => {
  const [riveError, setRiveError] = useState(null);
  const [riveLoaded, setRiveLoaded] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [showLoreText, setShowLoreText] = useState(false);
  const [localIsStarted, setLocalIsStarted] = useState(false);
  const [opacity, setOpacity] = useState(1);
  
  const isLoaded = useStore(state => state.isLoaded);
  const setIsStarted = useStore(state => state.setIsStarted);
  const deviceType = useStore(state => state.deviceType);
  const progress = useStore(state => state.progress);

  useEffect(() => {
    setLocalProgress(progress);
    if (progress === 100) {
      // Start LoreText animation 2 seconds after progress is loaded
      setTimeout(() => setShowLoreText(true), 2000);
    }
  }, [progress]);

  useEffect(() => {
    if (localIsStarted) {
      const fadeOutInterval = setInterval(() => {
        setOpacity((prevOpacity) => {
          if (prevOpacity <= 0) {
            clearInterval(fadeOutInterval);
            return 0;
          }
          return prevOpacity - 0.1;
        });
      }, 50);
      return () => clearInterval(fadeOutInterval);
    }
  }, [localIsStarted]);

  const { RiveComponent, rive } = useRive({
    src: '/Creature_uiV3.riv',
    stateMachines: ['Creature SM'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('Rive file loaded successfully');
      setRiveLoaded(true);
    },
    onError: (e) => {
      console.error('Rive loading error:', e);
      setRiveError(e);
    },
  });

  const playStartInput = useStateMachineInput(rive, 'Creature SM', 'Play start');
  const playHoverInput = useStateMachineInput(rive, 'Creature SM', 'Play hovered');

  const handlePlayHover = useCallback((isHovering) => {
    if (playHoverInput) playHoverInput.value = isHovering;
  }, [playHoverInput]);

  const handlePlayClick = useCallback(() => {
    if (playStartInput) playStartInput.fire();
    setLocalIsStarted(true);
    setIsStarted(true);
    onStart();
  }, [playStartInput, setIsStarted, onStart]);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#14171A',
      color: '#14171A',
      zIndex: localIsStarted ? 1 : 9999,
      overflow: 'hidden',
      opacity: opacity,
      transition: 'opacity 0.5s ease-in-out',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <RiveComponent />
      </div>
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: deviceType === 'mobile' ? '150px' : '200px',
          height: deviceType === 'mobile' ? '75px' : '100px',
          cursor: 'pointer',
        }}
        onMouseEnter={() => handlePlayHover(true)}
        onMouseLeave={() => handlePlayHover(false)}
        onClick={handlePlayClick}
      />
      {!isLoaded && (
        <div 
          style={{ 
            position: 'absolute',
            bottom: deviceType === 'mobile' ? '20%' : '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: deviceType === 'mobile' ? '200px' : '250px', 
            height: '30px', 
            background: 'transparent',
            border: '2px solid #14171A',
            borderRadius: '5px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#14171A',
            fontSize: deviceType === 'mobile' ? '12px' : '14px',
            fontFamily: 'Monorama, sans-serif',
            transition: 'opacity 0.8s ease-out',
            opacity: isLoaded ? 0 : 1,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            width: `${localProgress}%`,
            height: '100%',
            opacity: 0.9,
            background: '#03d7fc',
            position: 'absolute',
            left: 0,
            top: 0,
            transition: 'width 0.3s ease-out',
          }} />
          <span style={{ 
            position: 'relative', 
            zIndex: 1,
            fontSize: localProgress === 100 ? (deviceType === 'mobile' ? '24px' : '28px') : (deviceType === 'mobile' ? '20px' : '24px'),
            fontWeight: 'bold',
          }}>{`${Math.round(localProgress)}%`}</span>
        </div>
      )}
      {showLoreText && <LoreText isStarted={localIsStarted} />}
    </div>
  );
};

export default RiveLoadingScreen;
