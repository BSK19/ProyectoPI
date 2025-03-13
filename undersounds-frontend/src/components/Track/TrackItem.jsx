import React from 'react';
import PropTypes from 'prop-types';

const TrackItem = ({ track, onPlay }) => {
    return (
        <div className="track-item">
            <div className="track-info">
                <h3 className="track-title">{track.title}</h3>
                <p className="track-artist">{track.artist}</p>
                <p className="track-duration">{track.duration}</p>
            </div>
            <button className="play-button" onClick={() => onPlay(track)}>
                Play
            </button>
        </div>
    );
};

TrackItem.propTypes = {
    track: PropTypes.shape({
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
    }).isRequired,
    onPlay: PropTypes.func.isRequired,
};

export default TrackItem;