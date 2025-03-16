'use client';

import { Suspense, useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeftCircle, ChevronRight } from 'lucide-react';
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

  const [isOpen, setIsOpen] = useState(false);

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
    <div className="fixed bottom-12 left-[-40px] z-50 flex items-center">
      <motion.button
        initial={{ x: 0 }}
        animate={{ x: isOpen ? 140 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-primary shadow-lg transition-all hover:bg-opacity-90 active:scale-95"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChevronRight
          className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <motion.div
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: isOpen ? 0 : -150, opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="ml-2"
      >
        <Button
          onClick={handleBackToPortfolio}
          className="flex items-center gap-2 rounded-full bg-opacity-15 backdrop-blur-md px-6 py-2 shadow-lg transition-all hover:shadow-xl hover:bg-opacity-25 active:scale-95"
        >
          <ArrowLeftCircle className="w-6 h-6" />
          <span>Back to Portfolio</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default BackToPortfolioButton;
