import React, { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';

const AudioPlayer = () => {
    const { currentTrack, isPlaying, volume, playTrack, pauseTrack, stopTrack, changeVolume } = useContext(PlayerContext);
    const audioRef = useRef(null);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying) {
                audioElement.play().catch(error => console.error('Error playing audio:', error));
            } else {
                audioElement.pause();
            }
        }

        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
            }
        };
    }, [isPlaying, currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume; // Actualiza el volumen del audio
        }
    }, [volume]);

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        changeVolume(newVolume);
    };

    const handleAudioError = (e) => {
        console.error('Audio error:', e);
    };

    const handleAudioLoaded = () => {
        console.log('Audio loaded:', audioRef.current.src);
    };

    const handleAudioPlay = () => {
        console.log('Audio playing');
    };

    const handleAudioPause = () => {
        console.log('Audio paused');
    };

    return (
        <div className="audio-player">
            {currentTrack && (
                <>
                    <h3>{currentTrack.title}</h3>
                    <audio
                        ref={audioRef}
                        src={currentTrack.audioUrl}
                        onError={handleAudioError}
                        onLoadedData={handleAudioLoaded}
                        onPlay={handleAudioPlay}
                        onPause={handleAudioPause}
                    />
                    <div className="controls">
                        <button onClick={stopTrack}>Stop</button>
                        <button onClick={isPlaying ? pauseTrack : () => playTrack(currentTrack)}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AudioPlayer;