import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useRef } from 'react';

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
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Coordinate del punto specifico su Google Maps
  // https://maps.google.com/maps?ll=43.755225,11.098206&z=18&t=h&hl=en&gl=US&mapclient=apiv3&cid=14943008889907758833
  const center = {
    lat: 43.755225,
    lng: 11.098206
  };
  
  // Carica lo script di Google Maps con le librerie necessarie
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
    id: 'google-map-script',
    mapIds: ['poligono_map_id'] // Aggiungi l'ID mappa qui
  });

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
        zoom={18}
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

      </GoogleMap>
    </div>
  );
};

export default StreetMapGoogle;