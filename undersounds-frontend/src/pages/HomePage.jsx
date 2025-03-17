import React, { useContext, useState } from 'react';
import albums from '../mockData/albums';
import artists from '../mockData/artists';
import '../styles/homePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import noticiasMusica from '../mockData/noticiasMusica'; // Asegúrate de que la ruta sea correcta
import { AlbumContext } from '../context/AlbumContext';
import imagen from '../assets/images/images2.webp';
import imagen2 from '../assets/images/imagen2.jpeg';
import imagen3 from '../assets/images/images3.webp'; //arreglar esto, provisional. No consigo que cargue las imgs desde imagen.urlimagen

const HomePage = () => {

    const noticia = noticiasMusica[0];
    const noticia2 = noticiasMusica[1];
    const noticia3 = noticiasMusica[2];

    const { setSelectedAlbumId } = useContext(AlbumContext);
    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        setSelectedAlbumId(albumId);
        navigate(`/album/${albumId}`);
    };

    return (
        <div className="homepage">
            <Grid
                container
                sx={{
                    margin: 0,
                    color: 'white',
                    minHeight: '300px', // Controla la altura mínima
                }}
                justifyContent="center"
            >
                {/* Primera columna (65%) */}
                <Grid item xs={12} md={8} textAlign="center" sx={{ mt: 2 }}>
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
                        mt: 2,
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
                            }}
                        >
                            <img
                                src={imagen3}
                                alt={noticia3.titulo}
                                className="img-hover"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
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

            {/* Sección de Albumes Destacados */}
            <div className="featured-section">
                <div className="featured-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2>Albumes Destacados</h2>
                    <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc' }}>
                        <h6>Ver más</h6>
                    </Link>
                </div>

                <div className="album-list">
                    {albums.map((album) => (
                        <div key={album.id} className="album-item" onClick={() => handleAlbumClick(album.id)}>
                            <Card className="item" sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt={`${album.title} cover`}
                                    image={album.coverImage}
                                    sx={{ aspectRatio: '1 / 1', padding: '25px' }}
                                />
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {album.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            by {album.artist}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Genre: {album.genre}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            ${album.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de Nuevos Albumes */}
            <div className="featured-section">
                <div className="featured-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2>Nuevos Albumes</h2>
                    <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc' }}>
                        <h6>Ver más</h6>
                    </Link>
                </div>

                <div className="album-list">
                    {albums.map((album) => (
                        <div key={album.id} className="album-item" onClick={() => handleAlbumClick(album.id)}>
                            <Card className="item" sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt={`${album.title} cover`}
                                    image={album.coverImage}
                                    sx={{ aspectRatio: '1 / 1', padding: '25px' }}
                                />
                                <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {album.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            by {album.artist}
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

            {/* Sección de Artistas Destacados */}
            <div className="featured-section">
                <div
                    className="featured-section"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                    }}
                >
                    <h2>Artistas destacados</h2>
                    <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc' }}>
                        <h6>Ver más</h6>
                    </Link>
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
            </div>
        </div>
    );
};

export default HomePage;