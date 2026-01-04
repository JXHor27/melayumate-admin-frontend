import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: 'dark', 
  toggleTheme: () => {} 
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // or "dark"

  // Effect to update <html> tag
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]); // Rerun effect whenever 'theme' state changes

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []); // Run once on mount (for theme persistence accross reloads)

  function toggleTheme(){
     setTheme(theme === "dark" ? "light" : "dark");
     localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);