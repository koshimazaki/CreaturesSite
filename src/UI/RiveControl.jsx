// RiveControl.jsx
import React from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const RiveControl = ({ onStart, show }) => {
  const { rive: playRive, RiveComponent: PlayComponent } = useRive({
    src: '/buttons.riv',
    artboard: 'Play',
    animations: ['Arrows', 'Hologram'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    })
  });

  const handleClick = () => {
    if (playRive) {
      playRive.play('Hologram');
    }
    onStart();
  };

  if (!show) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '10vw',
        left: '7vw',
        width: '200px',
        height: '200px',
        cursor: 'pointer',
        zIndex: 10000
      }}
    >
      <PlayComponent />
    </div>
  );
};

export default RiveControl;
