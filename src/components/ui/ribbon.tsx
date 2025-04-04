import React from 'react';

interface RibbonProps {
  text: string;
  color?: string;
  backgroundColor?: string;
}

/**
 * Componente Ribbon che mostra un'etichetta nell'angolo superiore destro
 * 
 * @param text - Testo da mostrare nel ribbon
 * @param color - Colore del testo (default: bianco)
 * @param backgroundColor - Colore di sfondo (default: rosso)
 */
export const Ribbon: React.FC<RibbonProps> = ({
  text,
  color = 'white',
  backgroundColor = 'red'
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: '0',
        zIndex: 9999,
        width: '150px',
        padding: '4px 0',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        color: color,
        backgroundColor: backgroundColor,
        transform: 'rotate(45deg) translate(35px, -15px)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'none', // Assicura che il ribbon non interferisca con i click
      }}
    >
      {text}
    </div>
  );
};

/**
 * Componente EnvironmentRibbon che mostra un ribbon "Sviluppo" solo in ambiente di sviluppo
 */
export const EnvironmentRibbon: React.FC = () => {
  // Verifica se l'ambiente è di sviluppo (non production)
  const isDevelopment = import.meta.env.MODE !== 'production';
  
  if (!isDevelopment) {
    return null;
  }
  
  return (
    <Ribbon 
      text="SVILUPPO" 
      backgroundColor="#e53e3e" // Rosso
    />
  );
};

export default EnvironmentRibbon;