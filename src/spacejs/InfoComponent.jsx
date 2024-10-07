import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Info } from './SpaceInfo.js';

const InfoComponent = forwardRef(({ content, bottom = false }, ref) => {
  const infoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!infoRef.current) {
      infoRef.current = new Info({
        bottom,
        content
      });
      document.body.appendChild(infoRef.current.element);
    }

    return () => {
      if (infoRef.current) {
        infoRef.current.destroy();
        infoRef.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    animateIn: (delay) => {
      infoRef.current?.animateIn(delay);
      setIsVisible(true);
    },
    animateOut: (callback) => {
      infoRef.current?.animateOut(() => {
        setIsVisible(false);
        if (callback) callback();
      });
    }
  }));

  // Use the Space.js element for rendering
  useEffect(() => {
    if (infoRef.current) {
      infoRef.current.element.style.display = isVisible ? 'block' : 'none';
    }
  }, [isVisible]);

  return null; // We don't render anything here as Space.js handles the DOM
});

export default InfoComponent;