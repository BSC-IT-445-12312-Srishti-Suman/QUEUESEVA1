import { useState, useEffect, useMemo } from 'react';
import { vendorService } from '@/services/vendorService';
import { Booking, Shop, getShopByOwner, Slot } from '@/lib/firebase/db';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatDateLocal } from '@/lib/utils/slot-utils';

export type EnhancedBooking = Booking & { slotData?: Slot };

export function useVendorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [bookings, setBookings] = useState<EnhancedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Protected route logic
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/vendor/login');
    }
  }, [user, authLoading, router]);

  // Load Shop details & Real-time Bookings listeners
  useEffect(() => {
    if (!user) return;

    let unsubscribeBookings: () => void;

    const loadDashboard = async () => {
      try {
        const shopData = await getShopByOwner(user.uid);
        if (!shopData) {
          router.push('/vendor/onboarding');
          return;
        }
        setShop(shopData);

        unsubscribeBookings = vendorService.subscribeToBookings(shopData.id!, (updatedBookings) => {
          // Sort by slot time and then token number
          const sorted = [...updatedBookings].sort((a, b) => {
            const timeA = a.slotData?.startTime || '00:00';
            const timeB = b.slotData?.startTime || '00:00';
            if (timeA !== timeB) return timeA.localeCompare(timeB);
            return a.tokenNumber - b.tokenNumber;
          });
          setBookings(sorted);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      if (unsubscribeBookings) unsubscribeBookings();
    };
  }, [user, router]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => 
      b.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tokenNumber.toString().includes(searchQuery) ||
      b.userPhone?.includes(searchQuery)
    );
  }, [bookings, searchQuery]);

  const currentlyServing = useMemo(() => 
    bookings.find(b => b.status === 'serving'), 
  [bookings]);

  const waitingList = useMemo(() => 
    filteredBookings.filter(b => b.status === 'waiting'), 
  [filteredBookings]);

  const stats = useMemo(() => {
    return {
      waiting: bookings.filter(b => b.status === 'waiting').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      noShow: bookings.filter(b => b.status === 'no-show').length,
      total: bookings.length,
      avgRating: shop?.avgRating || 0,
      numReviews: shop?.numReviews || 0
    };
  }, [bookings, shop]);

  const handleAdvanceQueue = async (bookingId: string) => {
    const nextWaiting = bookings.find(b => b.status === 'waiting' && b.id !== bookingId);
    await vendorService.advanceQueue(bookingId, shop!.id!, nextWaiting?.id);
  };

  const handleStartServing = async (bookingId: string) => {
    await vendorService.updateBookingStatus(bookingId, 'serving');
  };

  const handleNoShow = async (bookingId: string, reason: string) => {
    await vendorService.markNoShow(bookingId, reason);
    // Auto call next if the one marked no-show was the one being served
    if (currentlyServing?.id === bookingId) {
       const nextWaiting = bookings.find(b => b.status === 'waiting' && b.id !== bookingId);
       if (nextWaiting) {
         await handleStartServing(nextWaiting.id!);
       }
    }
  };

  // Auto mark no-shows for expired slots
  useEffect(() => {
    if (bookings.length === 0 || !shop) return;

    const autoMarkNoShows = async () => {
      const todayStr = formatDateLocal(new Date());
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (const booking of bookings) {
        if (booking.status !== 'waiting') continue; // Only auto mark waiting ones
        if (!booking.slotData) continue;

        let shouldMark = false;
        
        // If booking date is before today
        if (booking.slotData.date < todayStr) {
          shouldMark = true;
        } 
        // If booking date is today but time is way past (e.g., 30 mins grace)
        else if (booking.slotData.date === todayStr) {
          const [h, m] = booking.slotData.startTime.split(':').map(Number);
          const slotMinutes = h * 60 + m;
          if (currentMinutes > slotMinutes + 30) {
            shouldMark = true;
          }
        }

        if (shouldMark) {
          console.log(`Auto-marking booking ${booking.id} as no-show`);
          await vendorService.markNoShow(booking.id!, "Automated: Appointment time passed");
        }
      }
    };

    // Run once on initial load and then every 5 minutes
    autoMarkNoShows();
    const interval = setInterval(autoMarkNoShows, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [bookings, shop]);

  return {
    user,
    shop,
    setShop,
    bookings,
    filteredBookings,
    currentlyServing,
    waitingList,
    stats,
    loading: loading || authLoading,
    searchQuery,
    setSearchQuery,
    handleAdvanceQueue,
    handleStartServing,
    handleNoShow
  };
}
