'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { fr, en, Dictionary } from './dictionaries'

type Language = 'fr' | 'en'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  t: fr
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as Language
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('app-lang', newLang)
  }

  const t = lang === 'en' ? en : fr

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
