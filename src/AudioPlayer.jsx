import React, { useState, useEffect, useRef } from "react"
import { styled, ThemeProvider, createTheme } from "@mui/material/styles"
import { Box, IconButton, Slider } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious"
import SkipNextIcon from "@mui/icons-material/SkipNext"
import StopIcon from "@mui/icons-material/Stop"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"

// Import audio files
import candiesExploration from '/src/assets/audio/Candies_Exploration.mp3?url'
import floralMechas from '/src/assets/audio/Floral_Mechas.mp3?url'
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
      default: "black", //#1f2937
      paper: "black", //374151
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
  width: "9rem",
  backgroundColor: "rgba(55, 65, 81, 0.3)",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  color: theme.palette.common.white,
  boxShadow: theme.shadows[10],
  border: "1px solid rgba(107, 114, 128, 0.3)",
  backdropFilter: "blur(8px)",
  position: "fixed",
  bottom: "20px",
  left: "20px",
  transition: "opacity 0.3s ease-in-out",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='33' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.2,
    mixBlendMode: "overlay",
    pointerEvents: "none",
    borderRadius: "inherit",
    // border: "1px solid red",
  },
  zIndex: 2000,
  pointerEvents: 'auto',
  opacity: 1,
}))

const CanvasContainer = styled(Box)({
  marginBottom: "0.5rem",
  position: "relative",
})

const StyledCanvas = styled("canvas")({
  width: "100%",
  height: "1.5rem",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
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
  { title: "Lofi Fields", src: lofiFields },
  { title: "Sudden Ambush", src: suddenAmbush },
  { title: "Swampy Creatures", src: swampyCreatures },
  { title: "Morphings", src: morphings },
]

export default function RetroGraphiteMUIAudioPlayer({ width = "9rem", position = { bottom: "20px", left: "20px" } }) {  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(20)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const canvasRef = useRef(null)
  const titleCanvasRef = useRef(null)
  const audioRef = useRef(null)
  const animationRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume / 100
    audio.loop = true

    const handleError = (e) => {
      console.error("Audio error:", e)
    }

    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("error", handleError)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isInitialized) return

    audio.volume = volume / 100
    
    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Error playing audio:", e)
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, volume, currentTrackIndex, isInitialized])

  useEffect(() => {
    if (!isInitialized) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    const drawWaveform = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, width, height)

      if (!analyserRef.current) return

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      analyserRef.current.getByteTimeDomainData(dataArray)

      ctx.lineWidth = 2
      ctx.strokeStyle = "#FFA500" // Orange color
      ctx.beginPath()

      const sliceWidth = (width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i += 4) { // Increased step for pixelation
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth * 4 // Increased step for pixelation
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    const animate = () => {
      drawWaveform()
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying && analyserRef.current) {
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isInitialized])

  useEffect(() => {
    const canvas = titleCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#FFA500" // Orange color
    ctx.font = '11px "Press Start 2P", monospace'
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(playlist[currentTrackIndex].title, width / 2, height / 2)

    ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
    for (let i = 0; i < height; i += 2) {
      ctx.fillRect(0, i, width, 1)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    const initializeAudio = () => {
      if (!isInitialized) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaElementSource(audioRef.current)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
        setIsInitialized(true)
        setIsPlaying(true)
      }
    }

    const handleFirstInteraction = () => {
      initializeAudio()
      document.removeEventListener('click', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
    }
  }, [isInitialized])

  const handlePlayPause = () => {
    if (isInitialized) {
      setIsPlaying(!isPlaying)
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio || !isInitialized) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }

  const handlePrevious = () => {
    if (!isInitialized) return
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length)
    if (!isPlaying) {
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    if (!isInitialized) return
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length)
    if (!isPlaying) {
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue)
  }

  const nextTrack = () => {
    if (audioRef.current) {
      // Pause the current audio
      audioRef.current.pause();

      // Set the new source
      audioRef.current.src = newTrackUrl;

      // Load the new audio
      audioRef.current.load();

      // Play the new audio
      audioRef.current
        .play()
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }

    // ... any additional logic ...
  };

  return (
    
        <ThemeProvider theme={theme}>
          <AudioPlayerContainer
            sx={{
              width: width,
              position: "absolute",
              ...position,
            }}
            className="audio-player"
          >
        <CanvasContainer>
          <StyledCanvas
            ref={titleCanvasRef}
            width={128}
            height={24}
            style={{ marginBottom: "0.25rem" }}
          />
          <StyledCanvas ref={canvasRef} width={128} height={32} />
        </CanvasContainer>
        <ControlsContainer>
          <IconButton onClick={handlePrevious} size="small" sx={{ color: "black", padding: "4px" }}>
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handlePlayPause} size="small" sx={{ color: "black", padding: "4px" }}>
            {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
          <IconButton onClick={handleStop} size="small" sx={{ color: "black", padding: "4px" }}>
            <StopIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleNext} size="small" sx={{ color: "black", padding: "4px" }}>
            <SkipNextIcon fontSize="small" />
          </IconButton>
        </ControlsContainer>
        <VolumeContainer>
          <VolumeUpIcon sx={{ marginRight: 1, color: "black", fontSize: "1rem" }} />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
            min={0}
            max={100}
            step={1}
            sx={{ 
              color: "black",
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
              '& .MuiSlider-rail': {
                opacity: 0.5,
              },
            }}
          />
        </VolumeContainer>
        <audio
          ref={audioRef}
          src={playlist[currentTrackIndex].src}
          loop={true}
        />
      </AudioPlayerContainer>
    </ThemeProvider>
  )
}