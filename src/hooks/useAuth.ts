import { useEffect, useState } from 'react';

export default function useAuth() {
  const token = localStorage.getItem('token');

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  useEffect(() => {
    window.addEventListener('storage', () => {
      const newToken = localStorage.getItem('token');
      setIsAuthenticated(!!newToken);
    });
  }, []);
  return { isAuthenticated };
}
