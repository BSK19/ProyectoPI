import React, { createContext, useState } from 'react';

export const ConcertContext = createContext();

const ConcertProvider = ({ children }) => {
  const [selectedConcertId, setSelectedConcertId] = useState(null);

  return (
    <ConcertContext.Provider value={{ selectedConcertId, setSelectedConcertId }}>
      {children}
    </ConcertContext.Provider>
  );
};

export default ConcertProvider;