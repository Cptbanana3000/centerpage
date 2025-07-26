'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeModal = ({ isOpen, onClose, onSignUp }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-2 sm:px-4"
      >
        <div className="bg-white border-2 border-black p-6 sm:p-8 w-full max-w-2xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="pr-8">
            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Get 3 Free Brand Analyses
            </h2>

            {/* Subheading */}
            <p className="text-gray-800 mb-6 text-lg">
              Start validating your brand ideas instantly. No credit card required.
            </p>

            {/* CTA Button */}
            <button
              onClick={onSignUp}
              className="bg-black text-white font-semibold py-3 px-8 w-full sm:w-auto hover:bg-gray-800 transition-colors"
            >
              Get Free Credits
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
