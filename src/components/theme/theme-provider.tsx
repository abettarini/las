import { createContext, useContext, useEffect, useState } from "react";

// Definizione dei tipi
type Theme = "light" | "dark" | "system";
type ColorScheme = "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKeyTheme?: string;
  storageKeyColorScheme?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  availableColorSchemes: ColorScheme[];
};

// Elenco degli schemi di colore disponibili
const availableColorSchemes: ColorScheme[] = [
  "slate", "gray", "zinc", "neutral", "stone", 
  "red", "orange", "amber", "yellow", "lime", 
  "green", "emerald", "teal", "cyan", "sky", 
  "blue", "indigo", "violet", "purple", "fuchsia", 
  "pink", "rose"
];

// Stato iniziale
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorScheme: "blue",
  setColorScheme: () => null,
  availableColorSchemes
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "blue",
  storageKeyTheme = "tsn-las-ui-theme",
  storageKeyColorScheme = "tsn-las-ui-color-scheme",
  ...props
}: ThemeProviderProps) {
  // Stato per il tema (chiaro/scuro)
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKeyTheme) as Theme) || defaultTheme
  );
  
  // Stato per lo schema di colori
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => (localStorage.getItem(storageKeyColorScheme) as ColorScheme) || defaultColorScheme
  );

  // Effetto per applicare il tema (chiaro/scuro)
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Rimuovi le classi di tema precedenti
    root.classList.remove("light", "dark");
    
    // Applica il tema in base alle preferenze di sistema o alla scelta dell'utente
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Effetto per applicare lo schema di colori
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Rimuovi tutti gli schemi di colore precedenti
    availableColorSchemes.forEach(scheme => {
      root.classList.remove(`theme-${scheme}`);
    });
    
    // Applica il nuovo schema di colori
    root.classList.add(`theme-${colorScheme}`);
  }, [colorScheme]);

  // Valore del contesto
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKeyTheme, theme);
      setTheme(theme);
    },
    colorScheme,
    setColorScheme: (colorScheme: ColorScheme) => {
      localStorage.setItem(storageKeyColorScheme, colorScheme);
      setColorScheme(colorScheme);
    },
    availableColorSchemes
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};