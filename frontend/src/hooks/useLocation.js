import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detectLocation = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Location detected successfully
          
          setLocation({ latitude, longitude });
        } catch (err) {
          console.error('Failed to update location:', err);
          setError('Failed to update location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    // Auto-detect location on mount if user is logged in
    if (localStorage.getItem('token')) {
      detectLocation();
    }
  }, []);

  return { location, loading, error, detectLocation };
};