import React, { useState, useEffect, useContext } from "react";
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
    const [selectedGenre, setSelectedGenre] = useState(initialFilter);  // Track the selected genre
    const navigate = useNavigate();
    const { setSelectedAlbumId } = useContext(AlbumContext);

    // Synchronize the query parameter with the internal state when the location changes
    useEffect(() => {
        const filterParam = query.get("filter") || "all";
        setSelectedFilter(filterParam);
        setSelectedGenre(filterParam);  // Ensure the genre is also updated
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
        setSelectedGenre(newFilter);  // Update the selected genre when the button is clicked
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

    return (
        <div>
            {(!specialFilters.includes(selectedFilter) || selectedFilter === "all") && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap",
                        marginBottom: "20px",
                        width: "100%",
                        backgroundColor: "#afafaf",
                        padding: "20px 5px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.8)", // Sombra en la parte inferior
                    }}>
                    {genres.map((genre) => (
                        <Button
                            key={genre}
                            variant="contained"
                            onClick={() => handleGenreFilterChange(genre)}
                            style={{
                                backgroundColor: selectedGenre === genre ? '#555' : '#1DA0C3',
                                color: 'white',
                                margin: '5px',
                            }}
                        >
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </Button>
                    ))}
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
                                    €{tshirt.price.toFixed(2)}
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
