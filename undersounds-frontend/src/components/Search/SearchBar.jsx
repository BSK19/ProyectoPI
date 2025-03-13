import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Buscar música, álbumes o artistas..."
                    value={query}
                    onChange={handleInputChange}
                />
                <button type="submit">Buscar</button>
            </form>
        </div>
    );
};

export default SearchBar;