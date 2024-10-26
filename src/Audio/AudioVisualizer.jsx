import React, { useEffect, useRef, useCallback } from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, IconButton, Slider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import useAudioStore from './audioStore';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10b981",
    }
  }
});

// Add this near the top of your file with other constants
const VISUALIZER_THEME = {
  colors: {
    secondary: '#fc0398',    // Pink
    primary: '#03d7fc',  // Blue
    background: 'rgba(0, 0, 0, 0.05)',
    controlButtons: '#fc0398',
    sliderColor: '#fc0398',
    canvasBackground: 'rgba(0, 0, 0, 0.2)',
  },
  spectrogram: {
    colorStops: [
      { intensity: 0, color: 'rgba(0, 0, 0, 0.2)' },  // Transparent black for lowest intensity
      { intensity: 0.3, color: '#0F4757' },           // Dark blue for low-mid intensity
      { intensity: 0.6, color: '#03d7fc' },           // Blue for mid intensity
      { intensity: 0.8, color: '#fc0398' },           // Pink for high intensity
      { intensity: 1, color: '#E66255' }              // Red-pink for peak intensity
    ],
    saturation: 100,
    lightness: 50,
    alpha: 0.8
  }
};

const AudioPlayerContainer = styled(Box)(({ theme }) => ({
  width: "10rem",
  backgroundColor: VISUALIZER_THEME.colors.background,
  padding: theme.spacing(0.5),
  color: theme.palette.common.white,
  boxShadow: theme.shadows[10],
  backdropFilter: "blur(8px)",
  position: "fixed",
  transition: "opacity 0.3s ease-in-out",
}));

const ControlsContainer = styled(Box)({
  marginTop: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
});

const VolumeContainer = styled(Box)({
  width: "100%",
  padding: "0px 3px",
});

const VisualizerCanvas = styled('canvas')({
  width: '100%',
  height: '80px',
  marginBottom: '2px',
  backgroundColor: VISUALIZER_THEME.colors.canvasBackground,
  borderRadius: '4px',
});

const FrequencyCanvas = styled('canvas')({
  width: '100%',
  height: '60px',
  marginBottom: '8px',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Adjusted alpha
  borderRadius: '4px',
});

const SpectrogramCanvas = styled('canvas')({
  width: '100%',
  height: '60px',
  marginBottom: '8px',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '4px',
});

class Spectrogram {
  constructor(canvas, fftSize = 64) { // Reduced from 128 to 64
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fftSize = fftSize;
    this.data = new Array(100).fill(new Uint8Array(fftSize)); // Reduced history length
    this.pointer = 0;
    this.colorCache = this.createColorCache(); // Pre-calculate colors
  }

  createColorCache() {
    const cache = new Array(256); // Cache for all possible values (0-255)
    for (let i = 0; i < 256; i++) {
      const intensity = i / 255;
      if (intensity < 0.3) cache[i] = 'rgba(0, 0, 0, 0.2)';
      else if (intensity < 0.6) cache[i] = '#0F4757';
      else if (intensity < 0.8) cache[i] = '#03d7fc';
      else if (intensity < 0.9) cache[i] = '#fc0398';
      else cache[i] = '#E66255';
    }
    return cache;
  }

  draw(dataArray) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    this.data[this.pointer] = new Uint8Array(dataArray);
    this.pointer = (this.pointer + 1) % this.data.length;

    const sliceWidth = width / this.fftSize;
    const timeHeight = height / this.data.length;

    // Draw less frequently for performance
    for (let t = 0; t < this.data.length; t += 2) { // Skip every other row
      const timeIndex = (this.pointer - t + this.data.length) % this.data.length;
      const slice = this.data[timeIndex];
      
      if (!slice) continue;

      for (let f = 0; f < this.fftSize; f += 2) { // Skip every other column
        const value = slice[f];
        const intensity = value / 255;
        
        ctx.fillStyle = this.colorCache[value];
        
        const x = f * sliceWidth;
        const y = t * timeHeight;
        
        ctx.fillRect(
          x, 
          y + (intensity * timeHeight * 0.3),
          sliceWidth * 2 - 1, // Wider to compensate for skipping
          timeHeight * 2      // Taller to compensate for skipping
        );
      }
    }
  }
}

