// ./components/NumberSearch.tsx
'use client';

import { useState } from 'react';
import { Search, Loader2, Phone } from 'lucide-react';

interface PhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  country: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

export default function NumberSearch() {
  const [areaCode, setAreaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchNumbers = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNumbers([]);

    try {
      const response = await fetch(`/api/search-numbers?areaCode=${areaCode}`);
      const data = await response.json();
      
      if (data.success) {
        setNumbers(data.numbers);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to search numbers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <Phone className="h-5 w-5" />
        Search Phone Numbers
      </h2>
      
      <form onSubmit={searchNumbers} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value)}
            placeholder="Area code (e.g., 703)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={3}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {numbers.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Available Numbers:</h3>
          {numbers.map((number, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="font-mono text-lg">{number.phoneNumber}</div>
              <div className="text-sm text-gray-600">
                {number.locality}, {number.region}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                SMS: {number.capabilities.sms ? 'Yes' : 'No'} | 
                Voice: {number.capabilities.voice ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}