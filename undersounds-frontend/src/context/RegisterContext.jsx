import React, { createContext, useState } from 'react';

export const RegisterContext = createContext();

const RegisterProvider = ({ children }) => {
  const [registerType, setRegisterType] = useState('');

  return (
    <RegisterContext.Provider value={{ registerType, setRegisterType }}>
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterProvider;