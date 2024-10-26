// import React, { useState, useRef, useCallback } from 'react';
// import StartSVG from '/src/assets/images/Start.svg?url';

// const StartButton = ({ isVisible, onStart }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const buttonRef = useRef(null);

//   const handleStart = useCallback(() => {
//     console.log('Start button clicked in StartButton component');
//     if (onStart) {
//       console.log('Calling onStart from StartButton');
//       onStart();
//     }
//   }, [onStart]);

//   if (!isVisible) return null;

//   return (
//     <button
//       ref={buttonRef}
//       onClick={handleStart}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         background: 'none',
//         border: 'none',
//         padding: 0,
//         cursor: 'pointer',
//         width: '150px',
//         height: 'auto',
//         position: 'relative',
//         overflow: 'hidden',
//         transition: 'transform 0.2s ease',
//         transform: isHovered ? 'scale(1.05)' : 'scale(1)',
//       }}
//     >
//       <img 
//         src={StartSVG} 
//         alt="Start" 
//         style={{ 
//           width: '100%', 
//           height: 'auto',
//           position: 'relative',
//           zIndex: 1,
//         }}
//       />
//     </button>
//   );
// };

// export default StartButton;
