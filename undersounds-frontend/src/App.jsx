import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Common/Header';
import Navigation from './components/Common/Navigation';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AlbumPage from './pages/AlbumPage';
import News from './pages/News';
import ScrollToTop from './components/Common/ScrollToTop';
import ArtistProfile from './pages/ArtistProfile';
import ArtistDashboard from './pages/ArtistDashboard';
import UserProfile from './pages/UserProfile';
import DiscoverPage from './pages/DiscoverPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TshirtPage from './pages/TshirtPage'; // Importa la página de camiseta
import Footer from './components/Common/Footer';
import RegisterProvider from './context/RegisterContext';
import AlbumProvider from './context/AlbumContext';
import SignUpDialog from './components/Auth/SignUpDx';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';

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

const AppContent = () => {
    const location = useLocation();
    const hideNavRoutes = ['/login', '/register', '/explore'];
    const hideNav = hideNavRoutes.includes(location.pathname);

    return (
        <>
            <Header />
            {!hideNav && <Navigation />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/album/:id" element={<AlbumPage />} />
                <Route path="/artist/dashboard" element={<ArtistDashboard />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/artistProfile/:id" element={<ArtistProfile />} />
                <Route path="/news/:noticiaId" element={<News />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/tshirt/:id" element={<TshirtPage />} /> {/* Nueva ruta */}
            </Routes>
            <Footer />
            <SignUpDialog />
        </>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <PlayerProvider>
                <RegisterProvider>
                    <AlbumProvider>
                        <AuthProvider>
                            <Router>
                                <ScrollToTop />
                                <AppContent />
                            </Router>
                        </AuthProvider>
                    </AlbumProvider>
                </RegisterProvider>
            </PlayerProvider>
        </ThemeProvider>
    );
};

export default App;