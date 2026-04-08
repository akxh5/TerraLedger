import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    latitude: number | string;
    longitude: number | string;
    landId?: string;
    geoJsonBoundary?: string;
}

const MapView = ({ latitude, longitude, landId, geoJsonBoundary }: MapViewProps) => {
    const position: [number, number] = [Number(latitude), Number(longitude)];
    
    let geoData = null;
    if (geoJsonBoundary) {
        try {
            geoData = JSON.parse(geoJsonBoundary);
        } catch (e) {
            console.error("Failed to parse GeoJSON", e);
        }
    }

    return (
        <div className="h-48 w-full rounded-xl overflow-hidden border border-white/10 shadow-inner">
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    {landId && (
                        <Popup>
                            <span className="font-bold">Parcel: {landId}</span>
                        </Popup>
                    )}
                </Marker>
                {geoData && (
                    <GeoJSON 
                        data={geoData} 
                        style={{
                            color: '#00E69A',
                            weight: 3,
                            opacity: 0.7,
                            fillColor: '#00E69A',
                            fillOpacity: 0.2
                        }} 
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;
