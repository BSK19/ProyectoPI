import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // Volume range from 0 to 1

    const playTrack = (track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    const stopTrack = () => {
        setCurrentTrack(null);
        setIsPlaying(false);
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            volume,
            playTrack,
            pauseTrack,
            stopTrack,
            changeVolume
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    return useContext(PlayerContext);
};

export { PlayerContext };