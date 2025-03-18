import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleFilter = (filter) => {
    navigate(`/discover?filter=${filter}`);
  };

  return (
    <AppBar position="static" color="secondary" elevation={0}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Button color="inherit" component={Link} to="/discover">
          Discover
        </Button>
        <Button color="inherit" onClick={() => handleFilter("vinyl")}>
          Vinyl
        </Button>
        <Button color="inherit" onClick={() => handleFilter("cds")}>
          CDs
        </Button>
        <Button color="inherit" onClick={() => handleFilter("cassettes")}>
          Cassettes
        </Button>
        <Button color="inherit" onClick={() => handleFilter("tshirts")}>
          T Shirts
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;