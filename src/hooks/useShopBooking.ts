'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Shop, Slot, Booking, createBooking, getUserProfile, createSlot } from '@/lib/firebase/db';
import { useAuth } from '@/contexts/AuthContext';
import { generateDays, generateTokenNumber, formatDateLocal } from '@/lib/utils/slot-utils';

export function useShopBooking(shopId: string) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const days = generateDays(14); // Next 14 days
  const [selectedDate, setSelectedDate] = useState(days[0].dateStr);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dbSlots, setDbSlots] = useState<{ [time: string]: Slot }>({});
  const [userBookings, setUserBookings] = useState<Set<string>>(new Set());

  // Prevent UI flickering logic
  const [lastSelectedFullState, setLastSelectedFullState] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/customer/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchShopAndSlots = async () => {
      try {
        setLoading(true);
        // Fetch Shop Info
        const shopDoc = await getDoc(doc(db, 'shops', shopId));
        if (shopDoc.exists()) {
          setShop({ id: shopDoc.id, ...shopDoc.data() } as Shop);
        }

        // Listen to active slots for selected date to show capacity
        const qSlots = query(collection(db, `shops/${shopId}/slots`), where('date', '==', selectedDate));
        const unsubscribeSlots = onSnapshot(qSlots, (snapshot) => {
          const slotMap: { [time: string]: Slot } = {};
          snapshot.forEach(doc => {
            const data = doc.data() as Slot;
            slotMap[data.startTime] = { id: doc.id, ...data };
          });
          setDbSlots(slotMap);
          setLoading(false);
        });

        // Listen to user's active bookings to prevent double booking
        let unsubscribeBookings = () => {};
        if (user) {
          const qBookings = query(collection(db, 'bookings'), where('userId', '==', user.uid));
          unsubscribeBookings = onSnapshot(qBookings, (snapshot) => {
            const bookedSlotIds = new Set<string>();
            snapshot.forEach(doc => {
              const b = doc.data() as Booking;
              if (b.shopId === shopId && (b.status === 'waiting' || b.status === 'serving')) {
                bookedSlotIds.add(b.slotId);
              }
            });
            setUserBookings(bookedSlotIds);
          });
        }

        return () => {
          unsubscribeSlots();
          unsubscribeBookings();
        };
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    if (user) {
      const cleanup = fetchShopAndSlots();
      return () => {
        cleanup.then(unsub => unsub && unsub());
      };
    }
  }, [shopId, selectedDate, user]);

  const getSlotState = (time: string) => {
    // Check if slot is in the past for today
    const today = formatDateLocal(new Date());
    if (selectedDate === today) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [h, m] = time.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      if (slotMinutes < currentMinutes) return 'past';
    }

    const slotData = dbSlots[time];
    if (slotData && slotData.id && userBookings.has(slotData.id)) return 'already_booked';
    if (!slotData) return 'available'; // No bookings yet
    if (shop && slotData.currentBookings >= shop.maxCapacity) return 'full';
    return 'available';
  };

  const isSelectedFull = selectedTime ? getSlotState(selectedTime) === 'full' : false;

  useEffect(() => {
    if (!bookingLoading) {
      setLastSelectedFullState(isSelectedFull);
    }
  }, [isSelectedFull, bookingLoading]);

  const displayAsFull = bookingLoading ? lastSelectedFullState : isSelectedFull;

  const handleBookSlot = async (isWaitlist: boolean = false) => {
    if (!user || !shop || !selectedTime) return;
    setBookingLoading(true);

    try {
      let slotId = dbSlots[selectedTime]?.id;
      let assignedWaitlistNumber = 0;

      if (!slotId) {
        assignedWaitlistNumber = isWaitlist ? 1 : 0;
        slotId = await createSlot(shopId, {
          startTime: selectedTime,
          date: selectedDate,
          currentBookings: isWaitlist ? 0 : 1,
          waitlistCount: isWaitlist ? 1 : 0
        });
      } else {
        const slotRef = doc(db, `shops/${shopId}/slots`, slotId);
        
        assignedWaitlistNumber = await runTransaction(db, async (transaction) => {
          const slotDoc = await transaction.get(slotRef);
          if (!slotDoc.exists()) throw new Error("Slot not found");
          
          const currentData = slotDoc.data();
          const currentBookings = currentData.currentBookings || 0;
          const waitlistCount = currentData.waitlistCount || 0;

          if (!isWaitlist && currentBookings >= shop.maxCapacity) {
             throw new Error("Sorry, this slot just became full! Please click it again to join the waitlist.");
          }

          const newWaitlistNumber = isWaitlist ? waitlistCount + 1 : 0;

          transaction.update(slotRef, {
            currentBookings: isWaitlist ? currentBookings : currentBookings + 1,
            waitlistCount: isWaitlist ? waitlistCount + 1 : waitlistCount
          });

          return newWaitlistNumber;
        });
      }

      const tokenNumber = generateTokenNumber(user.uid, shopId, slotId!);
      const profile = await getUserProfile(user.uid);

      const bookingId = await createBooking({
        userId: user.uid,
        shopId: shopId,
        slotId: slotId!, 
        tokenNumber: tokenNumber,
        status: 'waiting',
        isWaitlist,
        waitlistNumber: assignedWaitlistNumber,
        userName: profile?.displayName || user.displayName || 'Guest',
        userEmail: profile?.email || user.email || '',
        userPhone: profile?.phoneNumber || '',
        showContactToVendor: profile?.showContactToVendor ?? true
      });

      router.push(`/ticket/${bookingId}`);

    } catch (error: unknown) {
      console.error("Error booking slot", error);
      setToastMessage(error instanceof Error ? error.message : "Failed to book slot. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return {
    shop,
    loading,
    authLoading,
    days,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    dbSlots,
    userBookings,
    bookingLoading,
    toastMessage,
    setToastMessage,
    getSlotState,
    displayAsFull,
    handleBookSlot,
    router
  };
}
