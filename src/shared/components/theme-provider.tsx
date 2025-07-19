'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'clarity' | 'focus'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('clarity')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('theme-clarity', 'theme-focus')
    root.classList.add(`theme-${theme}`)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (undefined === context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}