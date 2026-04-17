'use client';

import { useState } from 'react';
import VendorNavbar from '@/components/layout/VendorNavbar';
import { useVendorDashboard, EnhancedBooking } from './hooks/useVendorDashboard';
import DashboardSkeleton from './components/DashboardSkeleton';
import ServingNowCard from './components/ServingNowCard';
import StatsOverview from './components/StatsOverview';
import QueueList from './components/QueueList';
import NoShowModal from './components/NoShowModal';
import ManualBookingModal from './components/ManualBookingModal';
import FeedbackList from './components/FeedbackList';
import BookingHistoryList from './components/BookingHistoryList';
import NavbarTabs, { DashboardTab } from './components/NavbarTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import VendorProfileModal from '@/components/layout/VendorProfileModal';

export default function VendorDashboard() {
  const {
    shop,
    setShop,
    currentlyServing,
    waitingList,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    handleAdvanceQueue,
    handleStartServing,
    handleNoShow
  } = useVendorDashboard();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [noShowBooking, setNoShowBooking] = useState<EnhancedBooking | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const reviewCount = stats.numReviews || 0;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-glow-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-glow-violet rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <VendorNavbar shop={shop} onShopUpdate={(updatedShop) => setShop(updatedShop)} />

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-32">
        {/* Dashboard Header - Compact & Creative */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 shadow-glow-cyan/10">
                <LayoutDashboard size={24} />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-white to-foreground-muted bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xs text-foreground-muted uppercase tracking-widest font-black mt-0.5">
                  Real-time Queue Management
                </p>
             </div>
          </div>

          <NavbarTabs 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              if (tab === 'settings') {
                setIsProfileModalOpen(true);
              } else {
                setActiveTab(tab);
              }
            }} 
            reviewCount={reviewCount}
          />
        </div>

        {/* Tab Content with Motion */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  <div className="lg:col-span-2 h-full">
                    <ServingNowCard 
                      currentlyServing={currentlyServing}
                      waitingList={waitingList}
                      onAdvance={handleAdvanceQueue}
                      onStart={handleStartServing}
                      onNoShow={(b) => setNoShowBooking(b)}
                    />
                  </div>
                  <div className="lg:col-span-1 h-full">
                    <StatsOverview 
                      stats={stats} 
                      onAddWalkIn={() => setIsManualBookingOpen(true)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'queue' && (
              <motion.div
                key="queue"
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <QueueList 
                  waitingList={waitingList}
                  currentlyServingId={currentlyServing?.id}
                  onStart={handleStartServing}
                  onNoShow={(b) => setNoShowBooking(b)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {shop?.id && (
                  <FeedbackList shopId={shop.id} />
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {shop?.id && (
                  <BookingHistoryList shopId={shop.id} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modals */}
        <NoShowModal 
          isOpen={!!noShowBooking}
          onClose={() => setNoShowBooking(null)}
          customerName={noShowBooking?.userName || 'Customer'}
          tokenNumber={noShowBooking?.tokenNumber || 0}
          onConfirm={(reason) => {
            if (noShowBooking) {
              handleNoShow(noShowBooking.id!, reason);
              setNoShowBooking(null);
            }
          }}
        />

        <ManualBookingModal 
          isOpen={isManualBookingOpen}
          onClose={() => setIsManualBookingOpen(false)}
          shopId={shop?.id || ''}
          onSuccess={() => {}}
        />

        <VendorProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => {
            setIsProfileModalOpen(false);
            if (activeTab === 'settings') setActiveTab('overview');
          }} 
          shopData={shop}
          onShopUpdate={(updatedShop) => setShop(updatedShop)}
        />
      </main>
    </div>
  );
}
