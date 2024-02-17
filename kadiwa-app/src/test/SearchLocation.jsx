import React, { useState } from 'react';
import axios from 'axios';

function SearchLocation() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 10
        }
      });

      const data = response.data;
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMapClick = (latitude, longitude) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
  };

  const handleMapClick2 = (locationName) => {
    const formattedLocationName = encodeURIComponent(locationName);
    window.open(`https://www.google.com/maps/search/?api=1&query=${formattedLocationName}`, '_blank');
  };


  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter location..."
        className="border border-gray-300 rounded-md py-2 px-4 mr-2 w-64 focus:outline-none focus:border-blue-500"
      />
      <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Search
      </button>

      <div className="mt-8">
        {searchResults.map((result, index) => (
          <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
            <p className="text-lg font-semibold">{result.display_name}</p>
            <p className="text-gray-700">{result.address ? `${result.address.city || result.address.town || ''}, ${result.address.country}` : ''}</p>
            <p><strong>Latitude:</strong> {parseFloat(result.lat).toFixed(6)}</p>
            <p><strong>Longitude:</strong> {parseFloat(result.lon).toFixed(6)}</p>
            <button
              onClick={() => handleMapClick(result.lat, result.lon)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              (Long & Lat) Google Maps
            </button>
            <button
              onClick={() => handleMapClick2(result.display_name)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                  (Name) Google Maps
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchLocation;
