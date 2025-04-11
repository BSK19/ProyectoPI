import React, { useEffect, useRef, useContext, useState } from 'react';
import { Box, Slider, IconButton, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import { PlayerContext } from '../../context/PlayerContext';

const AudioPlayer = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, stopTrack, volume, changeVolume } = useContext(PlayerContext);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad
  const audioRef = useRef(new Audio());
  const location = useLocation();

  // Detener la reproducción y limpiar el track si no estamos en la ruta /album
  useEffect(() => {
    if (!location.pathname.startsWith('/album')) {
      stopTrack();
      audioRef.current.pause();
      setProgress(0);
    }
  }, [location.pathname, stopTrack]);

  // Actualizar la fuente del audio al cambiar la pista
  useEffect(() => {
    if (currentTrack && currentTrack.url) {
      audioRef.current.src = currentTrack.url;
      setProgress(0);
    }
  }, [currentTrack]);

  // Restaurar la visibilidad del reproductor cuando se cambie la pista
  useEffect(() => {
    if (currentTrack) {
      setIsVisible(true);
    }
  }, [currentTrack]);

  // Actualizar el volumen sin reiniciar la reproducción
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Reproducir o pausar según isPlaying
  useEffect(() => {
    if (currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error(err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Actualizar el progreso del audio cada 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setProgress(audioRef.current.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSliderChange = (e, newValue) => {
    audioRef.current.currentTime = newValue;
    setProgress(newValue);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack(currentTrack);
    }
  };

  // Usamos la lista de pistas enviada en currentTrack.tracklist, si existe, o fallback a tracksData
  const trackList = currentTrack?.tracklist || [];
  const handleSkipNext = () => {
    if (!currentTrack) return;
    const currentIndex = trackList.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < trackList.length - 1) {
      const nextTrack = trackList[currentIndex + 1];
      playTrack({
        ...nextTrack,
        title: nextTrack.title || nextTrack.name,
        coverImage: nextTrack.coverImage || currentTrack.coverImage || '/assets/images/default-cover.jpg',
        tracklist: trackList
      });
    } else {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };
  
  const handleSkipPrevious = () => {
    if (!currentTrack) return;
    const currentIndex = trackList.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = trackList[currentIndex - 1];
      playTrack({
        ...prevTrack,
        title: prevTrack.title || prevTrack.name,
        coverImage: prevTrack.coverImage || currentTrack.coverImage || '/assets/images/default-cover.jpg',
        tracklist: trackList
      });
    } else {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const handleCancel = () => {
    pauseTrack();
    setIsVisible(false);
  };

  // Mostrar el reproductor solo si estamos en la ruta /album, hay una pista y es visible
  const inReproduction = location.pathname.startsWith('/album');
  const shouldShow = inReproduction && currentTrack && isVisible;

  return (
    <Box
      sx={{
        display: shouldShow ? 'flex' : 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '90px',
        backgroundColor: '#282828',
        color: 'white',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 1000,
      }}
    >
      {/* Izquierda: Información de la pista (imagen, título y artista) */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
        <img
          src={currentTrack?.coverImage || '/assets/images/default-cover.jpg'}
          alt={currentTrack?.title}
          style={{ height: '60px', width: '60px', marginRight: '15px' }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {currentTrack?.title}
          </Typography>
          <Typography variant="caption">
            {currentTrack?.artist}
          </Typography>
        </Box>
      </Box>

      {/* Centro: Controles y slider de progreso */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: 'white' }} onClick={handleSkipPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }} onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
          <IconButton sx={{ color: 'white' }} onClick={handleSkipNext}>
            <SkipNextIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="caption">{formatTime(progress)}</Typography>
          <Slider
            min={0}
            max={audioRef.current.duration || 0}
            value={progress}
            onChange={handleSliderChange}
            sx={{ color: 'white', mx: 2 }}
          />
          <Typography variant="caption">{formatTime(audioRef.current.duration || 0)}</Typography>
        </Box>
      </Box>

      {/* Derecha: Control de volumen y botón de cancelar */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'flex-end' }}>
        <VolumeUpIcon />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e, newValue) => changeVolume(newValue)}
          sx={{ width: '80px', color: 'white', ml: 1, mr: 2 }}
        />
        <IconButton sx={{ color: 'white' }} onClick={handleCancel}>
          <CancelIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AudioPlayer;