import React from 'react';
import Header from '../components/Common/Header';
import Navigation from '../components/Common/Navigation';
import Footer from '../components/Common/Footer';
import SearchBar from '../components/Search/SearchBar';
import Album from '../components/Album/Album';
import albums  from '../mockData/albums';

const HomePage = () => {
    return (
        <div>
            <Header />
            <Navigation />
            <SearchBar />
            <h1>Welcome to UnderSounds</h1>
            <h2>Featured Albums</h2>
            <div className="album-list">
                {albums.map(album => (
                    <Album key={album.id} album={album} />
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;