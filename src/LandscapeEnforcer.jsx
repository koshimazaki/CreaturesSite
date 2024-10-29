import React, { useState, useEffect, forwardRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const LandscapeEnforcer = forwardRef(({ children }, ref) => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [riveError, setRiveError] = useState(null);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const { RiveComponent, rive } = useRive({
    src: '/buttons.riv', // Make sure this path is correct
    animations: ['Menu text rotation','Menu rotation'],
    artboard: 'Spin',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('Rive file loaded successfully in LandscapeEnforcer');
    },
    onError: (e) => {
      console.error('Rive loading error in LandscapeEnforcer:', e);
      setRiveError(e);
    },
  });

  useEffect(() => {
    if (rive && !isLandscape) {
      rive.play('Menu text rotation');
    }
  }, [rive, isLandscape]);

  if (!isLandscape) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#15171A',
        color: '#fc0398', //pink 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        fontFamily: 'Monorama, sans-serif',
        fontSize: '24px',
        textShadow: '0 0 10px rgba(252, 3, 152, 0.7), 0 0 20px rgba(252, 3, 152, 0.5)',
        textAlign: 'center',
      }}>
        <div>Please rotate your device to landscape mode for the best experience.</div>
        <div style={{ width: '100px', height: '100px', marginTop: '20px' }}>
          {riveError ? (
            <div>Error loading animation: {riveError.message}</div>
          ) : (
            <RiveComponent />
          )}
        </div>
      </div>
    );
  }

  return children;
});

LandscapeEnforcer.displayName = 'LandscapeEnforcer';


export default LandscapeEnforcer;
