// src/utils/audioUtils.js

/**
 * Creates and configures a new AudioContext
 */
export const createAudioContext = () => {
    return new (window.AudioContext || window.webkitAudioContext)();
  };
  
  /**
   * Configures audio nodes for visualization and processing
   */
  export const createAudioNodes = (audioContext, volume = 75) => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
  
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume / 100;
  
    analyser.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    return { analyser, gainNode };
  };
  
  /**
   * Safely disconnects and cleans up audio nodes
   */
  export const disconnectNodes = (nodes = new Map()) => {
    nodes.forEach((node) => {
      try {
        node.disconnect();
      } catch (error) {
        console.warn('Error disconnecting node:', error);
      }
    });
    return new Map();
  };
  
  /**
   * Gets analyser data for visualization
   */
  export const getAnalyserData = (analyser) => {
    if (!analyser) return null;
  
    try {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);
      return dataArray;
    } catch (error) {
      console.error('Error getting analyser data:', error);
      return null;
    }
  };