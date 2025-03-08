import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

const MapWithRoute: React.FC = () => {
  const [startAddress, setStartAddress] = useState('');
  const [startPosition, setStartPosition] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const destinationPosition: [number, number] = [41.9028, 12.4964]; // Example: Rome, Italy

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartAddress(event.target.value);
  };

  const handleGeocode = async () => {
    // Use a geocoding service to convert the address to coordinates
    // Example using OpenStreetMap Nominatim API
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${startAddress}`);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setStartPosition([parseFloat(lat), parseFloat(lon)]);
      setRoute([[parseFloat(lat), parseFloat(lon)], destinationPosition]);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setStartPosition([latitude, longitude]);
      setRoute([[latitude, longitude], destinationPosition]);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={startAddress}
        onChange={handleAddressChange}
        placeholder="Inserisci l'indirizzo di partenza"
      />
      <button onClick={handleGeocode}>Visualizza Percorso</button>
      <button onClick={handleUseCurrentLocation}>Usa Posizione Corrente</button>
      <MapContainer center={destinationPosition} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={destinationPosition} />
        {startPosition && <Marker position={startPosition} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapWithRoute;
