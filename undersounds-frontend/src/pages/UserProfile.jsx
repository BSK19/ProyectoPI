import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [bio, setBio] = useState(user.bio || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = { ...user, name, email, bio };
        const response = await updateUserProfile(updatedUser);
        if (response.success) {
            setUser(updatedUser);
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile. Please try again.');
        }
    };

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
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UserProfile;