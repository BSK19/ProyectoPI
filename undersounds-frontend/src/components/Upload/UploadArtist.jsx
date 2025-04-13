import React, { useState, useContext } from 'react';
import {
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    Button, Box, Typography, Grid
} from '@mui/material';
import { createArtist } from '../../services/artistService';
import { AuthContext } from '../../context/AuthContext';

const UploadArtistForm = ({ open, onClose }) => {
    const { user } = useContext(AuthContext);

    // Solo disponible para sellos discográficos
    if (user.role !== 'label') return null;

    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [banner, setBanner] = useState(null);

    const handleSubmit = async () => {
        if (!name || !genre || !bio || !profileImage) {
            alert("Por favor, completa los campos obligatorios: nombre, género, biografía e imagen de perfil");
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('genre', genre);
        formData.append('bio', bio);
        formData.append('profileImage', profileImage);
        if(banner) formData.append('banner', banner);
        // Puedes agregar otros campos opcionales como ubicacion

        try {
            const response = await createArtist(formData);
            if(response.success){
                alert("Artista creado correctamente");
                onClose();
            } else {
                alert("Error al crear el artista: " + (response.error || "Hubo un problema"));
            }
        } catch (error) {
            console.error("Error en la creación:", error);
            alert("Error al crear el artista: " + (error.message || "Hubo un problema de comunicación"));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Subir Nuevo Artista</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre del Artista *"
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
                            label="Género Musical *"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            label="Biografía *"
                            type="text"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box mt={2} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                component="label"
                                color={profileImage ? "success" : "primary"}
                            >
                                {profileImage ? "Imagen de Perfil Seleccionada ✓" : "Seleccionar Imagen de Perfil *"}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files.length > 0) {
                                            setProfileImage(e.target.files[0]);
                                        }
                                    }}
                                />
                            </Button>
                            {profileImage && (
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    {profileImage.name}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box mt={2} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                component="label"
                                color={banner ? "success" : "primary"}
                            >
                                {banner ? "Banner Seleccionado ✓" : "Seleccionar Banner (opcional)"}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files.length > 0) {
                                            setBanner(e.target.files[0]);
                                        }
                                    }}
                                />
                            </Button>
                            {banner && (
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    {banner.name}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Publicar Artista
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadArtistForm;