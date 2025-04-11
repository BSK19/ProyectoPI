import React, { useState, useContext, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import { createAlbum } from '../../services/jamendoService';
import { AuthContext } from '../../context/AuthContext';

const UploadAlbumForm = ({ open, onClose }) => {

  const [title, setAlbumName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState(''); // Se agrega el estado para el género
  
  const { user } = useContext(AuthContext);

  const artist = user?.bandName || 'unknown'; // Se obtiene el nombre del artista desde el contexto de autenticación
  const artistId = user?.id || 1 ; // Se obtiene el ID del artista desde el contexto de autenticación

  // Se cambia el input de texto por la selección de archivo para la portada
  const [coverImage, setCoverImage] = useState(null);
  const [releaseYear, setReleaseYear] = useState(2000);
  const [tracks, setTracks] = useState([]);


  // Agregar una nueva pista vacía (con título y archivo)
  const addTrack = () => {
    setTracks([...tracks, { title: '', file: null }]);
  };

  // Actualizar el valor de una pista en particular
  const updateTrack = (index, field, value) => {
    const newTracks = [...tracks];
    newTracks[index][field] = value;
    setTracks(newTracks);
  };


  const handleSubmit = async () => {
    // Se utiliza FormData para enviar archivos junto con los demás datos
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('description', description);
    formData.append('artistId', artistId); // Se agrega el ID del artista
    // Asegurarse de enviar el archivo en lugar de una URL
    formData.append('coverImage', coverImage);
    formData.append('releaseYear', releaseYear);
    formData.append('genre', genre);
    
    tracks.forEach((track, index) => {
      formData.append(`tracks[${index}][title]`, track.title);
      if(track.file) {
        formData.append('tracks', track.file);      }
    });

    
    try {
      const response = await createAlbum(formData);
      if(response.success){
        alert("Álbum creado correctamente");
        onClose();
      } else {
        alert("Error al crear el álbum");
      }
    } catch (error) {
      alert("Error al crear el álbum");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Subir Álbum</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del Álbum"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Género"
          type="text"
          fullWidth
          variant="standard"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        {/* Se reemplaza el input de URL por un botón para seleccionar la imagen */}
        <Box mt={2} mb={2}>
          <Button variant="outlined" component="label">
            {coverImage ? "Imagen seleccionada" : "Seleccionar Portada"}
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
        </Box>
        <TextField
          margin="dense"
          label="Fecha de lanzamiento"
          type="integer"
          fullWidth
          variant="standard"
          value={releaseYear}
          onChange={(e) => setReleaseYear(parseInt(e.target.value,10))}
        />
        <Box mt={2} mb={1}>
          <h4>Pistas</h4>
          {tracks.map((track, index) => (
            <Box key={index} mb={2}>
              <TextField
                margin="dense"
                label={`Título de la pista ${index + 1}`}
                type="text"
                fullWidth
                variant="standard"
                value={track.title}
                onChange={(e) => updateTrack(index, 'title', e.target.value)}
              />
              <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                {track.file ? 'Archivo seleccionado' : 'Seleccionar Archivo'}
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      updateTrack(index, 'file', e.target.files[0]);
                    }
                  }}
                />
              </Button>
            </Box>
          ))}
          <Button variant="outlined" onClick={addTrack}>
            Agregar Pista
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAlbumForm;