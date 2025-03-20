import React, { useContext, useRef, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';

const AudioPlayer = () => {
  const { currentTrack, isPlaying, volume, pauseTrack } = useContext(PlayerContext);
  const audioRef = useRef(null);

  // Actualiza el volumen y controla la reproducción cuando cambian el estado o la pista actual
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying && currentTrack) {
        audioRef.current.play().catch(error => console.error("Error al reproducir:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, volume]);

  if (!currentTrack) {
    return <p>No hay pista seleccionada</p>;
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={currentTrack.url} controls />
      <button onClick={pauseTrack}>Pausar</button>
    </div>
  );
};

export default AudioPlayer;