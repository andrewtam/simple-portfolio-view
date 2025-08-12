'use client';

import { useState } from 'react';
import AnimatedBackground from '@/components/ui/animated-tabs';
import { AnimatePresence, motion } from 'framer-motion';

const TOTAL = "3256";
const CENTS = ".10";

export default function BalanceHeader() {
  const TABS = ["1D", "1M", "3M", "1Y", "5Y"];
  const DELTA_LABELS = ["$132.23 (2%)", "$418.76 (6%)", "$1240.52 (52%)", "$2569.11 (150%)", "$3169.11 (1278%)"];
  const [activeTab, setActiveTab] = useState<string>(TABS[2]);
  const [deltaLabel, setDeltaLabel] = useState<string>(DELTA_LABELS[2]);

  function handleTabClick(index: number) {
    setActiveTab(TABS[index]);
    setDeltaLabel(DELTA_LABELS[index]);
  }

  return (
    <div className="flex justify-between items-end mb-4">
      {/* Left: Title + amount */}
      <div>
        <h1 className="text-3xl leading-[36px] font-bold text-gray-900 tracking-tight">Balance</h1>
        <div className="flex items-end">
          <div className="flex items-baseline">
            <span className="text-xl text-gray-900 font-bold leading-none inline-block -translate-y-4.5">$</span>
            <span className="text-5xl leading-tight font-bold font-black text-gray-900">{TOTAL}</span>
            <span className="text-xl text-gray-900 font-bold leading-none inline-block -translate-y-4.5">{CENTS}</span>
          </div>
        </div>
      </div>

      {/* Right: delta on top, timeframe selector below */}
      <div className="flex flex-col items-end gap-3 self-end mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={deltaLabel}
            className="flex items-center text-green-600"
            initial={{ opacity: 0.1, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeInOut"}}
          >
            <svg className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
            <span className="text-lg tracking-tight font-semibold inline-block">{deltaLabel}</span>
          </motion.div>
        </AnimatePresence>

        <div className="flex bg-white border border-gray-200 border-[1.5px] rounded-2xl p-1 h-9">
          <AnimatedBackground
            defaultValue={activeTab}
            onValueChange={(id) => {
              if (id) setActiveTab(id);
            }}
            className="rounded-4xl bg-blue-600"
            transition={{
              type: 'spring',
              bounce: 0.0,
              duration: 0.26,
            }}
          >
            {TABS.map((label, index) => (
              <button
                key={label}
                data-id={label}
                type="button"
                onClick={() => handleTabClick(index)}
                className="px-3 py-[3px] rounded-4xl text-sm font-semibold text-gray-700 hover:text-gray-900 data-[checked=false]:cursor-pointer data-[checked=true]:text-white"
              >
                {label}
              </button>
            ))}
          </AnimatedBackground>
        </div>
      </div>
    </div>
  );
}




