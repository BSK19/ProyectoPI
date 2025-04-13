import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import Button from '@mui/material/Button';
import UploadAlbumForm from '../components/Upload/Upload';
import UploadMerchForm from '../components/Upload/UploadMerch';
import UploadArtistForm from '../components/Upload/UploadArtist';

import '../styles/userprofile.css';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Campos generales
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Campos para cuentas de banda
  const [bandName, setBandName] = useState(user?.bandName || '');
  const [genre, setGenre] = useState(user?.genre || '');

  // Campos para cuentas de sello
  const [labelName, setLabelName] = useState(user?.labelName || '');
  const [website, setWebsite] = useState(user?.website || '');

  const [openAlbumModal, setOpenAlbumModal] = useState(false);
  const [openMerchModal, setOpenMerchModal] = useState(false);
  const [openRegisterArtistModal, setOpenRegisterArtistModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirige al login si no hay usuario
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...user, username, email, bio };
    if (user.role === 'band') {
      updatedUser.bandName = bandName;
      updatedUser.genre = genre;
    }
    if (user.role === 'label') {
      updatedUser.labelName = labelName;
      updatedUser.website = website;
    }
    const response = await updateUserProfile(updatedUser);
    if (response.success) {
      setUser(updatedUser);
      alert('Perfil actualizado correctamente');
    } else {
      alert('Error al actualizar el perfil');
    }
  };

  // Manejador para cambiar el banner con validación de URL
  const handleChangeBanner = async () => {
    const newBannerUrl = prompt("Introduce la URL de la nueva imagen del banner:");
    if (newBannerUrl) {
      try {
        new URL(newBannerUrl);
      } catch (err) {
        alert("La URL ingresada no es válida.");
        return;
      }
      const updatedUser = { ...user, bannerImage: newBannerUrl };
      try {
        const response = await updateUserProfile(updatedUser);
        if (response.success) {
          setUser(updatedUser);
          alert("Banner actualizado correctamente!");
        } else {
          alert("Fallo al actualizar el banner.");
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al actualizar el banner.");
      }
    }
  };

  // Función para cambiar la imagen de perfil
  const handleChangeProfileImage = async () => {
    const newProfileImageUrl = prompt("Introduce la URL de la nueva imagen de perfil:");
    if (newProfileImageUrl) {
      try {
        new URL(newProfileImageUrl);
      } catch (err) {
        alert("La URL ingresada no es válida.");
        return;
      }
      const updatedUser = { ...user, profileImage: newProfileImageUrl };
      try {
        const response = await updateUserProfile(updatedUser);
        if (response.success) {
          setUser(updatedUser);
          alert("Imagen de perfil actualizada correctamente!");
        } else {
          alert("Fallo al actualizar la imagen de perfil.");
        }
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al actualizar la imagen de perfil.");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="profile-banner">
        <img 
          src={user.bannerImage || '/assets/default-banner.jpg'} 
          alt="Profile Banner" 
        />
        <button onClick={handleChangeBanner}>Cambiar Banner</button>
      </div>
      <div className="profile-header">
        <img
          src={user.profileImage || '/assets/default-profile.jpg'}
          alt={user.username || user.bandName || 'Usuario'}
          className="profile-image"
          onClick={handleChangeProfileImage}
          style={{ cursor: 'pointer' }}
        />
        <div className="profile-info">
          <h2>User Profile</h2>
          <div className="followers">
            <span className="followers-counter">{user.followers ?? 0}</span>
            <span className="followers-label">seguidores</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        {user.role === 'band' && (
          <>
            <div className="form-group">
              <label htmlFor="bandName">Nombre de Banda:</label>
              <input
                type="text"
                id="bandName"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="genre">Género:</label>
              <input
                type="text"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </div>
          </>
        )}
        {user.role === 'label' && (
          <>
            <div className="form-group">
              <label htmlFor="labelName">Nombre del Sello:</label>
              <input
                type="text"
                id="labelName"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="website">Página Web:</label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="update-button">
          Actualizar Perfil
        </button>
      </form>
      <div className="user-additional-functions" style={{ marginTop: '20px' }}>
        {user.role === 'band' && (
          <div>
            <h3>Funciones para Artistas</h3>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAlbumModal(true)}
            >
              Subir Álbum
            </Button>
          </div>
        )}
        {user.role === 'label' && (
          <div>
            <h3>Funciones para Sellos Discográficos</h3>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAlbumModal(true)}
              style={{ marginRight: '10px' }}
            >
              Subir Álbum
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenMerchModal(true)}
              style={{ marginRight: '10px' }}
            >Subir Merchandising</Button>
             <Button
              variant="contained"
              color="success"
              onClick={() => setOpenRegisterArtistModal(true)}
            >
              Dar de Alta Artista Emergente
            </Button>
          </div>
        )}
      </div>

      {openAlbumModal && (
        <UploadAlbumForm 
          open={openAlbumModal} 
          onClose={() => setOpenAlbumModal(false)} 
        />
      )}
      {openMerchModal && (
        <UploadMerchForm 
          open={openMerchModal} 
          onClose={() => setOpenMerchModal(false)} 
        />
      )}
      {openRegisterArtistModal && (
        <UploadArtistForm 
          open={openRegisterArtistModal} 
          onClose={() => setOpenRegisterArtistModal(false)} 
        />
      )}


    </div>
  );
};

export default UserProfile;