'use client';

import { Suspense, useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'fromPortfolio';
const EXPIRATION_TIME = 2 * 60 * 1000;

const BackToPortfolioButton: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <BackToPortfolioLogic />
    </Suspense>
  );
};

const BackToPortfolioLogic: React.FC = () => {
  const searchParams = useSearchParams();
  const [isFromPortfolio, setIsFromPortfolio] = useState(() => {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    if (!storedData) return false;
    const { timestamp } = JSON.parse(storedData);
    return Date.now() - timestamp < EXPIRATION_TIME;
  });

  useEffect(() => {
    const queryFrom = searchParams?.get('from');

    if (queryFrom === 'portfolio') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsFromPortfolio(true);
    }
  }, [searchParams]);

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
        <span>Back to Portfolio</span>
      </Button>
    </div>
  );
};

export default BackToPortfolioButton;
