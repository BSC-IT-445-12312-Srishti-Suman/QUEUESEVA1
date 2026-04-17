import { 
  Feedback, 
  submitFeedback, 
  getFeedbacksByShopId, 
  getFeedbackForBooking 
} from "@/lib/firebase/db";

export const feedbackService = {
  /**
   * Submit new feedback for a completed booking
   */
  submitFeedback: async (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
    try {
      // Basic validation: rating must be between 1 and 5
      if (feedbackData.rating < 1 || feedbackData.rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
      }

      const feedbackId = await submitFeedback(feedbackData);
      return feedbackId;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  },

  /**
   * Get all feedbacks for a specific shop
   */
  getShopFeedbacks: async (shopId: string) => {
    try {
      return await getFeedbacksByShopId(shopId);
    } catch (error) {
      console.error("Error fetching shop feedbacks:", error);
      throw error;
    }
  },

  /**
   * Get feedback for a specific booking
   */
  getFeedback: async (bookingId: string) => {
    try {
      return await getFeedbackForBooking(bookingId);
    } catch (error) {
      console.error("Error fetching feedback for booking:", error);
      return null;
    }
  },

  /**
   * Check if feedback exists for a booking
   */
  hasFeedback: async (bookingId: string) => {
    const feedback = await feedbackService.getFeedback(bookingId);
    return !!feedback;
  }
};
