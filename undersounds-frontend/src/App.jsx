import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import UserProfile from './pages/UserProfile';
import DiscoverPage from './pages/DiscoverPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TshirtPage from './pages/TshirtPage';
import CarritoPage from './pages/CarritoPage';
import Footer from './components/Common/Footer';
import RegisterProvider from './context/RegisterContext';
import AlbumProvider from './context/AlbumContext';
import SignUpDialog from './components/Auth/SignUpDx';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AudioPlayer from './components/Player/AudioPlayer';
import ConcertPage from './pages/ConcertPage';
import axios from 'axios';

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

// Componente para capturar el token de Google OAuth
function GoogleAuthHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    
    useEffect(() => {
        // Buscar el token en la URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            
            // Guardar el token en localStorage
            localStorage.setItem('token', token);
            
            // Configurar el token para futuras solicitudes API
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Obtener la información del usuario usando el token
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                                        
                    // Iniciar sesión con la información del usuario
                    login(response.data.account, token);
                    
                    // Redirigir a la página principal sin el token en la URL
                    navigate('/', { replace: true });
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                    localStorage.removeItem('token');
                }
            };
            
            fetchUserData();
        }
    }, [location, login, navigate]);
    
    return null; // Este componente no renderiza nada
}

const AppContent = () => {
    const location = useLocation();
    const hideNavRoutes = ['/login', '/register', '/explore'];
    const hideNav = hideNavRoutes.includes(location.pathname);
    
    return (
        <>
            <Header />
            {!hideNav && <Navigation />}
            <GoogleAuthHandler />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/album/:id" element={<AlbumPage />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/artistProfile/:id" element={<ArtistProfile />} />
                <Route path="/news/:noticiaId" element={<News />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/tshirt/:id" element={<TshirtPage />} />
                <Route path="/cart" element={<CarritoPage />} />
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