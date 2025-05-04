import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchEmployees } from '../api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const EmployeeMap = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEmployees();
      console.log('Full employee data:', data);
      setEmployees(data || []);
    };
    getData();
  }, []);

  const filteredEmployees =
    search.trim() === ''
      ? employees
      : employees.filter((emp) =>
          emp.firstName?.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employee Locations</h2>

      <input
        className="form-control mb-3"
        placeholder="Search by first name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <MapContainer
        center={[20, 0]} // Default center
        zoom={2}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredEmployees.map((emp, index) => {
          const lat = parseFloat(emp.latitude);
          const lng = parseFloat(emp.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            return (
              <Marker key={index} position={[lat, lng]}>
                <Popup>
                  <strong>{emp.firstName} {emp.lastName}</strong><br />
                  {emp.email}<br />
                  {emp.city}, {emp.country}
                </Popup>
              </Marker>
            );
          }

          return null; // Skip invalid coordinates
        })}
      </MapContainer>
    </div>
  );
};

export default EmployeeMap;
