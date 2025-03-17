import { useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

const STORAGE_KEY = 'fromPortfolio';
const EXPIRATION_TIME = 2 * 60 * 1000;

const BackToPortfolioButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryFrom = urlParams.get('from');
    if (queryFrom === 'portfolio') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsFromPortfolio(true);
    } else {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (storedData) {
        try {
          const { timestamp } = JSON.parse(storedData);
          if (Date.now() - timestamp < EXPIRATION_TIME) {
            setIsFromPortfolio(true);
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);

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
