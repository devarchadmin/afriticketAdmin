import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { X } from 'lucide-react'; // Ensure you have this icon library installed

const MapPickerModal = ({ isOpen, onClose, onLocationSelect }) => {
  const [position, setPosition] = useState([31.5497, 74.3436]); // Default to Lahore
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError('');
    try {
      const apiKey = '1c8a120ae0ed4d56afe28526f33dd6cc'; // Replace with your OpenCage API key
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: searchQuery,
            key: apiKey,
            limit: 5, // Limit the number of results
          },
        }
      );
      console.log("address", response);
      const results = response.data.results;
      setResults(results);
    } catch (error) {
      console.error('Error fetching geocode data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    const { lat, lng } = result.geometry;
    setPosition([lat, lng]);
    setSearchQuery(result.formatted);
    setResults([]); // Reset results to hide dropdown
    setSelectedResult(result);
  };

  const handleSubmit = () => {
    if (selectedResult) {
      const { lat, lng } = selectedResult.geometry;
      onLocationSelect([lat, lng]);
      onClose(); // Close the modal
    }
  };

  const MapEvents = () => {
    const map = useMap();

    React.useEffect(() => {
      map.setView(position, map.getZoom());
    }, [position]);

    return (
      <Marker position={position}>
        <Popup>Emplacement sélectionné</Popup>
      </Marker>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '600px',
          height: '80vh', // Make modal height adjustable
          maxHeight: '80vh', // Ensure modal does not exceed viewport height
          zIndex: 101,
          position: "absolute", // Positioning relative to the viewport
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      className="rounded-2xl border-none bg-white p-4 outline-none overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sélectionnez un emplacement</h2>
        <div onClick={onClose} className="cursor-pointer">
          <X size={20} />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="mb-4">
          <div className='flex items-center'>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a place"
              className="border rounded-full p-2 w-full"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="ml-2 bg-secondary-200 text-black p-2 rounded-full px-5 hover:bg-primary-500 cursor-pointer"
            >
              Recherche
            </button>
          </div>
          <p className="mt-2">
            {loading ? 'Searching...' : searchQuery ? `Search for "${searchQuery}"` : ''}
          </p>
          {results.length > 0 && (
            
            <ul className="border border-gray-300 rounded mt-2 max-h-60 overflow-auto">
              {results.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleResultClick(result)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {result.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="h-80">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents />
          </MapContainer>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedResult}
          className="bg-secondary-200 text-black p-2 rounded-full px-5 hover:bg-primary-500 cursor-pointer"
        >
          Soumettre
        </button>
      </div>
    </Modal>
  );
};

export default MapPickerModal;
