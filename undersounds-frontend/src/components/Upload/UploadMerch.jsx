import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Button, Box, FormControl, InputLabel, MenuItem, Select, Typography, Grid
} from '@mui/material';
import { createMerch } from '../../services/merchandisingService';
import { fetchArtistsList } from '../../services/jamendoService';
import { AuthContext } from '../../context/AuthContext';

const UploadMerchForm = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [type, setMerchType] = useState(0); // 0 = Vinilo, por defecto
  const [image, setImage] = useState(null);

  const [artistsList, setArtistsList] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artistId, setArtistId] = useState(user.artistId || '');

  // Mostrar advertencia si es banda sin artistId vinculado
  const showArtistIdWarning = user.role === 'band' && !user.artistId;

  useEffect(() => {
    if (user.role === 'label') {
      fetchArtistsList()
        .then(data => {
          setArtistsList(data || []);
          console.log("Artistas:", data);
        })
        .catch((error) => console.error('Error fetching artists:', error));
    }
  }, [user.role]);

  const handleSubmit = async () => {
    if (!name || !description || !image) {
      alert("Por favor, completa los campos obligatorios: nombre, descripción e imagen");
      return;
    }
    if (user.role === 'band' && !artistId) {
      alert("Error: Tu cuenta de artista no está vinculada. Contacta al administrador.");
      return;
    }
    if (user.role === 'label' && !selectedArtist) {
      alert("Por favor, selecciona el artista representante para el merchandising.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('type', type);
    formData.append('image', image);
    formData.append('artistId', user.role === 'label' ? selectedArtist : artistId);

    try {
      const response = await createMerch(formData);
      if (response.success) {
        alert("Merchandising creado correctamente");
        onClose();
      } else {
        alert("Error al crear el merchandising: " + (response.error || "Hubo un problema"));
      }
    } catch (error) {
      console.error("Error en la creación:", error);
      alert("Error al crear el merchandising: " + (error.message || "Hubo un problema de comunicación"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Subir Nuevo Merchandising</DialogTitle>
      <DialogContent>
        {showArtistIdWarning && (
          <Box sx={{ backgroundColor: '#fff3cd', color: '#856404', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2">
              <strong>Atención:</strong> Tu cuenta de artista no está configurada correctamente. Por favor, contacta al administrador.
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre del Producto *"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Descripción *"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Precio (€) *"
              type="number"
              fullWidth
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              inputProps={{ step: 0.01, min: 0 }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="select-merch-type-label">Tipo *</InputLabel>
              <Select
                labelId="select-merch-type-label"
                value={type}
                label="Tipo *"
                onChange={(e) => setMerchType(e.target.value)}
              >
                <MenuItem value={0}>Vinilo</MenuItem>
                <MenuItem value={1}>CD</MenuItem>
                <MenuItem value={2}>Cassettes</MenuItem>
                <MenuItem value={3}>T-shirts</MenuItem>
                <MenuItem value={4}>Otros</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                component="label"
                color={image ? "success" : "primary"}
              >
                {image ? "Imagen Seleccionada ✓" : "Seleccionar Imagen *"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {image && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {image.name}
                </Typography>
              )}
            </Box>
          </Grid>
          {user.role === 'label' && (
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel id="select-artist-label">Artista Representante</InputLabel>
                <Select
                  labelId="select-artist-label"
                  value={selectedArtist || ""}
                  label="Artista Representante"
                  onChange={(e) => {
                    setSelectedArtist(e.target.value);
                    setArtistId(e.target.value);
                    console.log("artistId", artistId);
                  }}
                >
                  {artistsList.map((artist) => (
                    <MenuItem key={artist.id} value={artist.id}>
                      {artist.name || 'Sin Nombre'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!name || !description || !image || !artistId}
        >
          Publicar Merchandising
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadMerchForm;