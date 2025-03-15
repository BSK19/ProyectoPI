import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Common/Header';
import Navigation from './components/Common/Navigation';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AlbumPage from './pages/AlbumPage';
import ArtistDashboard from './pages/ArtistDashboard';
import UserProfile from './pages/UserProfile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Footer from './components/Common/Footer';
import RegisterProvider from './components/Auth/RegisterContext';
import SignUpDialog from './components/Auth/SignUpDx';

const theme = createTheme({
  palette: {
    primary: { main: '#ffffff' },
    secondary: { main: '#1da0c3' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#555555' },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RegisterProvider>
        <Router>
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
          <SignUpDialog /> {/* Movido dentro del Router */}
        </Router>
      </RegisterProvider>
    </ThemeProvider>
  );
};

export default App;