'use client';

import { useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'fromPortfolio';
const EXPIRATION_TIME = 2 * 60 * 1000;

const BackToPortfolioButton: React.FC = () => {
  const location = useLocation();
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFrom = params.get('from');
    const storedData = sessionStorage.getItem(STORAGE_KEY);

    if (queryFrom === 'portfolio') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsFromPortfolio(true);
    } else if (storedData) {
      const { timestamp } = JSON.parse(storedData);
      if (Date.now() - timestamp < EXPIRATION_TIME) {
        setIsFromPortfolio(true);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        setIsFromPortfolio(false);
      }
    }
  }, [location.search]);

  const handleBackToPortfolio = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = 'https://abdulhamid-sa.vercel.app/projects';
  };

  if (!isFromPortfolio) return null;

  return (
    <div className="fixed bottom-30 left-5 z-50">
      <Button
        onClick={handleBackToPortfolio}
        className="flex items-center gap-2 rounded-full bg-opacity-15 backdrop-blur-md px-6 py-2 shadow-lg transition-all hover:shadow-xl hover:bg-opacity-25 active:scale-95"
      >
        <ArrowLeftCircle className="w-6 h-6" />
        Back to Portfolio
      </Button>
    </div>
  );
};

export default BackToPortfolioButton;
