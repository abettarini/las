import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useRef, useState } from 'react';

// Estendi l'interfaccia Window per includere google
declare global {
  interface Window {
    google: typeof google;
  }
}

// Nota: In un ambiente reale, dovresti ottenere una API key da Google Cloud Console
// e gestirla in modo sicuro (ad esempio, tramite variabili d'ambiente)
const GOOGLE_MAPS_API_KEY = 'AIzaSyB0gRiPziqLH4Qu5UhJEQ596vo1LPAZv2I';

const containerStyle = {
  width: '100%',
  height: '100%',
  zIndex: 0
};

// Librerie necessarie per Google Maps
const libraries = ['places', 'drawing', 'geometry'];

const StreetMapGoogle: React.FC = () => {
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Stesse coordinate usate nel componente StreetMap
  // <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2881.787132602235!2d11.096685!3d43.756517!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a5bbd2bf7946f%3A0xcf603b69f674c6f1!2sTiro%20A%20Segno%20Nazionale%20Lastra%20A%20Signa!5e0!3m2!1sen!2sus!4v1744220232124!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  const center = {
    lat: 43.75556770561522,
    lng: 11.099190183283822
  };
  // Carica lo script di Google Maps con le librerie necessarie
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
    id: 'google-map-script',
    mapIds: ['poligono_map_id'] // Aggiungi l'ID mappa qui
  });

  const onMarkerClick = () => {
    setIsInfoWindowOpen(true);
  };

  const onInfoWindowClose = () => {
    setIsInfoWindowOpen(false);
  };

  if (loadError) {
    return <div>Errore nel caricamento della mappa</div>;
  }

  if (!isLoaded) {
    return <div>Caricamento della mappa in corso...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapId: "poligono_map_id", // Aggiungi un ID mappa valido
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.SATELLITE,
              google.maps.MapTypeId.HYBRID,
              google.maps.MapTypeId.TERRAIN
            ]
          }
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <Marker
          position={center}
          onClick={onMarkerClick}
          title="Poligono di Tiro"
        />
        
        {isInfoWindowOpen && (
          <InfoWindow
            position={center}
            onCloseClick={onInfoWindowClose}
          >
            <div className="p-2">
              <h3 className="font-bold mb-2">Indirizzo</h3>
              <p className="text-muted-foreground mb-3">
                Via del Tiro a Segno, 1<br />
                50055 Lastra a Signa (FI)
              </p>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline flex items-center"
              >
                <span>Indicazioni stradali</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default StreetMapGoogle;