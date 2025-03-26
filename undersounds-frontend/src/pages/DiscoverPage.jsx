import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    CardActionArea,
} from "@mui/material";
import albums from "../mockData/albums";
import artists from "../mockData/artists";
import tshirts from "../mockData/tshirts";
import { AlbumContext } from "../context/AlbumContext";

const DiscoverPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialFilter = query.get("filter") || "all";
    const [selectedFilter, setSelectedFilter] = useState(initialFilter);
    const [selectedGenre, setSelectedGenre] = useState(initialFilter); // Track the selected genre
    const navigate = useNavigate();
    const { setSelectedAlbumId } = useContext(AlbumContext);

    const genreCarouselRef = useRef(null);

    const scrollLeft = () => {
        genreCarouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollRight = () => {
        genreCarouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    // Synchronize the query parameter with the internal state when the location changes
    useEffect(() => {
        const filterParam = query.get("filter") || "all";
        setSelectedFilter(filterParam);
        setSelectedGenre(filterParam); // Ensure the genre is also updated
    }, [location.search, query]);

    const handleAlbumClick = (album) => {
        navigate(`/album/${album.id}`, { state: { album } });
    };

    const handleTshirtClick = (tshirtId) => {
        navigate(`/tshirt/${tshirtId}`);
    };

    // Change filter when a genre button is clicked
    const handleGenreFilterChange = (newFilter) => {
        setSelectedFilter(newFilter);
        setSelectedGenre(newFilter); // Update the selected genre when the button is clicked
        navigate(`/discover?filter=${newFilter}`);
    };

    const specialFilters = ["vinyl", "cds", "cassettes", "tshirts"];
    
    let filteredAlbums = [];
    let filteredArtists = [];
    let filteredTshirts = [];

    if (selectedFilter === "all") {
        filteredAlbums = albums;
        filteredArtists = artists;
        filteredTshirts = [];
    } else if (specialFilters.includes(selectedFilter)) {
        if (selectedFilter === "vinyl") {
            filteredAlbums = albums.filter((album) => album.vinyl === true);
        } else if (selectedFilter === "cds") {
            filteredAlbums = albums.filter((album) => album.cd === true);
        } else if (selectedFilter === "cassettes") {
            filteredAlbums = albums.filter((album) => album.cassettes === true);
        } else if (selectedFilter === "tshirts") {
            filteredTshirts = tshirts;
        }
    } else {
        filteredAlbums = albums.filter(
            (album) => album.genre.toLowerCase() === selectedFilter.toLowerCase()
        );
        filteredArtists = artists.filter(
            (artist) => artist.genre.toLowerCase() === selectedFilter.toLowerCase()
        );
    }

    const genres = [
        "all", "ambient", "electronic", "pop", "rock", "jazz", "classical",
        "hiphop", "blues", "reggae", "metal", "indie", "folk", "latin",
        "country", "techno", "house", "trance", "dubstep", "soul", "rnb",
        "punk", "electropop", "synthwave", "dancehall", "grunge", "disco", 
        "trap", "bluesrock", "housemusic", "dub", "newwave", "hardrock", "chillwave"
    ];

    // Estilo en línea para el carrusel de géneros (sin archivo CSS externo)
    const genreCarouselStyle = {
        display: "flex",
        overflowX: "auto",
        scrollBehavior: "smooth",
        gap: "10px",
        padding: "10px 0",
        backgroundColor: "#4F6872",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        flex: 1,
        // Propiedades para ocultar scrollbar en IE/Edge y Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none",
    };

    return (
        <div>
            {(!specialFilters.includes(selectedFilter) || selectedFilter === "all") && (
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <button
                        onClick={scrollLeft}
                        style={{
                            backgroundColor: "#1DA0C3",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            marginRight: "10px",
                        }}
                    >
                        {"<"}
                    </button>
                    <div ref={genreCarouselRef} style={genreCarouselStyle}>
                        {genres.map((genre) => (
                            <Button
                                key={genre}
                                variant="contained"
                                onClick={() => handleGenreFilterChange(genre)}
                                sx={{
                                    mx: 1, // Separación horizontal reducida
                                    backgroundColor: selectedGenre === genre ? '#1DA0C3' : '#ffffff',
                                    color: selectedGenre === genre ? 'white' : '#333333',
                                    minWidth: '120px',
                                    height: '36px',
                                    textTransform: 'capitalize',
                                    fontWeight: selectedGenre === genre ? 'bold' : 'normal',
                                    '&:hover': {
                                        backgroundColor: selectedGenre === genre ? '#1788a3' : '#e0e0e0',
                                    },
                                }}
                            >
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </Button>
                        ))}
                    </div>
                    <button
                        onClick={scrollRight}
                        style={{
                            backgroundColor: "#1DA0C3",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            marginLeft: "10px",
                        }}
                    >
                        {">"}
                    </button>
                </div>
            )}
            <Grid container spacing={2}>
                {filteredAlbums.map((album) => (
                    <Grid item xs={12} sm={6} md={4} key={album.id}>
                        <Card 
                            sx={{ 
                                borderRadius: "12px", 
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", 
                                transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
                                transform: "scale(0.95)", 
                                "&:hover": { 
                                    transform: "scale(1.02)", 
                                    filter: "brightness(0.8)" 
                                } 
                            }}
                        >
                            <CardActionArea onClick={() => handleAlbumClick(album)}>
                                <CardMedia
                                    component="img"
                                    alt={`${album.title} cover`}
                                    image={album.coverImage}
                                    sx={{ 
                                        aspectRatio: "1 / 1", 
                                        padding: "20px",
                                        borderRadius: "12px 12px 0 0"
                                    }}
                                />
                                <CardContent sx={{ textAlign: "center", backgroundColor: "#fafafa" }}>
                                    <Typography 
                                        gutterBottom 
                                        variant="h6" 
                                        sx={{ fontWeight: "bold", color: "#333" }}
                                    >
                                        {album.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: "#555", fontStyle: "italic", marginBottom: "5px" }}
                                    >
                                        by {album.artist}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: "#777", fontWeight: "500" }}
                                    >
                                        Genre: {album.genre}
                                    </Typography>
                                    {(selectedFilter === "vinyl" || selectedFilter === "cds" || selectedFilter === "cassettes") && (
                                        <Typography 
                                            variant="h6" 
                                            sx={{ color: "#1976d2", fontWeight: "bold", marginTop: "8px" }}
                                        >
                                            ${album.price.toFixed(2)}
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                {filteredArtists.map((artist) => (
                    <Grid item xs={12} sm={6} md={4} key={artist.id}>
                        <Card 
                            sx={{ 
                                borderRadius: "12px", 
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", 
                                transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
                                transform: "scale(0.95)",
                                marginBottom: "30px", 
                                "&:hover": { 
                                    transform: "scale(1.02)", 
                                    filter: "brightness(0.8)"  
                                } 
                            }}
                        >
                            <CardActionArea onClick={() => navigate(`/artistProfile/${artist.id}`)}>
                                <CardMedia
                                    component="img"
                                    alt={`${artist.name} profile`}
                                    image={artist.profileImage}
                                    sx={{ aspectRatio: "1 / 1", padding: "20px", borderRadius: "12px 12px 0 0" }}
                                />
                                <CardContent sx={{ textAlign: "center", backgroundColor: "#fafafa" }}>
                                    <Typography 
                                        gutterBottom 
                                        variant="h6" 
                                        sx={{ fontWeight: "bold", color: "#333" }}
                                    >
                                        {artist.name}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: "#777", fontWeight: "500" }}
                                    >
                                        Genre: {artist.genre}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                {filteredTshirts.map((tshirt) => (
                    <Grid item xs={12} sm={6} md={4} key={tshirt.id}>
                        <Card 
                            sx={{ 
                                borderRadius: "12px", 
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", 
                                transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
                                transform: "scale(0.95)",
                                marginBottom: "30px", 
                                "&:hover": { 
                                    transform: "scale(1.02)", 
                                    filter: "brightness(0.8)" 
                                } 
                            }}
                        >
                            <CardActionArea onClick={() => handleTshirtClick(tshirt.id)}>
                                <CardMedia
                                    component="img"
                                    alt={`${tshirt.name} shirt`}
                                    image={tshirt.tshirtImage}
                                    sx={{ aspectRatio: "1 / 1", padding: "20px", borderRadius: "12px 12px 0 0" }}
                                />
                                <CardContent sx={{ textAlign: "center", backgroundColor: "#fafafa" }}>
                                    <Typography 
                                        gutterBottom 
                                        variant="h6" 
                                        sx={{ fontWeight: "bold", color: "#333" }}
                                    >
                                        {tshirt.name}
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ color: "#1976d2", fontWeight: "bold", marginTop: "8px" }}
                                    >
                                        ${tshirt.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DiscoverPage;