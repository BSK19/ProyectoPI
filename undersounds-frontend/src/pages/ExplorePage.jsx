import React, { useEffect, useState } from 'react';
import { Grid, TextField, Tabs, Tab, Typography } from '@mui/material';
import { fetchAlbums, fetchArtists, fetchTracks } from '../services/musicService';
import '../styles/explorepage.css';

//FALTA ARREGLAR EL CSS y LA DISTRIBUCIÓN DE LOS ELEMENTOS
const ExplorePage = () => {
  // Estados para los datos
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  // Estados para la búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      const albumsData = await fetchAlbums();
      const artistsData = await fetchArtists();
      const tracksData = await fetchTracks();
      setAlbums(albumsData);
      setArtists(artistsData);
      setTracks(tracksData);
    };
    loadData();
  }, []);

  // Funciones de filtrado
  const getFilteredAlbums = () =>
    albums.filter(album =>
      album.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const getFilteredArtists = () =>
    artists.filter(artist =>
      artist.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const getFilteredTracks = () =>
    tracks.filter(track =>
      track.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Función para obtener el año de lanzamiento del álbum
  const getReleaseYear = (releaseDate) => {
    return releaseDate ? new Date(releaseDate).getFullYear() : '';
  };

  let filteredContent = null;
  if (filter === 'all') {
    filteredContent = (
      <>
        <div className="filtered-section">
          <Grid container direction="column" spacing={2}>
            {getFilteredAlbums().map((album) => (
              <Grid item key={album.id} className="item-container">
                <div className="album-item">
                  <div className="album-image-container">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="album-image"
                    />
                  </div>
                  <div className="album-details">
                    <Typography variant="caption" display="block">Album</Typography>
                    <Typography variant="h6" className="album-title">{album.title}</Typography>
                    <Typography variant="body1" className="album-artist">{album.artist}</Typography>
                    <Typography variant="body2" className="album-info">
                      {album.releaseDate} {album.tracks && ' | '} {album.genre}
                    </Typography>
                  </div>
                </div>
              </Grid>
            ))}
            {getFilteredAlbums().length === 0 && (
              <Grid item>
                <div className="no-results">No albums found</div>
              </Grid>
            )}
          </Grid>
        </div>
        <div className="filtered-section">
          <Grid container direction="column" spacing={2}>
            {getFilteredArtists().map((artist) => (
              <Grid item key={artist.id} className="item-container">
                <div className="artist-item">
                  <div className="artist-image-container">
                    <img
                      src={artist.profileImage}
                      alt={artist.name}
                      className="artist-image"
                    />
                  </div>
                  <div className="artist-details">
                    <Typography variant="h6" className="artist-name">{artist.name}</Typography>
                    <Typography variant="body2" className="artist-genre">{artist.genre}</Typography>
                  </div>
                </div>
              </Grid>
            ))}
            {getFilteredArtists().length === 0 && (
              <Grid item>
                <div className="no-results">No artists found</div>
              </Grid>
            )}
          </Grid>
        </div>
        <div className="filtered-section">
          <Grid container direction="column" spacing={2}>
            {getFilteredTracks().map((track) => (
              <Grid item key={track.id} className="item-container">
                <div className="track-item">
                  <div className="track-image-container">
                    <img
                      src={track.coverImage || track.artwork}
                      alt={track.title}
                      className="track-image"
                    />
                  </div>
                  <div className="track-details">
                    <Typography variant="body1" className="track-title">{track.title}</Typography>
                  </div>
                </div>
              </Grid>
            ))}
            {getFilteredTracks().length === 0 && (
              <Grid item>
                <div className="no-results">No tracks found</div>
              </Grid>
            )}
          </Grid>
        </div>
      </>
    );
  } else if (filter === 'albums') {
    filteredContent = (
      <div className="filtered-section">
        <Grid container direction="column" spacing={2}>
          {getFilteredAlbums().map((album) => (
            <Grid item key={album.id} className="item-container">
              <div className="album-item">
                <div className="album-image-container">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="album-image"
                  />
                </div>
                <div className="album-details">
                  <Typography variant="caption" display="block">Album</Typography>
                  <Typography variant="h6" className="album-title">{album.title}</Typography>
                  <Typography variant="body1" className="album-artist">{album.artistName}</Typography>
                  <Typography variant="body2" className="album-info">
                    {album.duration} {album.duration && ' | '} {getReleaseYear(album.releaseDate)}
                  </Typography>
                </div>
              </div>
            </Grid>
          ))}
          {getFilteredAlbums().length === 0 && (
            <Grid item>
              <div className="no-results">No albums found</div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  } else if (filter === 'artists') {
    filteredContent = (
      <div className="filtered-section">
        <Grid container direction="column" spacing={2}>
          {getFilteredArtists().map((artist) => (
            <Grid item key={artist.id} className="item-container">
              <div className="artist-item">
                <div className="artist-image-container">
                  <img
                    src={artist.profileImage}
                    alt={artist.name}
                    className="artist-image"
                  />
                </div>
                <div className="artist-details">
                  <Typography variant="h6" className="artist-name">{artist.name}</Typography>
                  <Typography variant="body2" className="artist-genre">{artist.genre}</Typography>
                </div>
              </div>
            </Grid>
          ))}
          {getFilteredArtists().length === 0 && (
            <Grid item>
              <div className="no-results">No artists found</div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  } else if (filter === 'tracks') {
    filteredContent = (
      <div className="filtered-section">
        <Grid container direction="column" spacing={2}>
          {getFilteredTracks().map((track) => (
            <Grid item key={track.id} className="item-container">
              <div className="track-item">
                <div className="track-image-container">
                  <img
                    src={track.coverImage || track.artwork}
                    alt={track.title}
                    className="track-image"
                  />
                </div>
                <div className="track-details">
                  <Typography variant="body1" className="track-title">{track.title}</Typography>
                </div>
              </div>
            </Grid>
          ))}
          {getFilteredTracks().length === 0 && (
            <Grid item>
              <div className="no-results">No tracks found</div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <Typography variant="h3" className="main-title">Explore Music</Typography>
      <div className="search-bar-container">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search music, artists, albums, tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="tabs-container">
        <Tabs
          value={filter}
          onChange={(event, newValue) => setFilter(newValue)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab
            label="All"
            value="all"
            sx={{
              backgroundColor: filter === 'all' ? '#eee' : 'transparent',
              borderBottom: filter === 'all' ? '2px solid #000' : 'none'
            }}
          />
          <Tab
            label="Albums"
            value="albums"
            sx={{
              backgroundColor: filter === 'albums' ? '#eee' : 'transparent',
              borderBottom: filter === 'albums' ? '2px solid #000' : 'none'
            }}
          />
          <Tab
            label="Artists"
            value="artists"
            sx={{
              backgroundColor: filter === 'artists' ? '#eee' : 'transparent',
              borderBottom: filter === 'artists' ? '2px solid #000' : 'none'
            }}
          />
          <Tab
            label="Tracks"
            value="tracks"
            sx={{
              backgroundColor: filter === 'tracks' ? '#eee' : 'transparent',
              borderBottom: filter === 'tracks' ? '2px solid #000' : 'none'
            }}
          />
        </Tabs>
      </div>
      <div className="results">{filteredContent}</div>
    </div>
  );
};

export default ExplorePage;