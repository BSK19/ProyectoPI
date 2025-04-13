import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Button, Box, FormControlLabel, Checkbox, MenuItem, Select,
  InputLabel, FormControl, Typography, Grid
} from '@mui/material';
import { createAlbum } from '../../services/jamendoService';
import { fetchArtistsList } from '../../services/jamendoService';
import { AuthContext } from '../../context/AuthContext';

const UploadAlbumForm = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);

  const [title, setAlbumName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [tracks, setTracks] = useState([]);
  const [price, setPrice] = useState(9.99);
  const [label, setLabel] = useState('');

  const [artistsList, setArtistsList] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  // Usar artistId en lugar de id para la relación correcta
  const [artistId, setArtistId] = useState(user.artistId || '');
  const artistName = user.bandName || user.username || 'Unknown Artist';

  // Verificar si es una banda sin artistId vinculado
  const showArtistIdWarning = user.role === 'band' && !user.artistId;

  //funcion para obtener la lista de artistas en caso de que el usuario sea un sello discográfico
  useEffect(() => {
    if (user.role === 'label') {
      fetchArtistsList()
        .then(data => {
          // Suponiendo que fetchArtists devuelve un objeto con la propiedad artists.
          setArtistsList(data || []);
          console.log("Artistas:", data);
        })
        .catch((error) => console.error('Error fetching artists:', error));
    }
  }, [user.role]);
  // Función para extraer la duración del archivo de audio
  const getAudioDuration = (file) => {
    return new Promise((resolve) => {
      // Usar URL.createObjectURL para crear una URL temporal para el archivo
      const url = URL.createObjectURL(file);

      // Crear un elemento de audio para obtener metadatos
      const audio = new Audio();
      audio.src = url;

      // Cuando los metadatos estén cargados, obtenemos la duración
      audio.addEventListener('loadedmetadata', () => {
        // Liberar la URL temporal
        URL.revokeObjectURL(url);

        // Formatear la duración a minutos:segundos
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        resolve(formattedDuration);
      });

      // Si hay algún error, resolver con un valor por defecto
      audio.addEventListener('error', () => {
        console.error('Error al leer la duración del archivo de audio');
        URL.revokeObjectURL(url);
        resolve('0:00');
      });
    });
  };

  // Agregar una nueva pista vacía
  const addTrack = () => {
    setTracks([...tracks, {
      title: '',
      file: null,
      duration: '0:00', // Duración predeterminada
      autor: artistName // Autor predeterminado (el artista actual)
    }]);
  };

  // Actualizar el valor de una pista
  const updateTrack = (index, field, value) => {
    const newTracks = [...tracks];
    newTracks[index][field] = value;
    setTracks(newTracks);
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!title || !genre || !coverImage || tracks.length === 0) {
      alert("Por favor, completa todos los campos obligatorios (título, género, portada y al menos una pista)");
      return;
    }

    // Validar para usuario que no es sello y que debe tener artistId
    if (user.role === 'band' && !artistId) {
      alert("Error: No se puede subir un álbum sin una cuenta de artista vinculada. Contacta al administrador.");
      return;
    }

    // Validar para sello discogrático que se haya seleccionado un artista representante
    if (user.role === 'label' && !selectedArtist) {
      alert("Por favor, selecciona el artista representante para el álbum.");
      return;
    }


    // Formato para enviar
    const formData = new FormData();

    // Campos básicos
    formData.append('title', title);
    formData.append('artistId', user.role === 'label' ? selectedArtist : artistId);
    formData.append('description', description);
    formData.append('releaseYear', releaseYear);
    formData.append('genre', genre);
    formData.append('price', price);
    formData.append('label', label);

    // Archivo de portada
    formData.append('coverImage', coverImage);

    // Tracks - enviamos tanto los metadatos como los archivos
    tracks.forEach((track, index) => {
      // Metadatos de cada pista
      formData.append(`trackTitles[${index}]`, track.title);
      formData.append(`trackDurations[${index}]`, track.duration);
      formData.append(`trackAutors[${index}]`, track.autor);

      // Archivo de audio
      if (track.file) {
        formData.append('tracks', track.file);
      }
    });


    try {
      const response = await createAlbum(formData);
      if (response.success) {
        alert("Álbum creado correctamente");
        onClose();
      } else {
        alert("Error al crear el álbum: " + (response.error || "Hubo un problema"));
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      alert("Error al crear el álbum: " + (error.message || "Hubo un problema de comunicación"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Subir Nuevo Álbum</DialogTitle>
      <DialogContent>
        {showArtistIdWarning && (
          <Box sx={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: 2,
            borderRadius: 1,
            marginBottom: 2
          }}>
            <Typography variant="body2">
              <strong>Atención:</strong> Tu cuenta de artista no está correctamente configurada.
              Por favor, contacta al administrador para vincular tu perfil de artista.
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              label="Título del Álbum *"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setAlbumName(e.target.value)}
              required
            />

            <TextField
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              margin="dense"
              label="Género Musical *"
              type="text"
              fullWidth
              variant="outlined"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />


            <Box mt={2} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                component="label"
                color={coverImage ? "success" : "primary"}
              >
                {coverImage ? "Portada Seleccionada ✓" : "Seleccionar Portada *"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setCoverImage(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {coverImage && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {coverImage.name}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Año de Lanzamiento *"
              type="number"
              fullWidth
              variant="outlined"
              value={releaseYear}
              onChange={(e) => setReleaseYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
              inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }}
              required
            />

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
            {/* Mostrar casilla para seleccionar artista solo si el rol es "label" */}
            {user.role === 'label' && (
              <FormControl fullWidth margin="dense" required>
                <InputLabel id="select-artist-label">Artista Representante</InputLabel>
                <Select
                  labelId="select-artist-label"
                  value={selectedArtist ||""}
                  label="Artista Representante"
                  
                  onChange={(e) =>{                  
                     setSelectedArtist(e.target.value)
                     setArtistId(e.target.value)
                     console.log("artistId", artistId)
                     
                     console.log("selectectArtist", e.target.value);
                  }}
                >
                  {artistsList.map((artist) => (
                    <MenuItem key={artist._id} value={artist._id}>
                      {artist.name ||  'Sin Nombre'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>

        {/* Sección de pistas */}
        <Box mt={3}>
          <Typography variant="h6">Pistas del Álbum *</Typography>
          {tracks.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Añade al menos una pista a tu álbum
            </Typography>
          )}

          {tracks.map((track, index) => (
            <Box key={index} mb={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Título de la pista ${index + 1} *`}
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={track.title}
                    onChange={(e) => updateTrack(index, 'title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Duración"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={track.duration}
                    onChange={(e) => updateTrack(index, 'duration', e.target.value)}
                    placeholder="mm:ss"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Autor"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={track.autor}
                    onChange={(e) => updateTrack(index, 'autor', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    color={track.file ? "success" : "primary"}
                    fullWidth
                  >
                    {track.file ? 'Archivo Seleccionado ✓' : 'Seleccionar Archivo de Audio *'}
                    <input
                      type="file"
                      hidden
                      accept="audio/*"
                      onChange={async (e) => {
                        if (e.target.files.length > 0) {
                          const audioFile = e.target.files[0];

                          // Actualizar el archivo en el estado
                          updateTrack(index, 'file', audioFile);

                          try {
                            // Obtener y actualizar la duración automáticamente
                            const duration = await getAudioDuration(audioFile);
                            updateTrack(index, 'duration', duration);
                          } catch (error) {
                            console.error('Error al obtener la duración:', error);
                            // Mantener la duración actual
                          }
                        }
                      }}
                    />
                  </Button>
                  {track.file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {track.file.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={addTrack}
            startIcon={<span>+</span>}
            sx={{ mt: 1 }}
          >
            Añadir Pista
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!title || !genre || !coverImage || tracks.length === 0 || !artistId}
        >
          Publicar Álbum
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAlbumForm;