'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
}

export function FormDropdown({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  icon,
  disabled,
  loading,
  searchable = true
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
      if (!isOpen) setSearchQuery('');
    }
  };

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const normalizedQuery = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return options.filter(option => 
      option.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery)
    );
  }, [options, searchQuery]);

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left bg-input ${
            isOpen ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-border'
          } ${(disabled || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            {icon && <span className="text-foreground-muted flex-shrink-0">{icon}</span>}
            <span className={`truncate ${value ? 'text-foreground' : 'text-foreground-muted'}`}>
              {loading ? 'Loading...' : (value || placeholder)}
            </span>
          </div>
          {loading ? (
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          ) : (
            <ChevronDown className={`text-foreground-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} size={18} />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              {searchable && (
                <div className="p-2 border-b border-border sticky top-0 bg-card/95 backdrop-blur-md z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={14} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500/30 outline-none text-foreground placeholder:text-foreground-muted shadow-sm"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
              
              <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        value === option 
                          ? 'bg-cyan-500/10 text-cyan-500' 
                          : 'text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      <span className="truncate pr-2">{option}</span>
                      {value === option && <Check size={14} className="flex-shrink-0" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-foreground-muted font-medium italic">
                    No results found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
