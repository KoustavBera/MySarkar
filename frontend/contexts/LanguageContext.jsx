import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  const languages = [
    { code: 'hi', name: 'हिंदी', speechCode: 'hi-IN' },
    { code: 'bn', name: 'বাংলা', speechCode: 'bn-IN' },
    { code: 'or', name: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
    { code: 'kn', name: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
    { code: 'en', name: 'English', speechCode: 'en-US' }
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      setSelectedLanguage,
      languages,
      getCurrentLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};