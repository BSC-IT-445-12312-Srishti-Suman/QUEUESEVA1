import { getBookingsHistory, Booking } from "@/lib/firebase/db";

export const BookingService = {
  async getCustomerHistory(userId: string, status?: Booking['status'][]) {
    try {
      return await getBookingsHistory({
        userId,
        status,
        limitNumber: 50
      });
    } catch (error) {
      console.error("BookingService.getCustomerHistory error:", error);
      throw error;
    }
  },

  async getVendorHistory(shopId: string, status?: Booking['status'][]) {
    try {
      return await getBookingsHistory({
        shopId,
        status,
        limitNumber: 100
      });
    } catch (error) {
      console.error("BookingService.getVendorHistory error:", error);
      throw error;
    }
  }
};
