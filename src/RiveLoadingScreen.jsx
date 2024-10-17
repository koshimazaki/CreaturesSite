import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import TextLore from './TextLore';

const RiveLoadingScreen = ({ isLoaded, progress, onStart }) => {
  const [riveError, setRiveError] = useState(null);
  const [visibleText, setVisibleText] = useState([]);
  const [cursor, setCursor] = useState('_');
  const [showCursor, setShowCursor] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [riveLoaded, setRiveLoaded] = useState(false);

  const { RiveComponent, rive } = useRive({
    src: '/Creature_ui.riv',
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
  const menuHoveredInput = useStateMachineInput(rive, 'Creature SM', 'Menu hovered');
  const playHoverInput = useStateMachineInput(rive, 'Creature SM', 'Play hovered');
  const menuStateInput = useStateMachineInput(rive, 'Creature SM', 'Menu');
  const openMenuInput = useStateMachineInput(rive, 'Creature SM', 'Menu state');

  useEffect(() => {
    if (riveLoaded) {
      // Delay the start of TextLore by 5 seconds after Rive file loads
      const timer = setTimeout(() => {
        setIsStarted(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [riveLoaded]);

  useEffect(() => {
    if (rive) {
      const listener = (event) => {
        console.log('Rive state change event:', event);
        if (event.data && event.data[0] === 'Initial Animation Complete') {
          console.log('Initial animation complete, starting TextLore');
          setIsStarted(true);
        }
      };

      rive.on('stateChange', listener);

      return () => {
        rive.off('stateChange', listener);
      };
    }
  }, [rive]);

  useEffect(() => {
    if (rive) {
      const inputs = rive.stateMachineInputs('Creature SM');
      console.log('All inputs:', inputs);

      // Function to update input values
      const updateInputs = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        inputs.forEach(input => {
          if (input.name === 'viewportWidth') {
            input.value = viewportWidth;
          } else if (input.name === 'viewportHeight') {
            input.value = viewportHeight;
          }
        });

        console.log('Viewport size updated:', viewportWidth, viewportHeight);
      };

      // Initial update
      updateInputs();

      // Listen for resize events
      window.addEventListener('resize', updateInputs);

      // Cleanup
      return () => {
        window.removeEventListener('resize', updateInputs);
      };
    }
  }, [rive]);

  const handlePlayHover = useCallback((isHovering) => {
    if (playHoverInput) {
      playHoverInput.value = isHovering;
      console.log('Play hover:', isHovering);
    }
  }, [playHoverInput]);

  const handlePlayClick = useCallback(() => {
    console.log('Play button clicked');
    if (playStartInput) {
      playStartInput.fire();
      console.log('Play start input fired');
    }
    onStart();
    // if (audioPlayerRef.current) {
    //   audioPlayerRef.current.playAudio();
    // }
  }, [onStart]);



  const handleMenuHover = useCallback((isHovering) => {
    if (menuHoveredInput) {
      menuHoveredInput.value = isHovering;
      console.log('Menu hover:', isHovering);
    }
  }, [menuHoveredInput]);

  const handleMenuClick = useCallback(() => {
    console.log('Menu button clicked');
    if (openMenuInput) {
      openMenuInput.fire();
      console.log('Open menu input fired');
    }
  }, [openMenuInput]);

  useEffect(() => {
    if (menuStateInput) {
      const menuState = menuStateInput.value;
      console.log('Menu state changed:', menuState);
      setMenuOpen(menuState === 1);
      setMenuText(menuState === 1 ? 'Welcome to the Menu!' : '');
    }
  }, [menuStateInput]);

  const loreTexts = useMemo(() => [
   "Welcome to Glitch Candies: Creatures",
    "We are stuck between galaxies...",
    "Magic worlds are assembling...",
    "Creatures morph and glitch into new forms...",
    "Tech and spells are generating...",
    "Epic bosses are spawning...",
    "Clues are scattered across...",
    "Intergalactic travel will continue soon...",
    "The journey is starting soon...",
  ], []);

  const scrambleChars = useMemo(() => 'Creatures!#$^&*()_+-=[]{}|;:,./<>?', []);
  const getRandomChar = useCallback(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)], [scrambleChars]);
  const cursorChars = useMemo(() => ['_', '..', ''], []);
  const getRandomCursor = useCallback(() => cursorChars[Math.floor(Math.random() * cursorChars.length)], [cursorChars]);

  const onTextComplete = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % loreTexts.length);
  }, [loreTexts.length]);

  useEffect(() => {
    const currentText = loreTexts[currentIndex];
    const totalDuration = 4000 + currentText.length * 50;
    const typingDuration = totalDuration - 500;
    const startTime = Date.now();

    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < typingDuration) {
        const progress = elapsedTime / typingDuration;
        const revealedChars = Math.floor(progress * currentText.length);
        const newVisibleText = currentText.split('').map((char, index) => {
          if (index < revealedChars) {
            const charProgress = (elapsedTime - (index * (typingDuration / currentText.length))) / (typingDuration / currentText.length);
            if (charProgress < 0.5) {
              return Math.random() > 0.7 ? getRandomChar() : char;
            }
            return char;
          } else if (index === revealedChars) {
            return Math.random() > 0.5 ? getRandomChar() : char;
          } else {
            return '';
          }
        });
        setVisibleText(newVisibleText);
        if (elapsedTime % 250 < 16) {
          setCursor(getRandomCursor());
        }
        setShowCursor(true);
        setIsFading(false);
      } else {
        setVisibleText(currentText.split(''));
        setShowCursor(false);
        if (elapsedTime >= totalDuration) {
          clearInterval(animationInterval);
          setTimeout(() => {
            setIsFading(true);
            onTextComplete();
          }, 1000);
        }
      }
    }, 33);

    return () => clearInterval(animationInterval);
  }, [currentIndex, loreTexts, getRandomChar, getRandomCursor, onTextComplete]);

  if (riveError) {
    return (
      <div style={{ color: 'white', padding: '20px' }}>
        Error loading Rive animation: {riveError.message}
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#14171A',
      color: 'white',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
        <RiveComponent />
      </div>
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '100px',
          cursor: 'pointer',
        }}
        onMouseEnter={() => handlePlayHover(true)}
        onMouseLeave={() => handlePlayHover(false)}
        onClick={handlePlayClick}
      />
      {!isLoaded && (
        <div style={{ 
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '250px', 
          height: '30px', 
          background: '#111',
          border: '2px solid white',
          borderRadius: '10px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          fontSize: '14px',
          fontFamily: 'Monorama, sans-serif',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'white',
            transition: 'width 0.3s ease-out',
            position: 'absolute',
            left: 0,
            top: 0,
          }} />
          <span style={{ 
            position: 'relative', 
            zIndex: 1,
            fontSize: progress === 100 ? '28px' : '24px',
            fontWeight: 'bold',
          }}>{`${Math.round(progress)}%`}</span>
        </div>
      )}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFading ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isFading ? 0.5 : 0.1 }}
          style={{
            position: 'absolute',
            bottom: '2.5vw',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: '600px',
            textAlign: 'center',
            fontFamily: 'Monorama, sans-serif',
            fontSize: '24px',
            color: '#03d7fc',
            opacity: 0.85,
            textShadow: '0 0 10px rgba(0,255,255,0.7)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <p style={{
            margin: 0,
            padding: '8px',
            lineHeight: '1.5',
            cursor: 'default',
          }}>
            {visibleText.join('')}
            {showCursor && (
              <span style={{
                animation: cursor === '_' ? 'caret 1s steps(1) infinite' : 'none',
              }}>{cursor}</span>
            )}
          </p>
        </motion.div>
      </AnimatePresence>
      {isStarted && <TextLore />}
      <style>{`
        @keyframes caret {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RiveLoadingScreen;
