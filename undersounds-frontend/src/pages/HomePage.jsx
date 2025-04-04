import React, { useContext, useState, useEffect} from 'react';
import albums from '../mockData/albums';
import artists from '../mockData/artists';
import '../styles/homePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Card, CardContent, CardMedia, CardActionArea, Button } from '@mui/material';
import noticiasMusica from '../mockData/noticiasMusica'; // Asegúrate de que la ruta sea correcta
import { AlbumContext } from '../context/AlbumContext';
import imagen from '../assets/images/images2.webp';
import imagen2 from '../assets/images/imagen2.jpeg';
import imagen3 from '../assets/images/images3.webp'; //arreglar esto, provisional. No consigo que cargue las imgs desde imagen.urlimagen
import { AuthContext } from '../context/AuthContext';
import {fetchAlbums} from '../services/jamendoService.js'


const HomePage = () => {

    const noticia = noticiasMusica[0];
    const noticia2 = noticiasMusica[1];
    const noticia3 = noticiasMusica[2];

    const { setSelectedAlbumId } = useContext(AlbumContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAlbumClick = (album) => {
        setSelectedAlbumId(album.id);
        navigate(`/album/${album.id}`, { state: { album } });
    };

    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const loadAlbums = async () => {
            try {
                const fetchedAlbums = await fetchAlbums();
                setAlbums(fetchedAlbums); // Actualiza el estado con los datos de Jamendo
            } catch (error) {
                console.error('Error fetching albums:', error);
            }
        };
        loadAlbums();
    }, []);

    const [startIndex, setStartIndex] = useState(0); // Índice del primer álbum visible
    const [startIndexNew, setStartIndexNew] = useState(0); // Índice del primer álbum visible
    const [startIndexArt, setStartIndexArt] = useState(0); // Índice del primer álbum visible
    
    const itemsPerPage = 4; // Mostrar solo 4 álbumes a la vez

    const nextSlide = () => {
        if (startIndex + itemsPerPage < albums.length) {
            setStartIndex(startIndex + itemsPerPage);
        }
    };

    const prevSlide = () => {
        if (startIndex - itemsPerPage >= 0) {
            setStartIndex(startIndex - itemsPerPage);
        }
    };

    const nextSlideNew = () => {
        if (startIndexNew + itemsPerPage < albums.length) {
            setStartIndexNew(startIndexNew + itemsPerPage);
        }
    };

    const prevSlideNew = () => {
        if (startIndexNew - itemsPerPage >= 0) {
            setStartIndexNew(startIndexNew - itemsPerPage);
        }
    };

    
    const nextSlideArt = () => {
        if (startIndexNew + itemsPerPage < albums.length) {
            setStartIndexNew(startIndexNew + itemsPerPage);
        }
    };

    const prevSlideArt = () => {
        if (startIndexArt - itemsPerPage >= 0) {
            setStartIndexArt(startIndexArt - itemsPerPage);
        }
    };

    

    return (
        <div>
            <Grid
                container
                sx={{
                    marginTop: 0,
                    color: 'white',
                    minHeight: '300px', // Controla la altura mínima
                }}
                justifyContent="center"
            >
                {/* Primera columna (65%) */}
                <Grid item xs={12} md={8} textAlign="center" sx={{ mt: 0, maxHeight: '550px',  }}>
                    <Link to={`news/${noticia.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%', // Ocupa toda la altura disponible
                                overflow: 'hidden',
                                borderRadius: '0px',
                                backgroundColor: '#000', // Fondo negro para evitar espacios vacíos
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src={imagen}
                                alt={noticia.titulo}
                                className="img-hover"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'fill',
                                    borderRadius: '0px',
                                }}
                            />
                            {/* Texto sobre la imagen */}
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'left',
                                }}
                            >
                                {noticia.titulo}
                            </Typography>
                        </Box>
                    </Link>
                </Grid>

                {/* Segunda columna (35%) */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        mt: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Link to={`/news/${noticia2.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {/* Primera fila */}
                        <Grid
                            container
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                height: '50%',
                                maxHeight: '350px',
                            }}
                        >
                            <img
                                src={imagen2}
                                alt={noticia2.titulo}
                                className="img-hover"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'fill',
                                }}
                            />
                            {/* Texto sobre la imagen */}
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {noticia2.titulo}
                            </Typography>
                        </Grid>
                    </Link>
                    <Link to={`/news/${noticia3.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {/* Segunda fila */}
                        <Grid
                            container
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                height: '50%',
                                maxHeight: '200px',
                            }}
                        >
                            <img
                                src={imagen3}
                                alt={noticia3.titulo}
                                className="img-hover"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'fill',
                                    maxHeight: '200px',
                                }}
                            />
                            {/* Texto sobre la imagen */}
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {noticia3.titulo}
                            </Typography>
                        </Grid>
                    </Link>
                </Grid>
            </Grid>
            
        <Box className="envoltorio">
            {/* Sección de Álbumes Destacados */}
            <div className="featured-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
                    <h2>Recommended Selection</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="boton-carrusel"
                        onClick={() => setStartIndex(Math.max(0, startIndex - 3))}>
                        {"<"}
                    </button>
                        <button className="boton-carrusel"
                            onClick={() => setStartIndex(Math.min(albums.length - 4, startIndex + 3))} >
                            {">"}
                        </button>
                    </div>
                </div>

                {/* Carrusel con Animación */}
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div 
                        className="album-list" 
                        style={{ 
                            display: 'flex', 
                            gap: '10px', // Ajusta el espacio entre las tarjetas
                            transform: `translateX(-${(startIndex * 100) / 4}%)`, // Asegura que las tarjetas se deslicen correctamente
                            transition: 'transform 0.5s ease-in-out' 
                        }}
                    >
                        
                        {albums.map((album) => (
                            <div key={album.id} onClick={() => handleAlbumClick(album)} style={{ flex: '0 0 calc(25%)' }}> {/* Asegura que cada tarjeta ocupe un 25% */}
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
                                            
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Link "Ver más" alineado a la derecha */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
                    <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
                        <h6>Ver más</h6>
                    </Link>
                </div>
            </div>
        </Box>

        {/* Sección de Nuevos Albumes */}
        <Box className="envoltorio">
            {/* Sección de Álbumes Destacados */}
            <div className="featured-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
                    <h2>New Albums</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="boton-carrusel"
                        onClick={() => setStartIndexNew(Math.max(0, startIndexNew - 3))}>
                        {"<"}
                    </button>
                        <button className="boton-carrusel"
                            onClick={() => setStartIndexNew(Math.min(albums.length - 4, startIndexNew + 3))} >
                            {">"}
                        </button>
                    </div>
                </div>

                {/* Carrusel con Animación */}
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div 
                        className="album-list" 
                        style={{ 
                            display: 'flex', 
                            gap: '10px', // Ajusta el espacio entre las tarjetas
                            transform: `translateX(-${(startIndexNew * 100) / 4}%)`, // Asegura que las tarjetas se deslicen correctamente
                            transition: 'transform 0.5s ease-in-out' 
                        }}
                    >
                        {albums.map((album) => (
                            <div key={album.id} onClick={() => handleAlbumClick(album)} style={{ flex: '0 0 calc(25%)' }}> {/* Asegura que cada tarjeta ocupe un 25% */}
                                <Card className="item" sx={{ maxWidth: 310 }}>
                                    <CardMedia
                                        component="img"
                                        alt={`${album.title} cover`}
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
                                            
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Link "Ver más" alineado a la derecha */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
                    <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
                        <h6>Ver más</h6>
                    </Link>
                </div>
            </div>
        </Box>
        
        <Box className="envoltorio">
            {/* Sección de Artistas Destacados */}
            <div className="featured-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
                    <h2>Discover Our Best Artists</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="boton-carrusel"
                        onClick={() => setStartIndexArt(Math.max(0, startIndexNew - 3))}>
                        {"<"}
                    </button>
                        <button className="boton-carrusel"
                            onClick={() => setStartIndexArt(Math.min(albums.length - 4, startIndexNew + 3))} >
                            {">"}
                        </button>
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
                
                {/* Link "Ver más" alineado a la derecha */}
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