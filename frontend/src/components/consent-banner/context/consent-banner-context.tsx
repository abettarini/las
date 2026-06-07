import React, { createContext, ReactNode, useEffect, useState } from 'react';

type ConsentDuration = '24h' | '1w' | '1m';
export type ConsentType = 'analytics' | 'marketing' | 'functional';

interface ConsentSettings {
  [key: string]: boolean;
}

export interface ConsentBannerContextType {
  showBanner: boolean;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  consentDuration: ConsentDuration;
  consentSettings: ConsentSettings;
  saveConsentSettings: () => void;
  setConsentDuration: (duration: ConsentDuration) => void;
  setConsentSettings: (settings: ConsentSettings) => void;
  handleAccept: () => void;
  handleReject: () => void;
}

export const ConsentBannerContext = createContext<ConsentBannerContextType | undefined>(undefined);

export const ConsentBannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consentDuration, setConsentDuration] = useState<ConsentDuration>('24h');
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    analytics: false,
    marketing: false,
    functional: true, // Default to true for essential consents
  });

  useEffect(() => {
    const consent = localStorage.getItem('consent');
    const consentExpiry = localStorage.getItem('consentExpiry');
    const storedSettings = localStorage.getItem('consentSettings');

    if (storedSettings) {
      setConsentSettings(JSON.parse(storedSettings));
    }

    if (!consent || (consentExpiry && new Date() > new Date(consentExpiry))) {
      setShowBanner(true);
    }
  }, []);

  const setConsentWithExpiry = (consent: string) => {
    let expiryDate = new Date();
    switch (consentDuration) {
      case '24h':
        expiryDate.setHours(expiryDate.getHours() + 24);
        break;
      case '1w':
        expiryDate.setDate(expiryDate.getDate() + 7);
        break;
      case '1m':
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
    }

    localStorage.setItem('consent', consent);
    localStorage.setItem('consentExpiry', expiryDate.toISOString());
    saveConsentSettings();
  };

  const saveConsentSettings = () => {
    localStorage.setItem('consentSettings', JSON.stringify(consentSettings));
  };

  const handleAccept = () => {
    setConsentWithExpiry('accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    setConsentWithExpiry('rejected');
    setShowBanner(false);
  };

  return (
    <ConsentBannerContext.Provider value={{ showBanner, consentDuration, consentSettings, setConsentDuration, setConsentSettings, handleAccept, handleReject, saveConsentSettings, showSettings, setShowSettings }}>
      {children}
    </ConsentBannerContext.Provider>
  );
};

