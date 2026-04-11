import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useLikedEvents = () => {
  const { user, updateProfile, isLoggedIn } = useAuth();
  
  const [likedEvents, setLikedEvents] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('likedEvents') || '[]');
    } catch {
      return [];
    }
  });

  // When user logs in, merge local favorites into backend, then use backend's favorites
  useEffect(() => {
    if (isLoggedIn && user?.favEvents) {
      const currentLocal = JSON.parse(localStorage.getItem('likedEvents') || '[]');
      const backendFavs = user.favEvents;
      
      const mergedSet = new Set([...currentLocal, ...backendFavs]);
      const mergedArray = Array.from(mergedSet);
      
      setLikedEvents(mergedArray);
      localStorage.setItem('likedEvents', JSON.stringify(mergedArray));
      
      if (mergedArray.length > backendFavs.length) {
        updateProfile({ favEvents: mergedArray }).catch(() => {});
      }
    }
  }, [isLoggedIn, user?.id]);

  const toggleLike = async (id: string) => {
    if (!id) return;
    
    setLikedEvents(prev => {
      const newLiked = prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id];
      localStorage.setItem('likedEvents', JSON.stringify(newLiked));
      window.dispatchEvent(new Event('likedEventsChanged'));
      
      if (isLoggedIn) {
        updateProfile({ favEvents: newLiked }).catch(console.error);
      }
      
      return newLiked;
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setLikedEvents(JSON.parse(localStorage.getItem('likedEvents') || '[]'));
      } catch {
        // ignore
      }
    };
    window.addEventListener('likedEventsChanged', handleStorageChange);
    return () => window.removeEventListener('likedEventsChanged', handleStorageChange);
  }, []);

  const isLiked = (id: string) => id ? likedEvents.includes(id) : false;

  return { likedEvents, toggleLike, isLiked };
};
