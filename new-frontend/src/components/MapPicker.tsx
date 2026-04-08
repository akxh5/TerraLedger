import React, { useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

interface DrawControlProps {
    onCreated: (data: any) => void;
    onDeleted: (data: any) => void;
}

const DrawControl = ({ onCreated, onDeleted }: DrawControlProps) => {
    const map = useMap();
    const drawControlRef = useRef<L.Control.Draw | null>(null);
    const featureGroupRef = useRef(new L.FeatureGroup());

    useEffect(() => {
        const fg = featureGroupRef.current;
        map.addLayer(fg);

        const drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polyline: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polygon: true,
                rectangle: true
            },
            edit: {
                featureGroup: fg,
                remove: true
            }
        });

        map.addControl(drawControl);
        drawControlRef.current = drawControl;

        const handleCreated = (e: any) => {
            const { layerType, layer } = e;
            if (layerType === 'polygon' || layerType === 'rectangle') {
                const geojson = (layer as L.Polygon).toGeoJSON();
                const bounds = (layer as L.Polygon).getBounds();
                const center = bounds.getCenter();

                // Clear previous layers to only keep one shape
                fg.clearLayers();
                fg.addLayer(layer);

                if (onCreated) {
                    onCreated({
                        lat: center.lat,
                        lng: center.lng,
                        geoJson: JSON.stringify(geojson.geometry)
                    });
                }
            }
        };

        const handleDeleted = () => {
            if (onDeleted) {
                onDeleted({ lat: '', lng: '', geoJson: '' });
            }
        };

        map.on(L.Draw.Event.CREATED, handleCreated);
        map.on(L.Draw.Event.DELETED, handleDeleted);

        return () => {
            map.off(L.Draw.Event.CREATED, handleCreated);
            map.off(L.Draw.Event.DELETED, handleDeleted);
            if (drawControlRef.current) {
                map.removeControl(drawControlRef.current);
            }
            map.removeLayer(fg);
        };
    }, [map, onCreated, onDeleted]);

    return null;
};

interface MapPickerProps {
    onLocationSelect: (data: any) => void;
    initialPosition?: [number, number];
}

const MapPicker = ({ onLocationSelect, initialPosition = [51.505, -0.09] }: MapPickerProps) => {
    const handleCreated = useCallback((data: any) => {
        onLocationSelect(data);
    }, [onLocationSelect]);

    const handleDeleted = useCallback((data: any) => {
        onLocationSelect(data);
    }, [onLocationSelect]);

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10">
            <MapContainer center={initialPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <DrawControl onCreated={handleCreated} onDeleted={handleDeleted} />
            </MapContainer>
        </div>
    );
};

export default MapPicker;
