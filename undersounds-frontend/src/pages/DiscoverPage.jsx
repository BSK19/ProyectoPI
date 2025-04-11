import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, Grid, CardActionArea } from "@mui/material";
import { fetchAlbums, fetchArtists } from '../services/jamendoService';
import { AlbumContext } from "../context/AlbumContext";
import { merchService } from '../services/merchandisingService'; // Importa el servicio de merchandising

const DiscoverPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialFilter = query.get("filter") || "all";
    const [selectedFilter, setSelectedFilter] = useState(initialFilter);
    const [selectedGenre, setSelectedGenre] = useState(initialFilter); // Track the selected genre
    const navigate = useNavigate();
    const { setSelectedAlbumId } = useContext(AlbumContext);

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [merch, setMerch] = useState([]); // Para almacenar las camisetas

    const genreCarouselRef = useRef(null);

    const scrollLeft = () => {
        genreCarouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollRight = () => {
        genreCarouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const albumsData = await fetchAlbums();
                setAlbums(albumsData);
            } catch (error) {
                console.error("Error fetching data from Jamendo:", error);
            }
        };
        loadData();
    }, []);

    // Cargar las camisetas cuando se seleccione el filtro "tshirts"
    useEffect(() => {
        const loadMerch = async () => {
            try {
                const merchData = await merchService.getAllMerch();
                setMerch(merchData);
            } catch (error) {
                console.error("Error fetching merch:", error);
            }
        };
        loadMerch();
    }, []);

    useEffect(() => {
        const filterParam = query.get("filter") || "all";
        setSelectedFilter(filterParam);
        setSelectedGenre(filterParam); // Ensure the genre is also updated
    }, [location.search]); // query depende de location.search

    const handleAlbumClick = (album) => {
        navigate(`/album/${album.id}`, { state: { album } });
    };
    
    const handleTshirtClick = (tshirt_Id) => {
        navigate(`/tshirt/${tshirt_Id}`);
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
    let filteredMerch = [];

    if (selectedFilter === "all") {
        filteredAlbums = albums;
        filteredArtists = artists;
        filteredMerch = merch;
    } else if (specialFilters.includes(selectedFilter)) {
        if (selectedFilter === "vinyl") {
            filteredMerch = merch.filter((merch) => merch.type === 0);
        } else if (selectedFilter === "cds") {
            filteredMerch = merch.filter((merch) => merch.type === 1);
        } else if (selectedFilter === "cassettes") {
            filteredMerch = merch.filter((merch) => merch.type === 2);
        } else if (selectedFilter === "tshirts") {
            filteredMerch = merch.filter((merch) => merch.type === 3);
        }
    } else {
        filteredAlbums = albums.filter(
            (album) => album.genre.toLowerCase() === selectedFilter.toLowerCase()
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
        msOverflowStyle: "none", // Propiedades para ocultar scrollbar
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
                                    mx: 1,
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
                                    filter: "brightness(0.8)",
                                }
                            }}
                        >
                            <CardActionArea onClick={() => handleAlbumClick(album)}>
                                <CardMedia
                                    component="img"
                                    alt={`${album.name} cover`}
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

                {filteredMerch.map((merch) => (
                    <Grid item xs={12} sm={6} md={4} key={merch.id}>
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
                            <CardActionArea onClick={() => handleTshirtClick(merch._id)}>
                                <CardMedia
                                    component="img"
                                    alt={`${merch.name} shirt`}
                                    image={merch.image}
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
                                        {merch.name}
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ color: "#1976d2", fontWeight: "bold", marginTop: "8px" }}
                                    >
                                        ${merch.price.toFixed(2)}
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