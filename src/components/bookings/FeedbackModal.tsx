'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Booking, Shop, Feedback } from '@/lib/firebase/db';
import { feedbackService } from '@/services/feedbackService';

interface FeedbackModalProps {
  booking: (Booking & { shopData?: Shop }) | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackModal({ booking, onClose, onSuccess }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setIsSuccess(false);
      setError(null);
      setExistingFeedback(null);
      
      const checkExisting = async () => {
        setIsLoadingExisting(true);
        try {
          const feedback = await feedbackService.getFeedback(booking.id!);
          if (feedback) {
            setExistingFeedback(feedback);
            setRating(feedback.rating);
            setComment(feedback.comment || '');
          }
        } catch (err) {
          console.error("Error checking existing feedback", err);
        } finally {
          setIsLoadingExisting(false);
        }
      };
      checkExisting();
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || rating === 0 || existingFeedback) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await feedbackService.submitFeedback({
        bookingId: booking.id!,
        userId: booking.userId,
        userName: booking.userName || 'Anonymous',
        shopId: booking.shopId,
        rating,
        comment: comment.trim() || undefined,
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {booking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {existingFeedback ? 'Your Review' : 'Feedback'}
                </h2>
                <p className="text-foreground-muted text-sm mt-1">
                  {existingFeedback 
                    ? `You've shared your thoughts on ${booking.shopData?.name}`
                    : `How was your experience at ${booking.shopData?.name}?`
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors font-bold"
              >
                <X size={20} />
              </button>
            </div>

            {isLoadingExisting ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-cyan-500" size={32} />
                <p className="text-xs font-black uppercase tracking-widest text-foreground-muted">Checking review status...</p>
              </div>
            ) : isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-foreground-muted">Your feedback helps us and the vendor improve.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => !existingFeedback && setHoveredRating(star)}
                        onMouseLeave={() => !existingFeedback && setHoveredRating(0)}
                        onClick={() => !existingFeedback && setRating(star)}
                        className={`p-1 transition-transform active:scale-95 ${existingFeedback ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                      >
                        <Star
                          size={40}
                          className={`transition-all duration-200 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                              : 'text-foreground/10'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-cyan-500 min-h-[20px]">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent!"}
                  </p>
                </div>

                {/* Comment field */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-foreground-muted">
                    <MessageSquare size={14} className="text-cyan-500" />
                    Additional Comments {existingFeedback ? '' : '(Optional)'}
                  </label>
                  {existingFeedback ? (
                    <div className="w-full bg-foreground/5 border border-border/50 rounded-xl p-4 min-h-[100px] text-sm text-foreground/80 italic font-medium">
                      {existingFeedback.comment || "No comment provided."}
                    </div>
                  ) : (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more about your visit..."
                      className="w-full bg-card/50 border border-border rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-foreground-muted text-sm font-medium"
                    />
                  )}
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 text-xs text-center font-black uppercase tracking-widest bg-rose-400/10 py-3 rounded-xl border border-rose-400/20"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {existingFeedback ? (
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-4 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      Close Review
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-xl border border-border hover:bg-foreground/5 transition-all font-black uppercase tracking-widest text-[10px] text-foreground-muted"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        disabled={rating === 0 || isSubmitting}
                        className="flex-[2] bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            <span>Submit Review</span>
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}

            {/* Background Decorative Element */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
