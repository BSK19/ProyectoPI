import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Tabs, Tab, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { fetchAlbums, fetchArtists, fetchTracks } from '../services/musicService';
import { getFormattedAlbumDuration } from '../utils/formatters';
import '../styles/explorepage.css';

const ExplorePage = () => {
  // Estados para los datos
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  // Estado para la búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('all');
  const [filter, setFilter] = useState('all');
  const location = useLocation();

  // Obtener los parámetros de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const f = params.get('filter') || 'all';
    setSearchTerm(q);
    setFilter(f);
  }, [location.search]);

  useEffect(() => {
    if (!filter) setFilter('all');
  }, [filter]);

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
      track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Renderiza un álbum
  const renderAlbumItem = (album) => (
    <Grid item key={album.id} className="item-container">
      <Grid container spacing={2} alignItems="center" className="album-item" wrap="nowrap" style={{ gap: '10px' }}>
        <Grid item xs="auto" sm="auto">
          <div className="album-image-container">
            <img
              src={album.coverImage}
              alt={album.title}
              className="album-image"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={8}>
          <div className="album-details">
            <Typography variant="caption" display="block" className="item-type">
              Album
            </Typography>
            <Typography variant="h6" className="album-title">
              <Link to={`/album/${album.id}`}>{album.title}</Link>
            </Typography>
            <Typography variant="body1" className="album-artist">
              {album.artist}
            </Typography>
            <br />
            <Typography variant="body2" className="album-details">
              {album.tracks ? album.tracks.length : 0} tracks, {getFormattedAlbumDuration(album)} <br />
              Publicado en {album.releaseYear}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );

  // Renderiza un artista
  const renderArtistItem = (artist) => (
    <Grid item key={artist.id} className="item-container">
      <Grid container spacing={2} alignItems="center" className="artist-item" wrap="nowrap" style={{ gap: '10px' }}>
        <Grid item xs="auto" sm="auto">
          <div className="artist-image-container">
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="artist-image"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={8}>
          <div className="artist-details">
            <Typography variant="caption" display="block" className="item-type">
              Artista
            </Typography>
            <Typography variant="h6" className="artist-name">
              <Link to={`/artistProfile/${artist.id}`}>{artist.name}</Link>
            </Typography>
            <Typography variant="body2" className="artist-genre">
              Género: {artist.genre}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );

  // Renderiza una canción
  const renderTrackItem = (track) => (
    <Grid item key={track.id} className="item-container">
      <Grid container spacing={2} alignItems="center" className="track-item" wrap="nowrap" style={{ gap: '10px' }}>
        <Grid item xs="auto" sm="auto">
          <div className="track-image-container">
            <img
              src={track.coverImage || track.artwork}
              alt={track.title}
              className="track-image"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={8}>
          <div className="track-details">
            <Typography variant="caption" display="block" className="item-type">
              Canción
            </Typography>
            <Typography variant="h6" className="track-title">
              <Link to={`/album/${track.albumId}`}>{track.title}</Link>
            </Typography>
            <Typography variant="body1" className="track-artist">
              {track.artist}
            </Typography>
            <Typography variant="body2" className="track-album">
              Álbum: <Link to={`/album/${track.albumId}`}>{track.album}</Link>
            </Typography>
            <Typography variant="body2" className="track-info">
              Duración: {track.duration}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );

  let filteredContent = null;
  if (filter === 'all') {
    filteredContent = (
      <>
        {getFilteredAlbums().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredAlbums().map((album) => renderAlbumItem(album))}
            </Grid>
          </div>
        )}
        {getFilteredArtists().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredArtists().map((artist) => renderArtistItem(artist))}
            </Grid>
          </div>
        )}
        {getFilteredTracks().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredTracks().map((track) => renderTrackItem(track))}
            </Grid>
          </div>
        )}
      </>
    );
  } else if (filter === 'albums') {
    filteredContent = (
      <div className="filtered-section">
        <Grid container direction="column" spacing={2}>
          {getFilteredAlbums().map((album) => renderAlbumItem(album))}
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
          {getFilteredArtists().map((artist) => renderArtistItem(artist))}
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
          {getFilteredTracks().map((track) => renderTrackItem(track))}
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
      <Box
        sx={{
          background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
          borderRadius: '12px',
          p: 3,
          mb: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h3"
          className="main-title"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            letterSpacing: '0.1em',
            fontWeight: 700,
            textTransform: 'uppercase',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Explore Music
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search music, artists, albums, tracks..."
          value={searchTerm}
          onChange={(e) => {
            setFilter('all');
            setSearchTerm(e.target.value);
          }}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
        {/* Filtros debajo de la barra de búsqueda con menor altura vertical */}
        <Box
          sx={{
            mt: 2,
            backgroundColor: '#1da0c3',
            borderRadius: '8px',
            py: 0, 
            px: 1,
          }}
        >
          <Tabs
            value={filter}
            onChange={(event, newValue) => setFilter(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: 'auto',
            }}
          >
            <Tab label="All" value="all" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
            <Tab label="Albums" value="albums" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
            <Tab label="Artists" value="artists" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
            <Tab label="Tracks" value="tracks" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
          </Tabs>
        </Box>
      </Box>
      <div className="results">{filteredContent}</div>
    </div>
  );
};

export default ExplorePage;