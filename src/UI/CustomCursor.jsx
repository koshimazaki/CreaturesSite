import { useState, useEffect } from 'react';
import styled from 'styled-components';



const CursorWrapper = styled.div.attrs(props => ({
  style: {
    transform: `translate(${props.$x}px, ${props.$y}px) translate(-50%, -50%) 
      scale(${props.$isHovering ? 0.6 : 1}) 
      scale(${props.$isClicked ? 0.8 : 1}) 
      ${props.$isClicked ? 'rotate(45deg)' : ''}`,
  },
}))`
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: exclusion;
  width: 58px;
  height: 58px;
  will-change: transform;
  transition: transform 0.1s ease-out;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes gradient {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(180deg); }
  }
`;

const CustomIcon = styled.svg`
  display: block;
  position: absolute;
  opacity: 0.9;
  color: #03d7fc;
  filter: drop-shadow(0 0 2px #fc0398);
  animation: gradient 12s alternate infinite;
  
  path {
    fill: currentColor;
  }
`;

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #03d7fc, #fc0398);
  border-radius: 50%;
  mix-blend-mode: exclusion;
  z-index: 2;
  animation: gradient 8s alternate infinite;
`;

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let frame;

    const onMouseMove = (e) => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      
      frame = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleHover = (e) => {
      const isClickable = e.target.matches('a, button, [role="button"], input, select, textarea, .interactive');
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleHover);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <CursorWrapper 
      $x={position.x}
      $y={position.y}
      $isClicked={isClicked}
      $isHovering={isHovering}
    >
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#03d7fc" />
            <stop offset="100%" stopColor="#fc0398" />
            {/* <stop offset="100%" stopColor="#E66255" /> */}
          </linearGradient>
        </defs>
      </svg>
      
      <CustomIcon width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_709_41)">
          <path d="M14 12L12 14L10 12L12 10L14 12ZM12 6L14.12 8.12L16.62 5.62L12 1L7.38 5.62L9.88 8.12L12 6ZM6 12L8.12 9.88L5.62 7.38L1 12L5.62 16.62L8.12 14.12L6 12ZM18 12L15.88 14.12L18.38 16.62L23 12L18.38 7.38L15.88 9.88L18 12ZM12 18L9.88 15.88L7.38 18.38L12 23L16.62 18.38L14.12 15.88L12 18Z" />
        </g>
        <defs>
          <clipPath id="clip0_709_41">
            <rect width="48" height="48" fill="white"/>
          </clipPath>
        </defs>
      </CustomIcon>
      <CenterDot />
    </CursorWrapper>
  );
} 