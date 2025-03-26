import React, { createContext, useState } from 'react';

export const AlbumContext = createContext();

const AlbumProvider = ({ children }) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  return (
    <AlbumContext.Provider value={{ selectedAlbumId, setSelectedAlbumId }}>
      {children}
    </AlbumContext.Provider>
  );
};

export default AlbumProvider;