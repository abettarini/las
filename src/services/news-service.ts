import { Content } from "../components/news/news-list";
import { getAuthToken } from "./auth-service";

const API_URL = import.meta.env.VITE_API_URL || "https://api.tsnlastrasigna.it";

// Funzione per ottenere tutte le comunicazioni
export async function getAllNews(): Promise<{ success: boolean; data?: Content[]; message?: string }> {
  try {
    // Chiamata all'API per ottenere tutte le comunicazioni
    const response = await fetch(`${API_URL}/contents`);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Errore durante il recupero delle comunicazioni"
      };
    }
    
    // Se non ci sono dati, utilizza i dati statici come fallback
    if (!data.success || !data.data || data.data.length === 0) {
      const staticData = await import("../data/news");
      return {
        success: true,
        data: staticData.contents
      };
    }
    
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error("Errore durante il recupero delle comunicazioni:", error);
    
    // In caso di errore, utilizza i dati statici come fallback
    try {
      const staticData = await import("../data/news");
      return {
        success: true,
        data: staticData.contents
      };
    } catch (fallbackError) {
      return {
        success: false,
        message: "Si è verificato un errore durante il recupero delle comunicazioni"
      };
    }
  }
}

// Funzione per ottenere una comunicazione specifica
export async function getNewsById(id: number): Promise<{ success: boolean; data?: Content; message?: string }> {
  try {
    // Chiamata all'API per ottenere una comunicazione specifica
    const response = await fetch(`${API_URL}/contents/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Errore durante il recupero della comunicazione"
      };
    }
    
    // Se non ci sono dati, cerca nei dati statici come fallback
    if (!data.success || !data.data) {
      const staticData = await import("../data/news");
      const news = staticData.contents.find(item => item.id === id);
      
      if (!news) {
        return {
          success: false,
          message: "Comunicazione non trovata"
        };
      }
      
      return {
        success: true,
        data: news
      };
    }
    
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error("Errore durante il recupero della comunicazione:", error);
    
    // In caso di errore, cerca nei dati statici come fallback
    try {
      const staticData = await import("../data/news");
      const news = staticData.contents.find(item => item.id === id);
      
      if (!news) {
        return {
          success: false,
          message: "Comunicazione non trovata"
        };
      }
      
      return {
        success: true,
        data: news
      };
    } catch (fallbackError) {
      return {
        success: false,
        message: "Si è verificato un errore durante il recupero della comunicazione"
      };
    }
  }
}

// Funzione per creare una nuova comunicazione
export async function createNews(news: Omit<Content, "id">): Promise<{ success: boolean; data?: Content; message?: string }> {
  try {
    // Ottieni il token di autenticazione
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: "Accesso negato: è necessario effettuare l'accesso"
      };
    }
    
    // Chiamata all'API per creare una nuova comunicazione
    const response = await fetch(`${API_URL}/contents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(news)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Errore durante la creazione della comunicazione"
      };
    }
    
    return {
      success: true,
      data: data.data,
      message: "Comunicazione creata con successo"
    };
  } catch (error) {
    console.error("Errore durante la creazione della comunicazione:", error);
    return {
      success: false,
      message: "Si è verificato un errore durante la creazione della comunicazione"
    };
  }
}

// Funzione per aggiornare una comunicazione esistente
export async function updateNews(id: number, news: Partial<Content>): Promise<{ success: boolean; data?: Content; message?: string }> {
  try {
    // Ottieni il token di autenticazione
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: "Accesso negato: è necessario effettuare l'accesso"
      };
    }
    
    // Chiamata all'API per aggiornare una comunicazione esistente
    const response = await fetch(`${API_URL}/contents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(news)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Errore durante l'aggiornamento della comunicazione"
      };
    }
    
    return {
      success: true,
      data: data.data,
      message: "Comunicazione aggiornata con successo"
    };
  } catch (error) {
    console.error("Errore durante l'aggiornamento della comunicazione:", error);
    return {
      success: false,
      message: "Si è verificato un errore durante l'aggiornamento della comunicazione"
    };
  }
}

// Funzione per eliminare una comunicazione
export async function deleteNews(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    // Ottieni il token di autenticazione
    const token = await getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: "Accesso negato: è necessario effettuare l'accesso"
      };
    }
    
    // Chiamata all'API per eliminare una comunicazione
    const response = await fetch(`${API_URL}/contents/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Errore durante l'eliminazione della comunicazione"
      };
    }
    
    return {
      success: true,
      message: "Comunicazione eliminata con successo"
    };
  } catch (error) {
    console.error("Errore durante l'eliminazione della comunicazione:", error);
    return {
      success: false,
      message: "Si è verificato un errore durante l'eliminazione della comunicazione"
    };
  }
}