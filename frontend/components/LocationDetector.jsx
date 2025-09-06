import React from 'react';
import { useLocation } from '../src/hooks/useLocation';

const LocationDetector = () => {
  const { location, loading, error, detectLocation } = useLocation();

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Location Status</h3>
      
      {loading && <p className="text-blue-600">Detecting location...</p>}
      
      {error && (
        <div className="text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={detectLocation}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Location Detection
          </button>
        </div>
      )}
      
      {location && (
        <div className="text-green-600">
          <p>✓ Location detected and saved</p>
          <p className="text-sm text-gray-600">
            Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
          </p>
        </div>
      )}
      
      {!location && !loading && !error && (
        <button 
          onClick={detectLocation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Detect My Location
        </button>
      )}
    </div>
  );
};

export default LocationDetector;