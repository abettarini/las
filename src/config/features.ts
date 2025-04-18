/**
 * Feature flags per l'applicazione
 * 
 * Questo file contiene i flag per abilitare o disabilitare funzionalità specifiche
 * dell'applicazione. Modificare questi valori per controllare quali funzionalità
 * sono disponibili agli utenti.
 */

export const features = {
  /**
   * Abilita o disabilita il selettore di temi e colori nell'interfaccia
   * Quando impostato a false, il selettore non sarà visibile nell'header e nelle impostazioni utente
   */
  themeColorSelector: false,
  
  // Altri feature flag possono essere aggiunti qui
};

/**
 * Verifica se una feature è abilitata
 * @param featureName - Nome della feature da verificare
 * @returns true se la feature è abilitata, false altrimenti
 */
export function isFeatureEnabled(featureName: keyof typeof features): boolean {
  return features[featureName] === true;
}