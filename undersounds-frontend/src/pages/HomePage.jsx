import React, { useContext, useState, useEffect } from 'react';
import artists from '../mockData/artists';
import '../styles/homePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import noticiasMusica from '../mockData/noticiasMusica';
import { AlbumContext } from '../context/AlbumContext';
import { AuthContext } from '../context/AuthContext';
import imagen from '../assets/images/images2.webp';
import imagen2 from '../assets/images/imagen2.jpeg';
import imagen3 from '../assets/images/images3.webp';
import { fetchAlbums, fetchTracklist } from '../services/jamendoService.js';

const HomePage = () => {
    const noticia = noticiasMusica[0];
    const noticia2 = noticiasMusica[1];
    const noticia3 = noticiasMusica[2];

    const { setSelectedAlbumId } = useContext(AlbumContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startIndex, setStartIndex] = useState(0);
    const [startIndexNew, setStartIndexNew] = useState(0);
    const [startIndexArt, setStartIndexArt] = useState(0);

    useEffect(() => {
        const loadAlbums = async () => {
            try {
                setLoading(true);
                const fetchedAlbums = await fetchAlbums();
                // Para cada álbum, se obtiene el tracklist real y se recalcula el precio
                const updatedAlbums = await Promise.all(
                    fetchedAlbums.map(async (album) => {
                        const trackList = await fetchTracklist(album.id);
                        const trackCount = trackList.length;
                        const basePrice = 9.99;
                        const pricePerTrack = 0.99;
                        const calculatedPrice = parseFloat((basePrice + (trackCount * pricePerTrack)).toFixed(2));
                        
                        // Si deseas revalidar el género en HomePage (por ejemplo, si album.tags se actualiza en la API):
                        let genre = album.genre; // valor calculado en fetchAlbums
                        if ((!genre || genre === 'Unknown') && album.tags && album.tags.length > 0) {
                            genre = Array.isArray(album.tags)
                            ? album.tags[0]
                            : album.tags.split(',')[0].trim();
                        }
                        return {
                            ...album,
                            tracks: trackList,
                            price: calculatedPrice
                        };
                    })
                );
                setAlbums(updatedAlbums);
            } catch (error) {
                console.error('Error fetching albums:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAlbums();
    }, []);

    const handleAlbumClick = (album) => {
        setSelectedAlbumId(album.id);
        navigate(`/album/${album.id}`, { state: { album } });
    };

    const handleSlide = (direction, section) => {
        const increment = direction === 'next' ? 3 : -3;
        switch (section) {
            case 'recommended':
                setStartIndex(prev => Math.max(0, Math.min(albums.length - 4, prev + increment)));
                break;
            case 'new':
                setStartIndexNew(prev => Math.max(0, Math.min(albums.length - 4, prev + increment)));
                break;
            case 'artists':
                setStartIndexArt(prev => Math.max(0, Math.min(artists.length - 4, prev + increment)));
                break;
            default:
                break;
        }
    };

    const renderAlbumCard = (album) => (
        <div key={album.id} onClick={() => handleAlbumClick(album)} style={{ flex: '0 0 calc(25%)' }}>
            <Card className="item" sx={{ maxWidth: 310 }}>
                <CardMedia
                    component="img"
                    alt={`${album.name} cover`}
                    image={album.image}
                    sx={{ aspectRatio: '1 / 1', padding: '15px' }}
                />
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {album.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            by {album.artist_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Genre: {album.genre}
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#1DA0C3',
                                fontWeight: 'bold',
                                marginTop: 1,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ fontSize: '16px', marginRight: '2px' }}>$</span>
                            {album.price ? album.price.toFixed(2) : 'N/A'}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h5">Cargando...</Typography>
            </Box>
        );
    }

    return (
        <div>
            <Grid container sx={{ marginTop: 0, color: 'white', minHeight: '300px' }} justifyContent="center">
                <Grid item xs={12} md={8} textAlign="center" sx={{ mt: 0, maxHeight: '550px' }}>
                    <Link to={`news/${noticia.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            borderRadius: '0px',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img src={imagen} alt={noticia.titulo} className="img-hover"
                                style={{ width: '100%', height: '100%', objectFit: 'fill', borderRadius: '0px' }}
                            />
                            <Typography variant="h6" sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '8px',
                                textAlign: 'left',
                            }}>
                                {noticia.titulo}
                            </Typography>
                        </Box>
                    </Link>
                </Grid>

                <Grid item xs={12} md={4} sx={{
                    mt: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                    <Link to={`/news/${noticia2.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Grid container sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            height: '50%',
                            maxHeight: '350px',
                        }}>
                            <img src={imagen2} alt={noticia2.titulo} className="img-hover"
                                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                            />
                            <Typography variant="h6" sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '8px',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                            }}>
                                {noticia2.titulo}
                            </Typography>
                        </Grid>
                    </Link>
                    <Link to={`/news/${noticia3.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Grid container sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            height: '50%',
                            maxHeight: '200px',
                        }}>
                            <img src={imagen3} alt={noticia3.titulo} className="img-hover"
                                style={{ width: '100%', height: '100%', objectFit: 'fill', maxHeight: '200px' }}
                            />
                            <Typography variant="h6" sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '8px',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                            }}>
                                {noticia3.titulo}
                            </Typography>
                        </Grid>
                    </Link>
                </Grid>
            </Grid>
            
            <Box className="envoltorio">
                <div className="featured-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
                        <h2>Recommended Selection</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="boton-carrusel" onClick={() => handleSlide('prev', 'recommended')}>{"<"}</button>
                            <button className="boton-carrusel" onClick={() => handleSlide('next', 'recommended')}>{">"}</button>
                        </div>
                    </div>

                    <div style={{ overflow: 'hidden', width: '100%' }}>
                        <div className="album-list" style={{ 
                            display: 'flex', 
                            gap: '10px',
                            transform: `translateX(-${(startIndex * 100) / 4}%)`,
                            transition: 'transform 0.5s ease-in-out' 
                        }}>
                            {albums.map(renderAlbumCard)}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
                        <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
                            <h6>Ver más</h6>
                        </Link>
                    </div>
                </div>
            </Box>

            <Box className="envoltorio">
                <div className="featured-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
                        <h2>New Albums</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="boton-carrusel" onClick={() => handleSlide('prev', 'new')}>{"<"}</button>
                            <button className="boton-carrusel" onClick={() => handleSlide('next', 'new')}>{">"}</button>
                        </div>
                    </div>

                    <div style={{ overflow: 'hidden', width: '100%' }}>
                        <div className="album-list" style={{ 
                            display: 'flex', 
                            gap: '10px',
                            transform: `translateX(-${(startIndexNew * 100) / 4}%)`,
                            transition: 'transform 0.5s ease-in-out' 
                        }}>
                            {albums.map(renderAlbumCard)}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
                        <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
                            <h6>Ver más</h6>
                        </Link>
                    </div>
                </div>
            </Box>
            
            <Box className="envoltorio">
                <div className="featured-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
                        <h2>Discover Our Best Artists</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="boton-carrusel" onClick={() => handleSlide('prev', 'artists')}>{"<"}</button>
                            <button className="boton-carrusel" onClick={() => handleSlide('next', 'artists')}>{">"}</button>
                        </div>
                    </div>

                    <div className="album-list">
                        {artists.map((artist) => (
                            <Link to={`/artistProfile/${artist.id}`} key={artist.id} style={{ textDecoration: 'none' }}>
                                <Card className="item" sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        image={artist.profileImage}
                                        alt={`${artist.name} profile`}
                                        sx={{ aspectRatio: '1 / 1', padding: '25px' }}
                                    />
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {artist.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Genre: {artist.genre}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
                        <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
                            <h6>Ver más</h6>
                        </Link>
                    </div>
                </div>
            </Box>

            {!user && (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <h5 style={{ fontSize: '1rem', color: '#333', marginBottom: '10px' }}>
                        ¿Te gusta Bandcamp? Registrate y disfruta de la experiencia completa
                    </h5>
                    <Link to="/register">
                        <button className='boton-registro'>
                            Registrarse
                        </button>
                    </Link>
                </div>
            )}

            <div style={{ textAlign: 'start-flex', marginTop: '40px', marginLeft:'30px', marginBottom: '20px' }}>
                <Link to="/explore">
                    <h5 style={{ fontSize: '1rem', color: '#1DA1C3', marginBottom: '5px' }}>
                        CONTINÚA EXPLORANDO
                    </h5>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;