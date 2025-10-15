'use client';

import { Suspense, useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'fromPortfolio';
const EXPIRATION_TIME = 2 * 60 * 1000; // 2 minutes

const BackToPortfolioButton: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <BackToPortfolioLogic />
    </Suspense>
  );
};

const BackToPortfolioLogic: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  // ✅ safe lazy initializer
  const [isFromPortfolio, setIsFromPortfolio] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false; // SSR guard

    const storedData = sessionStorage.getItem(STORAGE_KEY);
    if (!storedData) return false;

    try {
      const { timestamp } = JSON.parse(storedData);
      return Date.now() - timestamp < EXPIRATION_TIME;
    } catch {
      return false;
    }
  });

  // ✅ this effect only runs client-side anyway
  useEffect(() => {
    const queryFrom = searchParams?.get('from');
    if (queryFrom === 'portfolio') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsFromPortfolio(true);
    }
  }, [searchParams]);

  const handleRedirect = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = 'https://abdulhamid-sa.vercel.app/projects';
  };

  if (!isFromPortfolio) return null;

  return (
    <div className="fixed bottom-24 left-0 z-50 flex items-center">
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center bg-background rounded-md justify-center h-10 w-10 p-1 shadow-lg transition-transform active:scale-95"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
        >
          <ArrowRightCircle className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {isOpen && (
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="ml-2 flex items-center"
        >
          <Button
            onClick={handleRedirect}
            className="flex items-center gap-2 border relative bg-background border-primary rounded-md bg-opacity-15 backdrop-blur-md px-5 py-4 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl active:scale-95"
          >
            Back to Portfolio
          </Button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center h-10 w-10 rounded-sm shadow-lg transition-transform active:scale-95"
          >
            <ArrowLeftCircle className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BackToPortfolioButton;
