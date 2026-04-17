'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '@/lib/firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import ProfileModal from './ProfileModal';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export default function Navbar({ title = "Queue Seva", subtitle = "Customer" }: NavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <>
      <header className="border-b border-foreground/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => router.push('/customer/dashboard')}
          >
            <div className="font-bold text-xl tracking-tight">
              {title} <span className="text-cyan-500">{subtitle}</span>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-foreground/5 transition-colors border border-transparent hover:border-foreground/10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-black font-bold text-xs ring-2 ring-cyan-500/20">
                {user?.email?.charAt(0).toUpperCase() || <User size={16} />}
              </div>
              <ChevronDown size={14} className={`text-foreground-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50"
                 >
                   <div className="p-4 border-b border-border bg-foreground/5">
                    <p className="text-xs font-bold text-foreground">Logged in as</p>
                    <p className="text-sm text-foreground-muted truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-cyan-500/10 hover:text-cyan-500 transition-colors"
                    >
                      <Settings size={16} className="mr-3" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
}
