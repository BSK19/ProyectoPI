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
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from '../../assets/images/logo.png';
import SignUpDialog from '../Auth/SignUpDx';
import albums from '../../mockData/albums';
import artists from '../../mockData/artists';
import tracks from '../../mockData/tracks';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Header = () => {
  const [query, setQuery] = useState('');
  const [openSignUp, setOpenSignUp] = useState(false);
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Para el menú del avatar
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const { user, logout, setUser } = useContext(AuthContext);
  // Se usa la propiedad correcta "cartItems" del CartContext
  const { cartItems } = useContext(CartContext);

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

  // Debounce para búsquedas
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

  // Funciones para el menú del avatar
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/user/profile');
    handleCloseMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
      handleCloseMenu();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Zona Izquierda: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} alt="UnderSounds Logo" style={{ width: '150px' }} />
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
            <IconButton
              type="button"
              color="inherit"
              onClick={() => {
                if (query.trim()) {
                  handleSearch(); // Asegúrate de que los resultados se actualicen antes de redirigir
                }
                navigate(`/explore?filter=${filter}&q=${encodeURIComponent(query.trim())}`);
              }}
            >
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
        {/* Zona Derecha: Botones de Carrito y autenticación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button color="inherit" onClick={() => navigate('/cart')}>
            <Badge
              badgeContent={cartItems?.length || 0}
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 13,
                  border: '2px solid white',
                  padding: '0 4px',
                },
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </Button>
          {user ? (
            <>
              <IconButton onClick={handleAvatarClick}>
                <Avatar
                  src={user.profileImage}
                  alt={user.username || user.bandName || 'Usuario'}
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleProfile}>Mi perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleOpenSignUp}>
                Registrate
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Inicia Sesión
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