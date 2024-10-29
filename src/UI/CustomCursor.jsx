import { useState, useEffect } from 'react';
import { RxEnterFullScreen } from "react-icons/rx";
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
    100% { filter: hue-rotate(360deg); }
  }
`;

const GradientIcon = styled(RxEnterFullScreen)`
  display: block;
  position: absolute;
  opacity: 0.9;
  color: #03d7fc;
  filter: drop-shadow(0 0 2px #fc0398);
  animation: gradient 8s linear infinite;
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
  animation: gradient 8s linear infinite;
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
      
      <GradientIcon size={58} />
      <CenterDot />
    </CursorWrapper>
  );
} 