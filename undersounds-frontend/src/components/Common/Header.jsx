import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  InputBase,
  Box,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/images/logo.png';
import SignUpDialog from '../Auth/SignUpDx';
import albums from '../../mockData/albums';
import artists from '../../mockData/artists';
import tracks from '../../mockData/tracks';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const [query, setQuery] = useState('');
  const [openSignUp, setOpenSignUp] = useState(false);
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const { user } = useContext(AuthContext);

  const handleSearch = () => {
    let filteredResults = [];

    if (filter === 'all' || filter === 'artists') {
      const artistMatches = artists.filter(artist =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      filteredResults = [
        ...filteredResults,
        ...artistMatches.map(item => ({ type: 'artist', data: item }))
      ];
    }
    if (filter === 'all' || filter === 'albums') {
      const albumMatches = albums.filter(album =>
        album.title.toLowerCase().includes(query.toLowerCase())
      );
      filteredResults = [
        ...filteredResults,
        ...albumMatches.map(item => ({ type: 'album', data: item }))
      ];
    }
    if (filter === 'all' || filter === 'tracks') {
      const trackMatches = tracks.filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase())
      );
      filteredResults = [
        ...filteredResults,
        ...trackMatches.map(item => ({ type: 'track', data: item }))
      ];
    }
    setResults(filteredResults);
  };

  // Debounce para ejecutar la búsqueda (500ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, filter]);

  // Reinicia la búsqueda al cambiar de ruta
  useEffect(() => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  }, [location]);

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
  };

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleDropdownMouseLeave = () => {
    setShowDropdown(false);
  };

  const renderResultItem = (result) => {
    if (result.type === 'artist') {
      return (
        <ListItem
          button
          component={Link}
          to={`/artistProfile/${result.data.id}`}
          key={`artist-${result.data.id}`}
        >
          <ListItemAvatar>
            <Avatar src={result.data.profileImage} alt={result.data.name} />
          </ListItemAvatar>
          <ListItemText primary={result.data.name} secondary="Artista" />
        </ListItem>
      );
    } else if (result.type === 'album') {
      return (
        <ListItem
          button
          component={Link}
          to={`/album/${result.data.id}`}
          key={`album-${result.data.id}`}
        >
          <ListItemAvatar>
            <Avatar src={result.data.coverImage} alt={result.data.title} />
          </ListItemAvatar>
          <ListItemText primary={result.data.title} secondary="Álbum" />
        </ListItem>
      );
    } else if (result.type === 'track') {
      return (
        <ListItem
          button
          component={Link}
          to={`/track/${result.data.id}`}
          key={`track-${result.data.id}`}
        >
          <ListItemAvatar>
            <Avatar src={result.data.artwork || result.data.coverImage} alt={result.data.title} />
          </ListItemAvatar>
          <ListItemText primary={result.data.title} secondary="Pista" />
        </ListItem>
      );
    }
    return null;
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Zona Izquierda: Logo siempre visible */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} alt="UnderSounds Logo" style={{ height: '100px' }} />
          </Link>
        </Box>
        {/* Zona central: Área de búsqueda */}
        <Box
          ref={containerRef}
          sx={{ display: 'flex', flexDirection: 'column', mx: 2, flexGrow: 1, position: 'relative' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InputBase
              placeholder="Buscar música, artistas, álbumes, pistas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.trim()) setShowDropdown(true);
              }}
              onClick={() => {
                if (query.trim()) setShowDropdown(true);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mx: 2,
                backgroundColor: '#eaeded',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
                width: { xs: '200px', md: '250px' }
              }}
            />
            <IconButton type="button" color="inherit" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>
          {query.trim() && showDropdown && (
            <Paper
              onMouseLeave={handleDropdownMouseLeave}
              sx={{
                mt: 1,
                width: '100%',
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                zIndex: 10
              }}
            >
              <Tabs
                value={filter}
                onChange={handleFilterChange}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ minHeight: 'auto' }}
              >
                <Tab label="Todos" value="all" />
                <Tab label="Artistas" value="artists" />
                <Tab label="Álbumes" value="albums" />
                <Tab label="Pistas" value="tracks" />
              </Tabs>
              {results.length > 0 && (
                <List>
                  {results.slice(0, 4).map(renderResultItem)}
                  <ListItem
                    button
                    onClick={() =>
                      navigate(`/explore?filter=${filter}&q=${encodeURIComponent(query.trim())}`)
                    }
                  >
                    <ListItemText primary="Mostrar más" />
                  </ListItem>
                </List>
              )}
            </Paper>
          )}
        </Box>
        {/* Zona Derecha: Botones de autenticación o Avatar si está logueado */}
        <Box>
          {user ? (
            <IconButton onClick={() => navigate('/user/profile')}>
              <Avatar
                src={user.profileImage}
                alt={user.username || user.bandName || 'Usuario'}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          ) : (
            <>
              <Button color="inherit" onClick={handleOpenSignUp}>
                Sign Up
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Log In
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      <SignUpDialog open={openSignUp} handleClose={handleCloseSignUp} />
    </AppBar>
  );
};

export default Header;