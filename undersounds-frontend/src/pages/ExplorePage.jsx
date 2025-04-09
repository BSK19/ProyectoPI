import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Tabs, Tab, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { getFormattedAlbumDuration } from '../utils/formatters';
import { fetchAlbums } from '../services/jamendoService';
import '../styles/explorepage.css';

const ExplorePage = () => {
  // States for data
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]); // You can load artists similarly if needed
  const [tracks, setTracks] = useState([]);   // Tracks will be extracted from albums

  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('all');
  const [filter, setFilter] = useState('all');
  const location = useLocation();

  // Get URL parameters
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

  // Load albums from the database using fetchAlbums
  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const fetchedAlbums = await fetchAlbums();
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    loadAlbums();
  }, []);

  // Extract tracks from the loaded albums and attach album info to each track
  useEffect(() => {
    if (albums.length > 0) {
      const allTracks = albums.flatMap(album =>
        (album.tracks || []).map(track => ({
          ...track,
          album_id: album.id,
          album_name: album.name || album.title,
          album_cover: album.coverImage || album.image || '/assets/images/default-cover.jpg',
        }))
      );
      setTracks(allTracks);
    }
  }, [albums]);

  // Effective search query (empty string if 'all')
  const effectiveSearchQuery =
    searchTerm.toLowerCase() === 'all'
      ? ''
      : searchTerm.toLowerCase();

  const getFilteredAlbums = () =>
    albums.filter(album => {
      const albumName = (album.name || album.title || '').toLowerCase();
      return albumName.includes(effectiveSearchQuery);
    });

  const getFilteredTracks = () =>
    tracks.filter(track => {
      const trackName = (track.track_name || track.name || '').toLowerCase();
      const trackArtist = (track.artist_name || track.artist || '').toLowerCase();
      const trackAlbum = (track.album_name || track.album || '').toLowerCase();
      return (
        trackName.includes(effectiveSearchQuery) ||
        trackArtist.includes(effectiveSearchQuery) ||
        trackAlbum.includes(effectiveSearchQuery)
      );
    });

  const getFilteredArtists = () =>
    artists.filter(artist =>
      artist.name.toLowerCase().includes(effectiveSearchQuery)
    );

  // Render an album with its details and track list (if available)
  const renderAlbumItem = (album) => (
    <Grid item key={album.id} className="item-container">
      <Grid
        container
        spacing={2}
        alignItems="center"
        className="album-item"
        wrap="nowrap"
        style={{ gap: '10px' }}
      >
        <Grid item xs="auto" sm="auto">
          <div className="album-image-container">
            <img
              src={
                album.coverImage ||
                album.image ||
                '/assets/images/default-cover.jpg'
              }
              alt={album.name || album.title}
              className="album-image"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={8}>
          <div className="album-details">
            <Typography
              variant="caption"
              display="block"
              className="item-type"
            >
              Album
            </Typography>
            <Typography variant="h6" className="album-title">
              <Link to={`/album/${album.id}`}>
                {album.name || album.title}
              </Link>
            </Typography>
            <Typography variant="body1" className="album-artist">
              {album.artist || album.artist_name}
            </Typography>
            <br />
            <Typography variant="body2" className="album-details">
              {album.tracks ? album.tracks.length : 0} tracks, {getFormattedAlbumDuration(album)}
            </Typography>
            <Typography variant="body2" className="album-details">
              Publicado en {album.releaseYear || album.releasedate}
            </Typography>
            <Typography variant="body2" className="album-details">
              Genre: {album.genre}
            </Typography>

          </div>
        </Grid>
      </Grid>
    </Grid>
  );

  // Render a track item con la información del álbum incluida
  const renderTrackItem = (track) => (
    <Grid item key={track.id} className="item-container">
        <Grid
            container
            spacing={2}
            alignItems="flex-start" // Se cambia de "center" a "flex-start"
            className="track-item"
            wrap="nowrap"
            style={{ gap: '10px' }}
        >
            <Grid item xs="auto" sm="auto">
                <div className="track-image-container">
                    <img
                        src={track.album_cover || track.artwork || '/assets/images/default-cover.jpg'}
                        alt={track.track_name || track.name}
                        className="track-image"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={6} sm={8}>
                <div className="track-details" style={{ textAlign: 'left' }}>
                    <Typography
                        variant="caption"
                        display="block"
                        className="item-type"
                    >
                        Canción
                    </Typography>
                    <Typography variant="h6" className="track-title">
                        {track.track_name || track.name || track.title || 'Sin título'}
                    </Typography>
                    <Typography variant="body1" className="track-artist">
                        {track.artist_name || track.artist}
                    </Typography>
                    <Typography variant="body2" className="track-album">
                        Álbum:{' '}
                        <Link to={`/album/${track.album_id}`}>
                            {track.album_name}
                        </Link>
                    </Typography>
                    <Typography variant="body2" className="track-info">
                        Duración: {track.duration}
                    </Typography>
                </div>
            </Grid>
        </Grid>
    </Grid>
  );

  // Render an artist section
  const renderArtistSection = (artist) => {
    const artistAlbums = albums.filter(
      (album) =>
        ((album.artist || album.artist_name) || '')
          .toLowerCase() === artist.name.toLowerCase()
    );
    const artistTracks = tracks.filter(
      (track) =>
        ((track.artist || track.artist_name) || '')
          .toLowerCase() === artist.name.toLowerCase()
    );
    return (
      <div key={artist.id} className="artist-section" style={{ marginBottom: '2rem' }}>
        <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
          {artist.name}
        </Typography>
        {artistAlbums.length > 0 && (
          <div>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Álbumes:
            </Typography>
            <Grid container direction="column" spacing={2}>
              {artistAlbums.map(renderAlbumItem)}
            </Grid>
          </div>
        )}
        {artistTracks.length > 0 && (
          <div>
            <Typography variant="subtitle1" sx={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              Canciones:
            </Typography>
            <Grid container direction="column" spacing={2}>
              {artistTracks.map(renderTrackItem)}
            </Grid>
          </div>
        )}
      </div>
    );
  };

  // Build filtered content based on selected filter
  let filteredContent = null;
  if (filter === 'all') {
    filteredContent = (
      <>
        {getFilteredAlbums().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredAlbums().map(renderAlbumItem)}
            </Grid>
          </div>
        )}
        {getFilteredTracks().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredTracks().map(renderTrackItem)}
            </Grid>
          </div>
        )}
        {getFilteredArtists().length > 0 && (
          <div className="filtered-section">
            {getFilteredArtists().map(renderArtistSection)}
          </div>
        )}
      </>
    );
  } else if (filter === 'albums') {
    filteredContent = (
      <div className="filtered-section">
        <Grid container direction="column" spacing={2}>
          {getFilteredAlbums().map(renderAlbumItem)}
          {getFilteredAlbums().length === 0 && (
            <Grid item>
              <div className="no-results">No albums found</div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  } else if (filter === 'tracks') {
    filteredContent = (
      <div className="filtered-section">
        <Grid container direction="column" spacing={2}>
          {getFilteredTracks().map(renderTrackItem)}
          {getFilteredTracks().length === 0 && (
            <Grid item>
              <div className="no-results">No tracks found</div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  } else if (filter === 'artists') {
    filteredContent = (
      <div className="filtered-section">
        {getFilteredArtists().map(renderArtistSection)}
        {getFilteredArtists().length === 0 && (
          <div className="no-results">No artists found</div>
        )}
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
          placeholder="Search music, albums, tracks, artists..."
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
        {/* Tabs for filtering */}
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
            sx={{ minHeight: 'auto' }}
          >
            <Tab label="All" value="all" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
            <Tab label="Albums" value="albums" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
            <Tab label="Tracks" value="tracks" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
            <Tab label="Artists" value="artists" sx={{ flex: 1, color: 'white', fontSize: '0.9rem', py: 0.2 }} />
          </Tabs>
        </Box>
      </Box>
      <div className="results">{filteredContent}</div>
    </div>
  );
};

export default ExplorePage;