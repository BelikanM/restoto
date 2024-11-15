
// Map.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Assurez-vous que les icônes de Leaflet sont correctement chargées
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ position, sellerInfo }) => {
  if (!position || position.includes(undefined)) {
    return <div>Invalid location data</div>;
  }

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          <div>
            <h2>{sellerInfo.name}</h2>
            <p>Email: {sellerInfo.email}</p>
            <p>Phone: {sellerInfo.phoneNumber}</p>
            <p>Location: {sellerInfo.city}, {sellerInfo.country}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
