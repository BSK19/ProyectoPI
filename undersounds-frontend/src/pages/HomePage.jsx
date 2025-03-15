import React, { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import albums from '../mockData/albums';
import '../styles/homePage.css';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider, Typography, Box } from '@mui/material';
import noticiasMusica from '../mockData/noticiasMusica'; // Asegúrate de que la ruta sea correcta

const HomePage = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const noticia = noticiasMusica[0]; 

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

            margin: 0, // Elimina cualquier margen extra
            backgroundColor: '#1da0c3', // Color de fondo
            color: 'white', // Color del texto

        }}
        justifyContent="center" // Centra el contenido horizontalmente
        >

            {/* Aquí mostramos la imagen y el título de la noticia */}
            <Grid item xs={12} sm={6} md={4} textAlign="center" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                        src={noticia.imagen} // Ruta de la imagen de la noticia
                        alt={noticia.titulo} // Título de la noticia como alt (solo para accesibilidad)
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {noticia.titulo} {/* Título de la noticia que se muestra en la UI */}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
            
            <SearchBar onSearch={handleSearch} />
            
            {/* Mostrar resultados de búsqueda cuando existan */}
            {isSearching && (
                <div className="search-results">
                    <div className="search-header">
                        <h2>Search Results</h2>
                        <button className="clear-search" onClick={clearSearch}>Clear Search</button>
                    </div>
                    
                    {searchResults && searchResults.length > 0 ? (
                        <div className="album-list">
                            {searchResults.map(album => (
                                <Link to={`/album/${album.id}`} key={album.id} className="album-item">
                                    <img src={album.coverImage || '/assets/images/default-cover.jpg'} 
                                        alt={`${album.title} cover`} 
                                        className="album-cover" />
                                    <div className="album-info">
                                        <h3 className="album-title">{album.title}</h3>
                                        <p className="album-artist">by {album.artist}</p>
                                        <span className="album-genre">{album.genre}</span>
                                        <span className="album-price">${album.price.toFixed(2)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="no-results">No albums found matching your search.</p>
                    )}
                </div>
            )}
            
            {/* Mostrar contenido normal de la página cuando no se está buscando */}
            {!isSearching && (
                <>
                    <div className="featured-section">
                        <h2>Featured Albums</h2>
                        <div className="album-list">
                            {albums.map(album => (
                                <Link to={`/album/${album.id}`} key={album.id} className="album-item">
                                    <img src={album.coverImage || '/assets/images/default-cover.jpg'} 
                                        alt={`${album.title} cover`} 
                                        className="album-cover" />
                                    <div className="album-info">
                                        <h3 className="album-title">{album.title}</h3>
                                        <p className="album-artist">by {album.artist}</p>
                                        <span className="album-genre">{album.genre}</span>
                                        <span className="album-price">${album.price.toFixed(2)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="featured-section">
                        <h2>New Releases</h2>
                        <div className="album-list">
                            {albums.slice(0, 4).map(album => (
                                <Link to={`/album/${album.id}`} key={album.id} className="album-item">
                                    <img src={album.coverImage || '/assets/images/default-cover.jpg'} 
                                        alt={`${album.title} cover`} 
                                        className="album-cover" />
                                    <div className="album-info">
                                        <h3 className="album-title">{album.title}</h3>
                                        <p className="album-artist">by {album.artist}</p>
                                        <span className="album-genre">{album.genre}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;