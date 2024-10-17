import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { styled, ThemeProvider, createTheme } from "@mui/material/styles"
import { Box, IconButton, Slider } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious"
import SkipNextIcon from "@mui/icons-material/SkipNext"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"

// Import audio files
import candiesExploration from '/src/assets/audio/Candies_Exploration.mp3?url'
import floralMechas from '/src/assets/audio/Floral_Mechas.mp3?url'
import dubtech from '/src/assets/audio/AI12v3.mp3?url'
import lofiFields from '/src/assets/audio/Lowfi_Fileds.mp3?url'
import suddenAmbush from '/src/assets/audio/AI5.1.mp3?url'
import swampyCreatures from '/src/assets/audio/AI6.mp3?url'
import morphings from '/src/assets/audio/Morphings.mp3?url'

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10b981",
    },
    background: {
      default: "#15171A",
      paper: "#15171A",
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "black",
        },
        thumb: {
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)",
          },
          "&.Mui-active": {
            boxShadow: "0px 0px 0px 14px rgba(0, 0, 0, 0.16)",
          },
        },
      },
    },
  },
})

const AudioPlayerContainer = styled(Box)(({ theme }) => ({
  width: "10rem",
  backgroundColor: "rgba(55, 65, 81, 0.0)",
  padding: theme.spacing(1),
  color: theme.palette.common.white,
  boxShadow: theme.shadows[10],
  backdropFilter: "blur(8px)",
  position: "fixed",
  top: "20px",
  left: "20px",
  transition: "opacity 0.3s ease-in-out",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    opacity: 0.2,
    mixBlendMode: "overlay",
    pointerEvents: "none",
    borderRadius: "inherit",
  },
  zIndex: 2000,
  pointerEvents: 'auto',
  opacity: 1,
}))

const CanvasContainer = styled(Box)({
  marginBottom: "0.2rem",
  position: "relative",
})

const StyledCanvas = styled("canvas")({
  width: "100%",
  height: "3.2rem",
  backgroundColor: "rgba(21, 23, 26, 0.4)",
  borderRadius: "0.25rem",
  border: "1px solid rgba(107, 114, 128, 0.3)",
})

const ControlsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "0.5rem",
})

const VolumeContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
})

const playlist = [
  { title: "Candies Exploration", src: candiesExploration },
  { title: "Floral Mechas", src: floralMechas },
  { title: "Dubtech", src: dubtech },
  { title: "Lofi Fields", src: lofiFields },
  { title: "Sudden Ambush", src: suddenAmbush },
  { title: "Swampy Creatures", src: swampyCreatures },
  { title: "Morphings", src: morphings },
]

const RetroGraphiteMUIAudioPlayer = forwardRef(({ width = "18rem", position = { top: "20px", left: "20px" } }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(20)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(playlist[0]);
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const animationRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)
  const gainNodeRef = useRef(null)
  const sourceRef = useRef(null)

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handlePlayPause: () => {
      if (!isInitialized) {
        initializeAudio();
      }
      setIsPlaying(prev => !prev);
    },
    initializeAudio,
    setTrack: (index) => setCurrentTrackIndex(index),
    setIsPlaying,
    playAudio: () => {
      if (audioRef.current && isInitialized) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    },
  }));

  useEffect(() => {
    setCurrentTrack(playlist[currentTrackIndex]);
  }, [currentTrackIndex]);

  const initializeAudio = useCallback(() => {
    if (!isInitialized && audioRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      gainNodeRef.current = audioContextRef.current.createGain();
      
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      analyserRef.current.fftSize = 2048;
      
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioContextRef.current.currentTime);
      
      setIsInitialized(true);
    }
  }, [isInitialized, volume]);

  const playAudio = useCallback(() => {
    if (audioRef.current && isInitialized) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [isInitialized])

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  useEffect(() => {
    if (isInitialized) {
      if (isPlaying) {
        playAudio()
      } else {
        pauseAudio()
      }
    }
  }, [isPlaying, isInitialized, playAudio, pauseAudio])

  const handlePrevious = useCallback(() => {
    if (!isInitialized) {
      initializeAudio()
    }
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }, [isInitialized, initializeAudio])

  const handleNext = useCallback(() => {
    if (!isInitialized) {
      initializeAudio()
    }
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length)
    setIsPlaying(true)
  }, [isInitialized, initializeAudio])

  useEffect(() => {
    if (isInitialized && isPlaying) {
      playAudio()
    }
  }, [currentTrackIndex, isInitialized, isPlaying, playAudio])

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioContextRef.current.currentTime)
    }
  }, [volume])

  useEffect(() => {
    if (!isInitialized || !isPlaying || !canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const drawWaveform = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, width, height)

      analyserRef.current.getByteTimeDomainData(dataArray)

      ctx.lineWidth = 2
      ctx.strokeStyle = "white"
      ctx.beginPath()

      const sliceWidth = (width * 1.75) / bufferLength
      let x = 0

      const amplitudeBoost = 2.5

      for (let i = 0; i < bufferLength; i += 8) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2
        const boostedY = (height / 2) + ((y - height / 2) * amplitudeBoost * 0.5)

        if (i === 0) {
          ctx.moveTo(x, boostedY)
        } else {
          ctx.lineTo(x, boostedY)
        }

        x += sliceWidth * 4
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    const animate = () => {
      drawWaveform()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isInitialized])

  const handleVolumeChange = useCallback((event, newValue) => {
    setVolume(newValue)
  }, [])

  const handleCanvasClick = useCallback((e) => {
    e.stopPropagation()
  }, [])

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case '1':
          handlePrevious();
          break;
        case '2':
          handleNext();
          break;
        case '3':
          setIsPlaying(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrevious, handleNext]);

  return (
    <ThemeProvider theme={theme}>
      <AudioPlayerContainer
        sx={{
          height: "4rem",
          width: width,
          position: "absolute",
          ...position,
        }}
        className="audio-player"
      >
        <CanvasContainer onClick={handleCanvasClick}>
          <StyledCanvas ref={canvasRef} width={256} height={50} />
        </CanvasContainer>
        <ControlsContainer 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0rem',
            marginTop: '0.7rem', 
            marginBottom: '0rem',
          }}
        >
          <IconButton onClick={handlePrevious} size="small" sx={{ opacity: 0.75, color: "white", padding: "4px" }}>
            <SkipPreviousIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => {
              if (!isInitialized) {
                initializeAudio();
              }
              setIsPlaying(prev => !prev);
            }}
            size="large"
            sx={{ opacity: 0.75, color: "white", padding: "4px" }}
          >
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
          <IconButton onClick={handleNext} size="large" sx={{ opacity: 0.75, size: "4rem", color: "white", padding: "4px" }}>
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
              color: "white",
              opacity: 0.75,
              padding: '5px 0',
              height: '3px',
              top: '0.5vw',
              '& .MuiSlider-thumb': {
                width: 2,
                height: 2,
                boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.1s ease-in-out',
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
              },
            }}
          />
        </VolumeContainer>
        <audio
          ref={audioRef}
          src={playlist[currentTrackIndex].src}
          onEnded={handleNext}
          preload="auto"
        />
      </AudioPlayerContainer>
    </ThemeProvider>
  )
})

export default RetroGraphiteMUIAudioPlayer
