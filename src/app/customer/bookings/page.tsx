'use client';

import {ArrowLeft, Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { useCustomerBookings } from '@/hooks/useCustomerBookings';
import Navbar from '@/components/layout/Navbar';
import { Skeleton } from '@/components/ui/Skeleton';
import BookingsSkeleton from '@/components/bookings/BookingsSkeleton';

// Extracted Components
import BookingCard from '@/components/bookings/BookingCard';
import ManageBookingModal from '@/components/bookings/ManageBookingModal';
import DeleteBookingModal from '@/components/bookings/DeleteBookingModal';
import FeedbackModal from '@/components/bookings/FeedbackModal';
import EmptyBookings from '@/components/bookings/EmptyBookings';
import { useBookingFilters, SortOption } from '@/hooks/useBookingFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function CustomerBookings() {
  const {
    authLoading,
    bookings,
    loading,
    selectedBooking,
    setSelectedBooking,
    bookingToDelete,
    setBookingToDelete,
    actionLoading,
    handleCancel,
    handleReschedule,
    router
  } = useCustomerBookings();

  const [bookingForFeedback, setBookingForFeedback] = useState<(typeof bookings)[0] | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    filteredAndSortedBookings
  } = useBookingFilters(bookings);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest First', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Vendor Name', value: 'vendor-name' },
    { label: 'Status', value: 'status' }
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <Navbar subtitle="Bookings" />
        <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-grow">
          <div className="mb-12">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <BookingsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-violet rounded-full mix-blend-screen filter blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      
      <Navbar subtitle="Bookings" />
      
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => router.push('/customer/dashboard')}
              className="text-foreground-muted hover:text-foreground flex items-center text-sm font-medium transition-colors mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-foreground-muted text-sm mt-1">View your active tokens and queue status.</p>
          </div>
        </div>

        {bookings.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
              <input 
                type="text"
                placeholder="Search by vendor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-foreground placeholder:text-foreground-muted shadow-sm font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative min-w-[200px]" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm font-medium text-foreground shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="text-foreground-muted group-hover:text-cyan-500 transition-colors" size={16} />
                    <span>{currentSortLabel}</span>
                  </div>
                  <ChevronDown className={`text-foreground-muted transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 left-0 mt-2 p-1 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all ${
                            sortBy === option.value 
                              ? 'bg-cyan-500/10 text-cyan-500' 
                              : 'text-foreground-muted hover:bg-foreground/5 hover:text-foreground'
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && <Check size={14} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex p-1 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl mb-8 w-fit overflow-x-auto max-w-full">
            {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-cyan-500 text-black shadow-glow-cyan/20' 
                    : 'text-foreground-muted hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {bookings.length === 0 ? (
          <EmptyBookings />
        ) : filteredAndSortedBookings.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border/50">
            <p className="text-foreground-muted mb-2">No bookings found matching &quot;{searchQuery}&quot;</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-cyan-500 hover:text-cyan-400 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedBookings.map((booking, idx) => (
              <BookingCard 
                key={booking.id}
                booking={booking}
                idx={idx}
                onEdit={setSelectedBooking}
                onDelete={setBookingToDelete}
                onFeedback={setBookingForFeedback}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit/Reschedule Modal */}
      <ManageBookingModal 
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onReschedule={handleReschedule}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBookingModal 
        booking={bookingToDelete}
        onClose={() => setBookingToDelete(null)}
        onConfirm={handleCancel}
        loading={actionLoading}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        booking={bookingForFeedback}
        onClose={() => setBookingForFeedback(null)}
        onSuccess={() => {
          // You could show a global toast here if you have a toast context
          setBookingForFeedback(null);
        }}
      />
    </div>
  );
}
