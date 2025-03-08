import { useContext } from "react";
import { ConsentBannerContext, ConsentBannerContextType } from "../context/consent-banner-context";

export const useConsentBannerContext = (): ConsentBannerContextType => {
    const context = useContext(ConsentBannerContext);
    if (!context) {
      throw new Error('useConsentBannerContext must be used within a ConsentBannerProvider');
    }
    return context;
  };