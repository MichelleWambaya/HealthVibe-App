'use client';

import { useState } from 'react';

export default function HospitalFinder() {
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI search for hospitals
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: "City General Hospital",
          address: "123 Main Street, City Center",
          distance: "2.3 km",
          phone: "+1 (555) 123-4567",
          emergency: true,
          rating: 4.5
        },
        {
          id: 2,
          name: "Metro Medical Center",
          address: "456 Oak Avenue, Downtown",
          distance: "3.7 km",
          phone: "+1 (555) 987-6543",
          emergency: true,
          rating: 4.2
        },
        {
          id: 3,
          name: "Community Health Clinic",
          address: "789 Pine Street, Suburbs",
          distance: "5.1 km",
          phone: "+1 (555) 456-7890",
          emergency: false,
          rating: 4.0
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Find Nearest Hospital</h2>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your location or current address
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 123 Main St, City, State"
              className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !location.trim()}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium px-4 py-2 transition-colors text-sm"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Nearby Medical Facilities</h3>
            {searchResults.map((hospital) => (
              <div key={hospital.id} className="border border-gray-200 p-3 hover:border-red-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-gray-900">{hospital.name}</h4>
                      {hospital.emergency && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5">
                          Emergency
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{hospital.address}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Distance: {hospital.distance}</span>
                      <span>Phone: {hospital.phone}</span>
                      <span>Rating: {hospital.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 transition-colors">
                      Directions
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 transition-colors">
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Emergency Instructions</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• For life-threatening emergencies, call 911 immediately</li>
            <li>• If symptoms are severe or worsening rapidly, go to the nearest emergency room</li>
            <li>• Always inform medical staff about any home remedies you've tried</li>
            <li>• Bring a list of current medications and allergies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
