import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Campos generales
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');

    // Campos para cuentas de banda
    const [bandName, setBandName] = useState(user?.bandName || '');
    const [genre, setGenre] = useState(user?.genre || '');

    // Campos para cuentas de sello
    const [labelName, setLabelName] = useState(user?.labelName || '');
    const [website, setWebsite] = useState(user?.website || '');

    useEffect(() => {
      if (!user) {
        navigate('/login'); // Redirige al login si no hay usuario
      }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construye el objeto actualizado según el rol
        const updatedUser = { ...user, name, email, bio };
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
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile. Please try again.');
        }
    };

    if (!user) return null; // Evita renderizar si no hay usuario

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                {/* Mostrar campos adicionales según el rol */}
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
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UserProfile;