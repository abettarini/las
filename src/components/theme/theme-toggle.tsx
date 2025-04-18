import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isFeatureEnabled } from "@/config/features";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

// Mappa dei nomi degli schemi di colore in italiano
const colorSchemeNames: Record<string, string> = {
  slate: "Ardesia",
  gray: "Grigio",
  zinc: "Zinco",
  neutral: "Neutro",
  stone: "Pietra",
  white: "Bianco",
  "8bit": "8-Bit Retro",
  terminal: "Terminal",
  phosphor: "Fosfori Verdi",
  red: "Rosso",
  orange: "Arancione",
  amber: "Ambra",
  yellow: "Giallo",
  lime: "Lime",
  green: "Verde",
  emerald: "Smeraldo",
  teal: "Turchese",
  cyan: "Ciano",
  sky: "Cielo",
  blue: "Blu",
  indigo: "Indaco",
  violet: "Viola",
  purple: "Porpora",
  fuchsia: "Fucsia",
  pink: "Rosa",
  rose: "Rosa intenso"
};

// Funzione per ottenere il colore esadecimale per la preview
function getColorHex(colorScheme: string): string {
  const colorMap: Record<string, string> = {
    slate: "#64748b",
    gray: "#6b7280",
    zinc: "#71717a",
    neutral: "#737373",
    stone: "#78716c",
    white: "#ffffff",
    "8bit": "#4169e1",
    terminal: "#00ff00",
    phosphor: "#39ff14",
    red: "#ef4444",
    orange: "#f97316",
    amber: "#f59e0b",
    yellow: "#eab308",
    lime: "#84cc16",
    green: "#22c55e",
    emerald: "#10b981",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    sky: "#0ea5e9",
    blue: "#3b82f6",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    purple: "#a855f7",
    fuchsia: "#d946ef",
    pink: "#ec4899",
    rose: "#f43f5e"
  };
  
  return colorMap[colorScheme] || "#3b82f6";
}

export function ThemeToggle() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const showColorSelector = isFeatureEnabled('themeColorSelector');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambia tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          Chiaro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          Scuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M14 15v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 15v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 19h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sistema
        </DropdownMenuItem>
        
        {showColorSelector && (
          <>
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Colore: {colorSchemeNames[colorScheme] || colorScheme}
            </DropdownMenuLabel>
            
            <div className="grid grid-cols-3 gap-1 p-2">
              {["blue", "green", "red", "purple", "orange", "white", "8bit", "terminal", "phosphor"].map((scheme) => (
                <button
                  key={scheme}
                  className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ 
                    backgroundColor: getColorHex(scheme),
                    border: scheme === "white" ? "1px solid #e5e7eb" : "none"
                  }}
                  onClick={() => setColorScheme(scheme as any)}
                  title={colorSchemeNames[scheme] || scheme}
                />
              ))}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}