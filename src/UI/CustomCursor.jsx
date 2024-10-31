import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ApiIcon from '../assets/icons/api.svg?react'

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
  width: 48px;
  height: 48px;
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
  width: 48px;
  height: 48px;
  
  path {
    fill: currentColor;
  }
`;

const CenterDot = styled.div`
  position: absolute;
  top: 45%;
  left: 45%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 2px;
  background: linear-gradient(45deg, #03d7fc, #fc0398);
  border-radius: 50%;
  mix-blend-mode: exclusion;
  z-index: 9999;
  animation: gradient 8s alternate infinite;
  pointer-events: none;
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
      <CustomIcon width="48" height="48">
        <ApiIcon width="85%" height="85%" />
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#03d7fc" />
              <stop offset="100%" stopColor="#fc0398" />
            </linearGradient>
          </defs>
      </CustomIcon>
      {/* <CenterDot /> */}
    </CursorWrapper>
  );
} 