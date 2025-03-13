import React, { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../context/PlayerContext';

const AudioPlayer = () => {
    const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = useContext(PlayerContext);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrack]);

    return (
        <div className="audio-player">
            {currentTrack && (
                <>
                    <h3>{currentTrack.title}</h3>
                    <audio ref={audioRef} src={currentTrack.audioUrl} />
                    <div className="controls">
                        <button onClick={prevTrack}>Previous</button>
                        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
                        <button onClick={nextTrack}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AudioPlayer;