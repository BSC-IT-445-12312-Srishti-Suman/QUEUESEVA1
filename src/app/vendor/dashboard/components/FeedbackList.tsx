'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, User } from 'lucide-react';
import { Feedback } from '@/lib/firebase/db';
import { feedbackService } from '@/services/feedbackService';
import { motion } from 'framer-motion';

interface FeedbackListProps {
  shopId: string;
}

export default function FeedbackList({ shopId }: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;

    const loadFeedbacks = async () => {
      try {
        const data = await feedbackService.getShopFeedbacks(shopId);
        // Sort by newest first
        setFeedbacks(data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
      } catch (err) {
        console.error("Error loading feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [shopId]);

  if (loading) {
    return (
      <div className="glass-panel p-8 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-foreground/5 rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-foreground/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="glass-panel p-12 text-center border-dashed border-border/50">
        <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4 text-foreground-muted">
          <MessageSquare size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">No feedback yet</h3>
        <p className="text-foreground-muted max-w-sm mx-auto">
          Customer reviews and ratings will appear here once they complete their visits.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          Customer Feedback
          <span className="text-sm font-medium px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded-lg">
            {feedbacks.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel p-6 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/5 flex items-center justify-center text-cyan-500 border border-cyan-500/10">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base leading-tight">
                    {item.userName || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-foreground-muted">
                    <Calendar size={12} />
                    <span>{item.createdAt.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 px-2 py-1 bg-yellow-500/10 rounded-lg">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold text-yellow-500">{item.rating}</span>
              </div>
            </div>

            {item.comment ? (
              <p className="text-foreground/80 text-sm leading-relaxed italic bg-foreground/[0.02] p-3 rounded-xl border border-foreground/5">
                &quot;{item.comment}&quot;
              </p>
            ) : (
              <p className="text-foreground-muted text-xs italic">No comment provided.</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
