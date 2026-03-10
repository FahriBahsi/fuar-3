'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('direo-theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme: Theme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('direo-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set specific theme
  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('direo-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { 
    theme, 
    toggleTheme, 
    setTheme: setThemeValue,
    mounted 
  };
}

