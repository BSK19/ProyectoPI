import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/images/logo.png';
import SignUpDialog from '../Auth/SignUpDx';

const Header = () => {
  const [query, setQuery] = useState('');
  const [openSignUp, setOpenSignUp] = useState(false); // Added state
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/discover?search=${encodeURIComponent(query)}`);
  };

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} alt="UnderSounds Logo" style={{ height: '100px' }} />
          </Link>
        </Box>
        {/* Search */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mx: 2 }}>
          <InputBase
            placeholder="Buscar música..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                mx: 2,
                backgroundColor: '#eaeded',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
                width: { xs: '150px', md: '220px' } 
            }}
          />
          <IconButton type="submit" color="inherit">
            <SearchIcon />
          </IconButton>
        </Box>
        {/* Links */}
        <Box>
          <Button color="inherit" onClick={handleOpenSignUp}>
            Sign Up
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Log In
          </Button>
        </Box>
      </Toolbar>
      <SignUpDialog open={openSignUp} handleClose={handleCloseSignUp} />
    </AppBar>
  );
};

export default Header;