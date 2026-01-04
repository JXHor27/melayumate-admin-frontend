import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

function AccordionItem({ title, icon, isOpen, onClick, children }) {
  return (
    <div className="border border-slate-500 dark:border-zinc-700 rounded-lg">
      {/* The clickable header */}
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-2 sm:p-4 text-left font-semibold text-black dark:text-white cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-purple-500">{icon}</span>
          <span>{title}</span>
        </div>
        <FaChevronDown 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* The collapsible content area */}
      <div
        className={`overflow-x-hidden overflow-y-auto transition-all duration-500 ease-in-out
          ${isOpen ? 'max-h-[700px]' : 'max-h-0'}
        `}
      >
        <div className="p-4 pt-0 text-gray-900 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;