const AudioVisualizer = ({ width = "18rem", position = { top: "20px", left: "20px" } }) => {
  const waveformRef = useRef(null);  // Renamed from canvasRef
  const frequencyRef = useRef(null);  // New ref for frequency canvas
  const waveformAnimationRef = useRef(null);
  const frequencyAnimationRef = useRef(null);
  const spectrogramRef = useRef(null);
  const spectrogramAnimationRef = useRef(null);

  const { 
    isPlaying, 
    volume, 
    isInitialized,
    analyser,
    setVolume,
    nextTrack,
    previousTrack,
    togglePlay,
    playAudio,
    pauseAudio,
  } = useAudioStore();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case '1':
          previousTrack();
          break;
        case '2':
          nextTrack();
          break;
        case '3':
          if (isPlaying) {
            pauseAudio();
          } else {
            playAudio();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, previousTrack, nextTrack, playAudio, pauseAudio]);

  // Waveform visualization effect
  useEffect(() => {
    if (!waveformRef.current || !isInitialized || !analyser) return;

    const canvas = waveformRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = () => {
      if (!waveformRef.current) return;

      analyser.getByteTimeDomainData(dataArray);

      // First clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Then apply transparent background (if needed)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Black background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = VISUALIZER_THEME.colors.primary;
      ctx.beginPath();

      // Optimize by using a smaller buffer length
      const skipPoints = 8; // Reduced from 16 for more detail
      const sliceWidth = canvas.width / (bufferLength / skipPoints);
      let x = 0;

      // Draw more complex waveform
      for (let i = 0; i < bufferLength; i += skipPoints) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        // Enhanced wave effect
        const amplitude = 4.5; // Adjust for more/less dramatic effect
        const boostedY = (canvas.height / 2) + ((y - canvas.height / 2) * amplitude);

        if (i === 0) {
          ctx.moveTo(x, boostedY);
        } else {
          // Add curve instead of straight lines
          ctx.quadraticCurveTo(x - sliceWidth / 2, boostedY, x, boostedY);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      waveformAnimationRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (waveformAnimationRef.current) {
        cancelAnimationFrame(waveformAnimationRef.current);
        waveformAnimationRef.current = null;
      }
    };
  }, [isInitialized, analyser]);

  // Frequency visualization effect
  useEffect(() => {
    if (!frequencyRef.current || !isInitialized || !analyser) return;

    const canvas = frequencyRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawFrequency = () => {
      if (!frequencyRef.current) return;

      analyser.getByteFrequencyData(dataArray);

      // Clear the canvas completely first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Then apply the transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / 64;
      let x = 0;

      // Create gradients
      const createGradient = (ctx, height) => {
        const gradient = ctx.createLinearGradient(0, canvas.height - height, 0, canvas.height);
        gradient.addColorStop(1, '#fc0398');  // Pink
        gradient.addColorStop(0, '#03d7fc');  // Blue
        return gradient;
      };

      // Draw frequency bars
      for (let i = 0; i < 64; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Create gradient for bars with full opacity
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(1, '#fc0398');  // Full opacity pink
        gradient.addColorStop(0, '#03d7fc');  // Full opacity blue
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth * 0.8, barHeight);  // 0.8 for gap between bars
        
        x += barWidth;
      }

      frequencyAnimationRef.current = requestAnimationFrame(drawFrequency);
    };

    drawFrequency();

    return () => {
      if (frequencyAnimationRef.current) {
        cancelAnimationFrame(frequencyAnimationRef.current);
        frequencyAnimationRef.current = null;
      }
    };
  }, [isInitialized, analyser]);

  // Handle volume change
  const handleVolumeChange = useCallback((_, newValue) => {
    setVolume(newValue);
  }, [setVolume]);

  // Add new effect for spectrogram visualization
  useEffect(() => {
    if (!spectrogramRef.current || !isInitialized || !analyser) return;

    const canvas = spectrogramRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const spectrogram = new Spectrogram(canvas);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawSpectrogram = () => {
      if (!spectrogramRef.current) return;

      analyser.getByteFrequencyData(dataArray);
      spectrogram.draw(dataArray);

      spectrogramAnimationRef.current = requestAnimationFrame(drawSpectrogram);
    };

    drawSpectrogram();

    return () => {
      if (spectrogramAnimationRef.current) {
        cancelAnimationFrame(spectrogramAnimationRef.current);
        spectrogramAnimationRef.current = null;
      }
    };
  }, [isInitialized, analyser]);

  return (
    <ThemeProvider theme={theme}>
      <AudioPlayerContainer style={{ width, ...position }}>
        <VisualizerCanvas ref={waveformRef} />
        <SpectrogramCanvas ref={spectrogramRef} />
        <FrequencyCanvas ref={frequencyRef} />
        <ControlsContainer>
          <IconButton 
            onClick={previousTrack} 
            sx={{ 
              opacity: 0.95, 
              color: VISUALIZER_THEME.colors.controlButtons,
              padding: "4px",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              '&:active': {
                backgroundColor: 'rgba(0, 0, 0, 1)',
              },
            }}
          >
            <SkipPreviousIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={isPlaying ? pauseAudio : playAudio}
            sx={{ 
              opacity: 0.75, 
              color: VISUALIZER_THEME.colors.controlButtons,
              padding: "4px",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              '&:active': {
                backgroundColor: 'rgba(0, 0, 0, 1)',
              },
            }}
          >
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
          <IconButton 
            onClick={nextTrack}
            sx={{ 
              opacity: 0.95, 
              color: VISUALIZER_THEME.colors.controlButtons,
              padding: "4px",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              '&:active': {
                backgroundColor: 'rgba(0, 0, 0, 1)',
              },
            }}
          >
            <SkipNextIcon fontSize="large" />
          </IconButton>
        </ControlsContainer>
        <VolumeContainer>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
            min={0}
            max={100}
            step={1}
            sx={{ 
              color: VISUALIZER_THEME.colors.sliderColor,
              opacity: 0.75,
              padding: '1px 0',
              height: '3px',
              top: '0.5vw',
              '& .MuiSlider-thumb': {
                width: 2,
                height: 2,
                boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.8)',
                transition: 'box-shadow 0.1s ease-in-out',
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
              },
            }}
          />
        </VolumeContainer>
      </AudioPlayerContainer>
    </ThemeProvider>
  );
};

export default AudioVisualizer;
