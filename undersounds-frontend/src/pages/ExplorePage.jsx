import React, { useEffect, useState } from 'react';
import { Grid, TextField, Tabs, Tab, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { fetchAlbums, fetchArtists, fetchTracks } from '../services/musicService';
import { getFormattedAlbumDuration, formatTrackReleaseDate } from '../utils/formatters';
import '../styles/explorepage.css';

const ExplorePage = () => {
  // Estados para los datos
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  // Estado para la búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const location = useLocation();

  // Obtener el parámetro de búsqueda (q) desde la URL al cargar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchTerm(q);
  }, [location.search]);

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

  // Renderiza un álbum con la imagen a la izquierda y la información a la derecha.
  // El título del álbum y el nombre del artista son enlaces a sus páginas.
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

  // Renderiza un artista con la imagen a la izquierda y la información a la derecha.
  // El nombre del artista es un enlace a su página.
  const renderArtistItem = (artist) => (
    <Grid item key={artist.id} className="item-container">
      <Grid
        container
        spacing={2}
        alignItems="center"
        className="artist-item"
        wrap="nowrap"
        style={{ gap: '10px' }}
      >
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

  // Renderiza una track con la imagen a la izquierda y la información a la derecha.
  // El título de la track es un enlace a su página, y se muestra la palabra "Canción", su artista
  // y la fecha de salida formateada.
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
              {track.artist} {/* Eliminado el Link al artista */}
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
        {/* Sección de álbumes (solo se muestra si hay resultados) */}
        {getFilteredAlbums().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredAlbums().map((album) => renderAlbumItem(album))}
            </Grid>
          </div>
        )}
        {/* Sección de artistas */}
        {getFilteredArtists().length > 0 && (
          <div className="filtered-section">
            <Grid container direction="column" spacing={2}>
              {getFilteredArtists().map((artist) => renderArtistItem(artist))}
            </Grid>
          </div>
        )}
        {/* Sección de tracks */}
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