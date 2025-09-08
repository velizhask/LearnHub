import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  compactMode: boolean;
  animations: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setColorScheme: (scheme: 'blue' | 'green' | 'purple' | 'orange') => void;
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void;
  setCompactMode: (compact: boolean) => void;
  setAnimations: (animations: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    const savedColorScheme = localStorage.getItem('colorScheme') as 'blue' | 'green' | 'purple' | 'orange' || 'blue';
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | 'extra-large' || 'medium';
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    const savedAnimations = localStorage.getItem('animations') !== 'false';

    setTheme(savedTheme);
    setColorScheme(savedColorScheme);
    setFontSize(savedFontSize);
    setCompactMode(savedCompactMode);
    setAnimations(savedAnimations);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme);

    // Apply font size
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    root.style.fontSize = fontSizeMap[fontSize];

    // Apply compact mode
    if (compactMode) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }

    // Apply animations
    if (!animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('compactMode', compactMode.toString());
    localStorage.setItem('animations', animations.toString());
  }, [theme, colorScheme, fontSize, compactMode, animations]);

  return (
    <ThemeContext.Provider value={{
      theme,
      colorScheme,
      fontSize,
      compactMode,
      animations,
      setTheme,
      setColorScheme,
      setFontSize,
      setCompactMode,
      setAnimations
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};