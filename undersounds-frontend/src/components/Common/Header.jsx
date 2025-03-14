import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/header.css'; 
import logo from '../../assets/images/logo.png';

const Header = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/discover?search=${encodeURIComponent(query)}`);
    };

    return (
        <header className="header-banner">
            <div className="header-left">
                <Link to="/" className="logo">
                    <img src={logo} alt="UnderSounds Logo" />
                </Link>
            </div>
            <div className="header-center">
                <form onSubmit={handleSearch} className="header-search-form">
                    <input 
                        type="text"
                        placeholder="Search music..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            <div className="header-right">
                <Link to="/register" className="header-signup">Sign Up</Link>
                <Link to="/login" className="header-login">Log In</Link>
            </div>
        </header>
    );
};

export default Header;