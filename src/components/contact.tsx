import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import ContactForm from './ContactForm';

// Fix for default marker icon issue in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

const Contact: React.FC = () => {
  const position: LatLngExpression = [51.505, -0.09]; // Example coordinates (latitude, longitude)

  return (
    <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg">
      {/* Map Section */}
      <div className="flex-1">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              La nostra struttura si trova qui.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Contact Form Section */}
      <div className="flex-1 p-6">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
