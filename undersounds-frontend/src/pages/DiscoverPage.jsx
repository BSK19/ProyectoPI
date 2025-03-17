import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import albums from '../mockData/albums';
import artists from '../mockData/artists';
import { Card, CardMedia, CardContent, Typography, Grid, Button, CardActionArea } from '@mui/material';
import { AlbumContext } from '../context/AlbumContext';

const DiscoverPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const filter = query.get('filter');
    const navigate = useNavigate();
    const { setSelectedAlbumId } = useContext(AlbumContext);

    const [selectedFilter, setSelectedFilter] = useState(filter || 'all');

    const handleFilterChange = (newFilter) => {
        setSelectedFilter(newFilter);
    };

    const handleAlbumClick = (albumId) => {
        setSelectedAlbumId(albumId);
        navigate(`/album/${albumId}`);
    };

    const filteredAlbums = selectedFilter === 'all' ? albums : albums.filter(album => album.genre.toLowerCase() === selectedFilter.toLowerCase());
    const filteredArtists = selectedFilter === 'all' ? artists : artists.filter(artist => artist.genre.toLowerCase() === selectedFilter.toLowerCase());

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button variant="contained" onClick={() => handleFilterChange('all')}>All</Button>
                <Button variant="contained" onClick={() => handleFilterChange('ambient')}>Ambient</Button>
                <Button variant="contained" onClick={() => handleFilterChange('electronic')}>Electronic</Button>
                <Button variant="contained" onClick={() => handleFilterChange('pop')}>Pop</Button>
            </div>
            <Grid container spacing={2}>
                {filteredAlbums.map(album => (
                    <Grid item xs={12} sm={6} md={4} key={album.id}>
                        <Card>
                            <CardActionArea onClick={() => handleAlbumClick(album.id)}>
                                <CardMedia
                                    component="img"
                                    alt={`${album.title} cover`}
                                    image={album.coverImage}
                                    sx={{ aspectRatio: '1 / 1', padding: '25px' }}
                                />
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
                    </Grid>
                ))}
                {filteredArtists.map(artist => (
                    <Grid item xs={12} sm={6} md={4} key={artist.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt={`${artist.name} profile`}
                                image={artist.profileImage}
                                sx={{ aspectRatio: '1 / 1', padding: '25px' }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {artist.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Genre: {artist.genre}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DiscoverPage;