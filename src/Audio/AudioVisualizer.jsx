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

const AudioPlayerContainer = styled(Box)(({ theme }) => ({
  width: "10rem",
  backgroundColor: "rgba(55, 65, 81, 0.0)",
  padding: theme.spacing(0.5),
  color: theme.palette.common.white,
  boxShadow: theme.shadows[10],
  backdropFilter: "blur(8px)",
  position: "fixed",
  transition: "opacity 0.3s ease-in-out",
}));

const ControlsContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
});

const VolumeContainer = styled(Box)({
  width: "100%",
  padding: "0 8px",
});

const VisualizerCanvas = styled('canvas')({
  width: '100%',
  height: '50px',
  marginBottom: '8px',
});

const AudioVisualizer = ({ width = "18rem", position = { top: "20px", left: "20px" } }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

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

  // Visualization effect
  useEffect(() => {
    if (!canvasRef.current || !isInitialized || !analyser) return;

    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = () => {
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#03d7fc";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.75) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i += 8) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        const boostedY = (canvas.height / 2) + ((y - canvas.height / 2) * 3.5 * 0.5);

        if (i === 0) {
          ctx.moveTo(x, boostedY);
        } else {
          ctx.lineTo(x, boostedY);
        }

        x += sliceWidth * 4;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    const animate = () => {
      drawWaveform();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, analyser]);

  // Handle volume change
  const handleVolumeChange = useCallback((_, newValue) => {
    setVolume(newValue);
  }, [setVolume]);

  return (
    <ThemeProvider theme={theme}>
      <AudioPlayerContainer style={{ width, ...position }}>
        <VisualizerCanvas ref={canvasRef} />
        <ControlsContainer>
          <IconButton 
            onClick={previousTrack} 
            sx={{ 
              opacity: 0.95, 
              color: "#fc0398",
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
              color: "#fc0398",
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
              color: "#fc0398",
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
              color: "#fc0398",
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
