import { useState, useEffect, createContext, useContext } from 'react'
import { translations, detectLanguage } from './translations'

// Create context for language
const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then detect from browser
    const saved = localStorage.getItem('language')
    return saved || detectLanguage()
  })

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use translations
export const useTranslation = () => {
  const context = useContext(LanguageContext)
  
  if (!context) {
    // Fallback if used outside provider
    const language = detectLanguage()
    return {
      t: translations[language] || translations.en,
      language,
      setLanguage: () => {},
      toggleLanguage: () => {}
    }
  }

  const { language, setLanguage, toggleLanguage } = context
  
  return {
    t: translations[language] || translations.en,
    language,
    setLanguage,
    toggleLanguage
  }
}
