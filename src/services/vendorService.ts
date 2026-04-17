import { db } from "@/lib/firebase/config";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDocs,
  getDoc,
  increment,
  runTransaction
} from "firebase/firestore";
import { Booking, Slot } from "@/lib/firebase/db";

const BOOKINGS_COL = "bookings";
const SHOPS_COL = "shops";

export const vendorService = {
  /**
   * Listen to bookings for a shop today
   */
  subscribeToBookings: (shopId: string, callback: (bookings: (Booking & { slotData?: Slot })[]) => void) => {
    // Get all bookings for the shop
    // In a real app, we'd filter by today's date
    const q = query(
      collection(db, BOOKINGS_COL),
      where("shopId", "==", shopId)
    );

    return onSnapshot(q, async (snapshot) => {
      const bookingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];

      // Fetch slot data for each booking to show time/sequence
      const bookingsWithSlots = await Promise.all(bookingsList.map(async (booking) => {
        try {
          const slotSnap = await getDoc(doc(db, `${SHOPS_COL}/${booking.shopId}/slots`, booking.slotId));
          return {
            ...booking,
            slotData: slotSnap.exists() ? { id: slotSnap.id, ...slotSnap.data() } as Slot : undefined
          };
        } catch (err) {
          console.error("Error fetching slot for booking", booking.id, err);
          return booking;
        }
      }));

      callback(bookingsWithSlots);
    });
  },

  /**
   * Update booking status
   */
  updateBookingStatus: async (bookingId: string, status: Booking['status'], notes?: string, reason?: string) => {
    const bookingRef = doc(db, BOOKINGS_COL, bookingId);
    const updates: Partial<Booking> = { status };
    if (notes) updates.vendorNotes = notes;
    if (reason) updates.cancellationReason = reason;
    
    await updateDoc(bookingRef, updates);
  },

  /**
   * Advance queue: mark current as completed and next waiting as serving
   */
  advanceQueue: async (currentBookingId: string, shopId: string, nextBookingId?: string) => {
    await vendorService.updateBookingStatus(currentBookingId, 'completed');
    if (nextBookingId) {
      await vendorService.updateBookingStatus(nextBookingId, 'serving');
    }
  },

  /**
   * Mark as no-show with reason
   */
  markNoShow: async (bookingId: string, reason: string) => {
    await vendorService.updateBookingStatus(bookingId, 'no-show', undefined, reason);
  },

  /**
   * Fetch all slots for a shop to allow manual placement
   */
  getAvailableSlots: async (shopId: string, date: string) => {
    const q = query(
      collection(db, `${SHOPS_COL}/${shopId}/slots`),
      where("date", "==", date)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Slot));
  },

  /**
   * Manually add a customer to a slot
   */
  addManualBooking: async (shopId: string, slotId: string, userName: string, userPhone: string) => {
    const slotRef = doc(db, `${SHOPS_COL}/${shopId}/slots`, slotId);
    
    await runTransaction(db, async (transaction) => {
      const slotSnap = await transaction.get(slotRef);
      if (!slotSnap.exists()) throw new Error("Slot not found");
      
      const slotData = slotSnap.data() as Slot;
      const tokenNumber = slotData.currentBookings + 1;

      const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
        userId: 'manual-entry', // Special ID for walk-ins
        shopId,
        slotId,
        tokenNumber,
        status: 'waiting',
        isWaitlist: false,
        userName,
        userPhone,
        showContactToVendor: true
      };

      const bookingRef = doc(collection(db, BOOKINGS_COL));
      transaction.set(bookingRef, {
        ...bookingData,
        createdAt: serverTimestamp()
      });

      transaction.update(slotRef, {
        currentBookings: increment(1)
      });
    });
  }
};
