
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdminThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};

interface AdminThemeProviderProps {
  children: React.ReactNode;
}

export const AdminThemeProvider = ({ children }: AdminThemeProviderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('admin-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
    
    // Apply theme to admin body
    if (theme === 'dark') {
      document.documentElement.classList.add('admin-dark');
    } else {
      document.documentElement.classList.remove('admin-dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};
