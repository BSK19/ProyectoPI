import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Navigation from './components/Common/Navigation';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AlbumPage from './pages/AlbumPage';
import ArtistDashboard from './pages/ArtistDashboard';
import UserProfile from './pages/UserProfile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
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
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;