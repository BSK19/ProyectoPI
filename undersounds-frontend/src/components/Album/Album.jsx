import React from 'react';
import PropTypes from 'prop-types';

const Album = ({ album }) => {
    return (
        <div className="album">
            <img src={album.coverImage} alt={`${album.title} cover`} className="album-cover" />
            <h2 className="album-title">{album.title}</h2>
            <h3 className="album-artist">{album.artist}</h3>
            <p className="album-release-year">{album.releaseYear}</p>
            <p className="album-genre">{album.genre}</p>
            <p className="album-price">${album.price}</p>
            <h4>Track List:</h4>
            <ul className="track-list">
                {album.tracks.map((track, index) => (
                    <li key={index} className="track-item">
                        {track.title} - {track.duration}
                    </li>
                ))}
            </ul>
        </div>
    );
};

Album.propTypes = {
    album: PropTypes.shape({
        coverImage: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        releaseYear: PropTypes.number.isRequired,
        genre: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        tracks: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                duration: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
};

export default Album;