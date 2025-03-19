import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  CardActionArea,
} from "@mui/material";
import albums from "../mockData/albums";
import artists from "../mockData/artists";
import tshirts from "../mockData/tshirts";
import { AlbumContext } from "../context/AlbumContext";

const DiscoverPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  // Filtro inicial (query param enviado desde Navigation.jsx) o "all"
  const initialFilter = query.get("filter") || "all";
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const navigate = useNavigate();
  const { setSelectedAlbumId } = useContext(AlbumContext);

  // Sincronizamos el query param con el estado interno cuando cambia la ubicación
  useEffect(() => {
    const filterParam = query.get("filter") || "all";
    setSelectedFilter(filterParam);
  }, [location.search, query]);

  // Al hacer click en un álbum se pasa el objeto album en el state
  const handleAlbumClick = (album) => {
    // Si usas setSelectedAlbumId para otros fines, puedes conservarlo;
    // pero aquí nos aseguramos de pasar el objeto album al navegar.
    navigate(`/album/${album.id}`, { state: { album } });
  };

  const handleTshirtClick = (tshirtId) => {
    navigate(`/tshirt/${tshirtId}`);
  };

  // Cambio de filtro interno (botones por género)
  const handleGenreFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);
    navigate(`/discover?filter=${newFilter}`);
  };

  // Filtros especiales provenientes de Navigation.jsx
  const specialFilters = ["vinyl", "cds", "cassettes", "tshirts"];

  let filteredAlbums = [];
  let filteredArtists = [];
  let filteredTshirts = [];

  if (selectedFilter === "all") {
    filteredAlbums = albums;
    filteredArtists = artists;
    filteredTshirts = tshirts;
  } else if (specialFilters.includes(selectedFilter)) {
    // Filtros especiales
    if (selectedFilter === "vinyl") {
      filteredAlbums = albums.filter((album) => album.vinyl === true);
    } else if (selectedFilter === "cds") {
      filteredAlbums = albums.filter((album) => album.cd === true);
    } else if (selectedFilter === "cassettes") {
      filteredAlbums = albums.filter((album) => album.cassettes === true);
    } else if (selectedFilter === "tshirts") {
      filteredTshirts = tshirts;
    }
    // No se muestran artistas para estos filtros especiales
  } else {
    // Filtro por género musical (por ejemplo: ambient, electronic, pop)
    filteredAlbums = albums.filter(
      (album) => album.genre.toLowerCase() === selectedFilter.toLowerCase()
    );
    filteredArtists = artists.filter(
      (artist) => artist.genre.toLowerCase() === selectedFilter.toLowerCase()
    );
    // En filtros musicales no se muestran camisetas
  }

  return (
    <div>
      {(!specialFilters.includes(selectedFilter) || selectedFilter === "all") && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Button variant="contained" onClick={() => handleGenreFilterChange("all")}>
            All
          </Button>
          <Button variant="contained" onClick={() => handleGenreFilterChange("ambient")}>
            Ambient
          </Button>
          <Button variant="contained" onClick={() => handleGenreFilterChange("electronic")}>
            Electronic
          </Button>
          <Button variant="contained" onClick={() => handleGenreFilterChange("pop")}>
            Pop
          </Button>
        </div>
      )}
      <Grid container spacing={2}>
        {filteredAlbums.map((album) => (
          <Grid item xs={12} sm={6} md={4} key={album.id}>
            <Card>
              <CardActionArea onClick={() => handleAlbumClick(album)}>
                <CardMedia
                  component="img"
                  alt={`${album.title} cover`}
                  image={album.coverImage}
                  sx={{ aspectRatio: "1 / 1", padding: "25px" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {album.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    by {album.artist}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Genre: {album.genre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ${album.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {filteredArtists.map((artist) => (
          <Grid item xs={12} sm={6} md={4} key={artist.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/artistProfile/${artist.id}`)}>
                <CardMedia
                  component="img"
                  alt={`${artist.name} profile`}
                  image={artist.profileImage}
                  sx={{ aspectRatio: "1 / 1", padding: "25px" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {artist.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Genre: {artist.genre}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {filteredTshirts.map((tshirt) => (
          <Grid item xs={12} sm={6} md={4} key={tshirt.id}>
            <Card>
              <CardActionArea onClick={() => handleTshirtClick(tshirt.id)}>
                <CardMedia
                  component="img"
                  alt={`${tshirt.name} shirt`}
                  image={tshirt.tshirtImage}
                  sx={{ aspectRatio: "1 / 1", padding: "25px" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {tshirt.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
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