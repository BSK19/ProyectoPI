import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Tabs, Tab, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getFormattedAlbumDuration } from '../utils/formatters';
import '../styles/explorepage.css';

const PROXY_BASE_URL = "http://localhost:5000/api/jamendo";

const ExplorePage = () => {
  // States for data
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

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

  // Load data using axios
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch basic albums and extended info
        const albumsResponse = await axios.get(`${PROXY_BASE_URL}/albums`, {
          params: {
            client_id: "37a3b74b",
            format: 'json',
            limit: 20,
          },
          withCredentials: false,
        });
        const basicAlbums = albumsResponse.data.results;
        const albumsWithInfo = await Promise.all(
          basicAlbums.map(async (album) => {
            try {
              const musicInfoResponse = await axios.get(`${PROXY_BASE_URL}/albums/musicinfo`, {
                params: {
                  client_id: "37a3b74b",
                  format: 'json',
                  id: album.id,
                },
                withCredentials: false,
              });
              const musicInfo = musicInfoResponse.data.results[0] || null;
              let tagsArray = [];
              if (musicInfo && musicInfo.musicinfo && musicInfo.musicinfo.tags) {
                if (typeof musicInfo.musicinfo.tags === 'string') {
                  tagsArray = musicInfo.musicinfo.tags.split(',').map(tag => tag.trim());
                } else if (Array.isArray(musicInfo.musicinfo.tags)) {
                  tagsArray = musicInfo.musicinfo.tags;
                }
              }
              const genre = tagsArray.length > 0 ? tagsArray[0] : 'Unknown';
              return { ...album, genre, musicinfo: musicInfo };
            } catch (err) {
              console.error(`Error fetching musicinfo for album ${album.id}:`, err);
              return { ...album, genre: 'Unknown', musicinfo: null };
            }
          })
        );
        setAlbums(albumsWithInfo);

        // Fetch artists
        const artistsResponse = await axios.get(`${PROXY_BASE_URL}/artists`, {
          params: {
            client_id: "37a3b74b",
            format: 'json',
            limit: 20,
          },
          withCredentials: false,
        });
        setArtists(artistsResponse.data.results);

        // Fetch tracks
        const tracksResponse = await axios.get(`${PROXY_BASE_URL}/tracks`, {
          params: {
            client_id: "37a3b74b",
            format: 'json',
            limit: 20,
          },
          withCredentials: false,
        });
        console.log("Tracks fetched:", tracksResponse.data.results);
        setTracks(tracksResponse.data.results);
      } catch (error) {
        console.error("Error fetching data from Jamendo (axios):", error);
      }

      // Example placeholder for additional album loading if needed
      const loadAlbums = async () => {
        try {
          const fetchedAlbums = await fetchAlbums();
          setAlbums(fetchedAlbums);
        } catch (error) {
          console.error('Error fetching albums:', error);
        }
      };
      loadAlbums();
    };
    loadData();
  }, []);

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
            <Typography
              variant="h6"
              className="album-title"
            >
              <Link to={`/album/${album.id}`}>
                {album.name || album.title}
              </Link>
            </Typography>
            <Typography variant="body1" className="album-artist">
              {album.artist || album.artist_name}
            </Typography>
            <br />
            <Typography variant="body2" className="album-details">
              {album.musicinfo && album.musicinfo.tracks
                ? album.musicinfo.tracks.length
                : 0}{' '}
              tracks, {getFormattedAlbumDuration(album)}
            </Typography>
            <Typography variant="body2" className="album-details">
              Publicado en {album.releaseYear || album.releasedate}
            </Typography>
            <Typography variant="body2" className="album-details">
              Genre: {album.genre}
            </Typography>
            {/* Render track list if available in extended info */}
            {album.musicinfo &&
              album.musicinfo.tracks &&
              album.musicinfo.tracks.length > 0 && (
                <Box className="track-list" sx={{ mt: 1, ml: 2 }}>
                  {album.musicinfo.tracks.map((track, index) => (
                    <Typography
                      key={track.id || index}
                      variant="body2"
                      sx={{ color: '#555' }}
                    >
                      {index + 1}. {track.title || track.name} -{' '}
                      {track.duration}
                    </Typography>
                  ))}
                </Box>
              )}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );

  // Render a track
  const renderTrackItem = (track) => (
    <Grid item key={track.id} className="item-container">
      <Grid
        container
        spacing={2}
        alignItems="center"
        className="track-item"
        wrap="nowrap"
        style={{ gap: '10px' }}
      >
        <Grid item xs="auto" sm="auto">
          <div className="track-image-container">
            <img
              src={
                track.coverImage ||
                track.artwork ||
                '/assets/images/default-cover.jpg'
              }
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
          <div className="track-details">
            <Typography
              variant="caption"
              display="block"
              className="item-type"
            >
              Canción
            </Typography>
            <Typography variant="h6" className="track-title">
              <Link to={`/album/${track.albumId || track.album_id}`}>
                {track.track_name || track.name}
              </Link>
            </Typography>
            <Typography variant="body1" className="track-artist">
              {track.artist_name || track.artist}
            </Typography>
            <Typography variant="body2" className="track-album">
              Álbum:{' '}
              <Link to={`/album/${track.albumId || track.album_id}`}>
                {track.album_name || track.album}
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

  // Render an artist section: for each matching artist, show its name,
  // then the albums and tracks belonging to it
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