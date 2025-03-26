import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilter = (filter) => {
    navigate(`/discover?filter=${filter}`);
  };

  // Función para verificar si la ruta actual coincide con el filtro o con la página "Discover"
  const isActive = (filter) => {
    if (filter === "") {
      // Para la página Discover sin filtro
      return location.pathname === "/discover" && location.search === "";
    }
    return location.search === `?filter=${filter}`;
  };

  return (
    <AppBar position="static" color="secondary" elevation={0}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Button
          color="inherit"
          component={Link}
          to="/discover"
          sx={{
            backgroundColor: isActive("") ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": {
              backgroundColor: isActive("") ? "rgba(255, 255, 255, 0.3)" : "transparent",
            },
          }}
        >
          Discover
        </Button>
        <Button
          color="inherit"
          onClick={() => handleFilter("vinyl")}
          sx={{
            backgroundColor: isActive("vinyl") ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": {
              backgroundColor: isActive("vinyl") ? "rgba(255, 255, 255, 0.3)" : "transparent",
            },
          }}
        >
          Vinyl
        </Button>
        <Button
          color="inherit"
          onClick={() => handleFilter("cds")}
          sx={{
            backgroundColor: isActive("cds") ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": {
              backgroundColor: isActive("cds") ? "rgba(255, 255, 255, 0.3)" : "transparent",
            },
          }}
        >
          CDs
        </Button>
        <Button
          color="inherit"
          onClick={() => handleFilter("cassettes")}
          sx={{
            backgroundColor: isActive("cassettes") ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": {
              backgroundColor: isActive("cassettes") ? "rgba(255, 255, 255, 0.3)" : "transparent",
            },
          }}
        >
          Cassettes
        </Button>
        <Button
          color="inherit"
          onClick={() => handleFilter("tshirts")}
          sx={{
            backgroundColor: isActive("tshirts") ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": {
              backgroundColor: isActive("tshirts") ? "rgba(255, 255, 255, 0.3)" : "transparent",
            },
          }}
        >
          T Shirts
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
