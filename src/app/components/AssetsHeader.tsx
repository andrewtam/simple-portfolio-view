'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  title?: string;
  onFilterClick?: () => void;
};

export default function AssetsHeader({ title = "Assets", onFilterClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <div ref={menuRef} className="relative">
        <button
          className="flex items-center gap-1 px-4 py-2 text-sm bg-white font-semibold text-gray-700 border-[1.5px] border-gray-200 rounded-4xl cursor-pointer"
          onClick={() => {
            setIsOpen((prev) => !prev);
            onFilterClick?.();
          }}
        >
          <span>Filter</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              role="menu"
              aria-label="Filter options"
              className="absolute right-0 top-full mt-2 w-36 rounded-2xl border border-gray-200 bg-white shadow-md p-1 z-10"
              initial={{ opacity: 0.0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1}}
              exit={{ opacity: 0.0, scale: 0.90 }}
              transition={{ duration: 0.10, ease: 'easeOut' }}
            >
              {['Name', 'Price', 'Value'].map((option) => (
                <button
                  key={option}
                  role="menuitemradio"
                  aria-checked={selected === option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between font-medium rounded-lg px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-150`}
                  style={{ transitionTimingFunction: 'ease' }}
                >
                  <span>{option}</span>
                  {selected === option && (
                    <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


