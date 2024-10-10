import React from 'react';
import StartSVG from '/src/assets/images/Start.svg?url';

const IOSStartButton = ({ isVisible, onStart }) => {
  if (!isVisible) return null;

  const handleStart = () => {
    // Create and play a silent audio to unlock audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const silentBuffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = silentBuffer;
    source.connect(audioContext.destination);
    source.start();

    // Call the onStart function
    onStart();
  };

  return (
    <button
      onClick={handleStart}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        width: '150px',
        height: 'auto',
        transition: 'transform 0.2s ease',
      }}
    >
      <img 
        src={StartSVG} 
        alt="Start" 
        style={{ 
          width: '100%', 
          height: 'auto',
        }}
      />
    </button>
  );
};

export default IOSStartButton;
