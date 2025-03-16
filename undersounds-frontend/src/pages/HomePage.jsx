import React, { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import albums from '../mockData/albums';
import artists from '../mockData/artists';
import '../styles/homePage.css';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider, Typography, Box, Card, CardActions, CardContent, CardMedia, CardActionArea } from '@mui/material';
import noticiasMusica from '../mockData/noticiasMusica'; // Asegúrate de que la ruta sea correcta
import imagen from '../assets/images/images2.webp';
import imagen2 from '../assets/images/imagen2.jpeg';
import imagen3 from '../assets/images/images3.webp'; //arreglar esto, provisional. No consigo que cargue las imgs desde imagen.urlimagen
import albumP from '../assets/images/albumPrueba.jpeg'; //arreglar esto, provisional. No consigo que cargue las imgs desde imagen.urlimagen





const HomePage = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const noticia = noticiasMusica[0];
    const noticia2 = noticiasMusica[1];
    const noticia3 = noticiasMusica[2]; 

    const handleSearch = (query) => {
        if (!query.trim()) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);
        const lowerCaseQuery = query.toLowerCase();
        
        // Filtrar álbumes basados en el título, artista o género
        const results = albums.filter(album => 
            album.title.toLowerCase().includes(lowerCaseQuery) ||
            album.artist.toLowerCase().includes(lowerCaseQuery) ||
            album.genre.toLowerCase().includes(lowerCaseQuery)
        );
        
        setSearchResults(results);
    };

    // Limpiar la búsqueda
    const clearSearch = () => {
        setSearchResults(null);
        setIsSearching(false);
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
                            height: '100%', // Esto hace que ocupe toda la altura disponible
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
                            objectFit: 'fill', // Ajuste para no distorsionar la imagen
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
                flexDirection: 'column', // Esto permite organizar las filas verticalmente
                height: '100%', // Hace que ocupe todo el espacio disponible
                }}
            >   <Link to={`/news/${noticia2.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {/* Primera fila */}
                    <Grid
                        container
                        sx={{
                            flex: 1, // Hace que esta fila ocupe la mitad de la altura
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative', // Esto asegura que el texto se posicione relativo al contenedor de la imagen
                            height: '50%', // Hace que esta fila ocupe el 50% del espacio vertical disponible
                        }}
                        >
                        <img
                            src={imagen2} // Ruta de la imagen de la noticia
                            alt={noticia2.titulo} // Título de la noticia como alt
                            className="img-hover"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'fill', // Ajuste para no distorsionar la imagen
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
                            fontSize: '0.8rem', // Ajusta este valor según necesites
                            }}
                        >
                            {noticia2.titulo}
                        </Typography>
                    </Grid>
                </Link>
                {/* Segunda fila */}
                <Link to={`/news/${noticia3.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Grid
                        container
                        sx={{
                            flex: 1, // Hace que esta fila ocupe la otra mitad de la altura
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            height: '50%', // Asegura que esta fila ocupe la otra mitad
                        }}
                        >
                        <img
                            src={imagen3} // Ruta de la imagen de la noticia
                            alt={noticia3.titulo} // Título de la noticia como alt
                            className="img-hover"
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ajuste para no distorsionar la imagen
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
                            fontSize: '0.8rem', // Ajusta este valor según necesites
                            }}
                        >
                            {noticia3.titulo}
                        </Typography>
                    </Grid>
                </Link>
            </Grid>
        </Grid>

        
        
            
                {/* Mostrar contenido normal de la página */}

                <div className="featured-section">
                    <div className="featured-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Albumes Destacados</h2>
                        <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', }}>
                            <h6>Ver más</h6>
                        </Link>
                    </div>
                    
                    <div className="album-list">
                        {albums.map((album) => (
                        <Link to={`/album/${album.id}`} key={album.id} >
                            <Card className="item"sx={{ maxWidth: 345}} >
                            
                                <CardMedia
                                component="img"
                                alt={`${album.title} cover`}
                                
                                image={album.coverImage}
                                sx={{ aspectRatio: '1 / 1', padding: '25px'}}
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
                        </Link>
                        ))}
                    </div>

                </div>

                <div className="featured-section">
                    <div className="featured-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Nuevos Albumes</h2>
                        <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', }}>
                            <h6>Ver más</h6>
                        </Link>
                    </div>
                    
                    <div className="album-list">
                        {albums.map((album) => (
                        <Link to={`/album/${album.id}`} key={album.id} >
                            <Card className="item" sx={{ maxWidth: 345}} >
                            
                                <CardMedia
                                component="img"
                                alt={`${album.title} cover`}
                                
                                image={album.coverImage}
                                sx={{ aspectRatio: '1 / 1', padding: '25px'}}
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
                        </Link>
                        ))}
                    </div>
                </div>
                
                <div className="featured-section">
                    <div className="featured-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Artistas destacados</h2>
                        <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', }}>
                            <h6>Ver más</h6>
                        </Link>
                    </div>
                    
                    <div className="album-list">
                        {artists.map((artist) => (
                            
                            <Link to={`/artistProfile/${artist.id}`} key={artist.id} style={{ textDecoration: 'none' }}>
                            <Card className="item" sx={{ maxWidth: 345}} >
                            
                                <CardMedia
                                
                                sx={{ aspectRatio: '1 / 1', padding: '25px'}}
                                />
                                <CardActionArea>
                                <CardContent>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Genre: {artist.name}
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