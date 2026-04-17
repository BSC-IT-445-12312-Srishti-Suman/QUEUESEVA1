'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { useShopBooking } from '@/hooks/useShopBooking';
import { generateTimeSlots } from '@/lib/utils/slot-utils';
import Navbar from '@/components/layout/Navbar';

// Sub-components
import ShopHeader from '@/components/shop/ShopHeader';
import DayPicker from '@/components/shop/DayPicker';
import TimeSlotGrid from '@/components/shop/TimeSlotGrid';
import BookingSummaryCard from '@/components/shop/BookingSummaryCard';

import ShopBookingSkeleton from '@/components/shop/ShopBookingSkeleton';

export default function ShopBookingView({ params }: { params: { shopId: string } }) {
  const {
    shop,
    loading,
    authLoading,
    days,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    dbSlots,
    bookingLoading,
    toastMessage,
    setToastMessage,
    getSlotState,
    displayAsFull,
    handleBookSlot
  } = useShopBooking(params.shopId);

  if (loading || authLoading || !shop) {
    return <ShopBookingSkeleton />;
  }

  const generatedTimeSlots = generateTimeSlots(shop.slotDuration);
  const selectedSlotData = selectedTime ? dbSlots[selectedTime] : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar subtitle="Booking" />

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-glow-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-grow">
        <ShopHeader shop={shop} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Date & Time Selection */}
          <div className="lg:col-span-8 space-y-10">
            <DayPicker 
              days={days} 
              selectedDate={selectedDate} 
              onSelectDate={(date) => { setSelectedDate(date); setSelectedTime(null); }} 
            />

            <TimeSlotGrid 
              timeSlots={generatedTimeSlots}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              getSlotState={getSlotState}
              onShowToast={setToastMessage}
            />
          </div>

          {/* Right Side: Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <BookingSummaryCard 
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedSlotData={selectedSlotData}
              displayAsFull={displayAsFull}
              bookingLoading={bookingLoading}
              onConfirm={handleBookSlot}
            />
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-red-500 text-white px-6 py-3 rounded-full font-medium shadow-glow-red flex items-center space-x-2 whitespace-nowrap"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
