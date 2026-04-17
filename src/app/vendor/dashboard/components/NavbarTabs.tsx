'use client';

import { LayoutDashboard, Users, MessageSquare, Settings, History } from 'lucide-react';
import { motion } from 'framer-motion';

export type DashboardTab = 'overview' | 'queue' | 'reviews' | 'history' | 'settings';

interface NavbarTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  reviewCount: number;
}

export default function NavbarTabs({ activeTab, onTabChange, reviewCount }: NavbarTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'queue', label: 'Queue Manager', icon: Users },
    { id: 'reviews', label: 'Feedback', icon: MessageSquare, badge: reviewCount },
    { id: 'history', label: 'Past Bookings', icon: History },
    { id: 'settings', label: 'Shop Settings', icon: Settings }
  ];

  return (
    <div className="flex items-center gap-1 bg-card/50 backdrop-blur-xl border border-border p-1 rounded-2xl w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as DashboardTab)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
              isActive ? 'text-cyan-500' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-cyan-500' : 'group-hover:text-cyan-500'}`} />
            <span className="relative z-10 hidden md:inline">{tab.label}</span>
            
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`relative z-10 flex items-center justify-center w-5 h-5 text-[10px] rounded-full font-black ${
                isActive ? 'bg-cyan-500 text-black' : 'bg-foreground/10 text-foreground-muted'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
