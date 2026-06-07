import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const StreetMap: React.FC = () => {
  const position: LatLngExpression = [43.76036024534613, 11.098509879269411]; // Example coordinates (latitude, longitude)

  return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
            <div>
                <h3 className="font-bold mb-4">Indirizzo</h3>
                <p className="text-muted-foreground">
                  Via del Tiro a Segno, 1<br />
                  50055 Lastra a Signa (FI)
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
  );
};

export default StreetMap;
