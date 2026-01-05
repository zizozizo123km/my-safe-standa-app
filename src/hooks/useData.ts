import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

// Define the interface for a single data item (Movie/Netflix item)
interface DataItem {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  releaseYear: number;
  rating: number;
  genre: string;
}

interface UseDataResult {
  data: DataItem[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper function to generate mock data simulating 60 Netflix items
const generateMockData = (count: number): DataItem[] => {
  const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Documentary', 'Sci-Fi'];
  
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const year = 1995 + (index % 28);
    
    return {
      id: id,
      title: `Netflix Hit ${id}`,
      posterUrl: `/api/posters/${id}.jpg`, // Placeholder URL
      description: `A detailed summary for item number ${id}. A must-watch cinematic experience.`,
      releaseYear: year,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
      genre: genres[index % genres.length],
    };
  });
};

/**
 * Custom hook for fetching and managing resource data (simulating 60 items).
 * @param url The API endpoint to fetch data from (ignored in mock simulation).
 */
const useData = (url: string = '/catalog'): UseDataResult => {
  const [data, setData] = useState<DataItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    // --- Simulation of API Call ---
    try {
      // In a real environment, you would use apiClient here:
      // const response = await apiClient.get<DataItem[]>(url);
      // setData(response.data);

      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 750));

      const mockData = generateMockData(60);

      if (mockData.length === 0) {
        throw new Error("The endpoint returned no items.");
      }
      
      setData(mockData);

    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
      // Use type checking on the error in a production setup
      setError('Could not retrieve data catalog. Please check network connection.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, triggerFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    setTriggerFetch(prev => prev + 1);
  };

  return { data, loading, error, refetch };
};

export default useData;