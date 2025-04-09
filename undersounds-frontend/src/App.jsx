import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Common/Header';
import Navigation from './components/Common/Navigation';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AlbumPage from './pages/AlbumPage';
import News from './pages/News';
import PaymentSuccess from './pages/PaymentSuccess';
import ScrollToTop from './components/Common/ScrollToTop';
import ArtistProfile from './pages/ArtistProfile';
import ArtistDashboard from './pages/ArtistDashboard';
import UserProfile from './pages/UserProfile';
import DiscoverPage from './pages/DiscoverPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TshirtPage from './pages/TshirtPage';
import CarritoPage from './pages/CarritoPage';
import PaymentPage from './pages/Payment';
import Footer from './components/Common/Footer';
import RegisterProvider from './context/RegisterContext';
import AlbumProvider from './context/AlbumContext';
import SignUpDialog from './components/Auth/SignUpDx';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AudioPlayer from './components/Player/AudioPlayer';
import ConcertPage from './pages/ConcertPage';

const theme = createTheme({
    palette: {
        primary: { main: '#1DA0C3' },
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
                <Route path="/tshirt/:id" element={<TshirtPage />} />
                <Route path="/cart" element={<CarritoPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/paymentSuccess" element={<PaymentSuccess />} />
                <Route path="/concert/:artistId/:concertId" element={<ConcertPage />} />
            </Routes>
            <Footer />
            <SignUpDialog />
            <AudioPlayer />
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
                            <CartProvider>
                                <Router>
                                    <ScrollToTop />
                                    <AppContent />
                                </Router>
                            </CartProvider>
                        </AuthProvider>
                    </AlbumProvider>
                </RegisterProvider>
            </PlayerProvider>
        </ThemeProvider>
    );
};

export default App;