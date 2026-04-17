'use client';

import { useState, useMemo } from 'react';
import { BookingWithDetails } from './useCustomerBookings';

export type SortOption = 'date-desc' | 'date-asc' | 'vendor-name' | 'status';
export type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled';

export function useBookingFilters(bookings: BookingWithDetails[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Status Filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        result = result.filter(b => ['waiting', 'serving'].includes(b.status));
      } else if (statusFilter === 'completed') {
        result = result.filter(b => b.status === 'completed');
      } else if (statusFilter === 'cancelled') {
        result = result.filter(b => ['cancelled', 'no-show'].includes(b.status));
      }
    }

    // Filter by search query (vendor name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.shopData?.name.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const getTimestamp = (booking: BookingWithDetails) => {
        if (booking.slotData?.date && booking.slotData?.startTime) {
          try {
            return new Date(`${booking.slotData.date}T${booking.slotData.startTime}`).getTime();
          } catch {
            return booking.createdAt?.toMillis() || 0;
          }
        }
        return booking.createdAt?.toMillis() || 0;
      };

      switch (sortBy) {
        case 'date-desc': {
          return getTimestamp(b) - getTimestamp(a);
        }
        case 'date-asc': {
          return getTimestamp(a) - getTimestamp(b);
        }
        case 'vendor-name': {
          const nameA = a.shopData?.name || '';
          const nameB = b.shopData?.name || '';
          return nameA.localeCompare(nameB);
        }
        case 'status': {
          const statusRank: Record<string, number> = {
            'serving': 0,
            'waiting': 1,
            'completed': 2,
            'cancelled': 3
          };
          const rankA = statusRank[a.status] ?? 4;
          const rankB = statusRank[b.status] ?? 4;
          return rankA - rankB;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, searchQuery, sortBy, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    filteredAndSortedBookings
  };
}
