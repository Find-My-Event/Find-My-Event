import { useState, useEffect } from 'react';

export const useLikedEvents = () => {
  const [likedEvents, setLikedEvents] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('likedEvents') || '[]');
    } catch {
      return [];
    }
  });

  const toggleLike = (id: string) => {
    if (!id) return;
    const newLiked = likedEvents.includes(id) 
      ? likedEvents.filter(e => e !== id) 
      : [...likedEvents, id];
      
    localStorage.setItem('likedEvents', JSON.stringify(newLiked));
    setLikedEvents(newLiked);
    window.dispatchEvent(new Event('likedEventsChanged'));
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
