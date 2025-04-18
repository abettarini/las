import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTheme } from "./theme-provider";

// Mappa dei nomi degli schemi di colore in italiano
const colorSchemeNames: Record<string, string> = {
  slate: "Ardesia",
  gray: "Grigio",
  zinc: "Zinco",
  neutral: "Neutro",
  stone: "Pietra",
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

export function ColorSchemeSelector() {
  const { colorScheme, setColorScheme, availableColorSchemes } = useTheme();

  // Raggruppa gli schemi di colore per categoria
  const colorGroups = {
    grays: ["slate", "gray", "zinc", "neutral", "stone"],
    reds: ["red", "orange", "amber", "yellow"],
    greens: ["lime", "green", "emerald", "teal"],
    blues: ["cyan", "sky", "blue", "indigo"],
    purples: ["violet", "purple", "fuchsia", "pink", "rose"]
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <h3 className="font-medium text-sm">Schema di colori</h3>
        <p className="text-xs text-muted-foreground">
          Scegli lo schema di colori per personalizzare l'interfaccia
        </p>
      </div>
      
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4 space-y-6">
          {/* Grigi */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Grigi</h4>
            <div className="grid grid-cols-5 gap-2">
              {colorGroups.grays.map((scheme) => (
                <ColorButton 
                  key={scheme} 
                  scheme={scheme} 
                  isSelected={colorScheme === scheme}
                  onClick={() => setColorScheme(scheme as any)}
                />
              ))}
            </div>
          </div>
          
          {/* Rossi e Gialli */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Rossi e Gialli</h4>
            <div className="grid grid-cols-5 gap-2">
              {colorGroups.reds.map((scheme) => (
                <ColorButton 
                  key={scheme} 
                  scheme={scheme} 
                  isSelected={colorScheme === scheme}
                  onClick={() => setColorScheme(scheme as any)}
                />
              ))}
            </div>
          </div>
          
          {/* Verdi */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Verdi</h4>
            <div className="grid grid-cols-5 gap-2">
              {colorGroups.greens.map((scheme) => (
                <ColorButton 
                  key={scheme} 
                  scheme={scheme} 
                  isSelected={colorScheme === scheme}
                  onClick={() => setColorScheme(scheme as any)}
                />
              ))}
            </div>
          </div>
          
          {/* Blu */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Blu</h4>
            <div className="grid grid-cols-5 gap-2">
              {colorGroups.blues.map((scheme) => (
                <ColorButton 
                  key={scheme} 
                  scheme={scheme} 
                  isSelected={colorScheme === scheme}
                  onClick={() => setColorScheme(scheme as any)}
                />
              ))}
            </div>
          </div>
          
          {/* Viola e Rosa */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Viola e Rosa</h4>
            <div className="grid grid-cols-5 gap-2">
              {colorGroups.purples.map((scheme) => (
                <ColorButton 
                  key={scheme} 
                  scheme={scheme} 
                  isSelected={colorScheme === scheme}
                  onClick={() => setColorScheme(scheme as any)}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Componente per il pulsante di selezione colore
function ColorButton({ 
  scheme, 
  isSelected, 
  onClick 
}: { 
  scheme: string; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={colorSchemeNames[scheme] || scheme}
      className={cn(
        "relative w-full aspect-square rounded-md transition-all",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      style={{ backgroundColor: getColorHex(scheme) }}
    >
      {isSelected && (
        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
      )}
    </button>
  );
}