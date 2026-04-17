'use client';

import { useState, useMemo, useEffect } from 'react';
import { Shop } from '@/lib/firebase/db';

export type ShopSortOption = 'name-asc' | 'name-desc' | 'category';

export function useShopFilters(shops: Shop[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<ShopSortOption>('name-asc');
  const [itemsToShow, setItemsToShow] = useState(10);

  const filteredAndSortedShops = useMemo(() => {
    let result = [...shops];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(shop => 
        shop.name.toLowerCase().includes(query) || 
        shop.category.toLowerCase().includes(query)
      );
    }

    // Sort logic
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return result;
  }, [shops, searchQuery, sortBy]);

  const paginatedShops = useMemo(() => {
    return filteredAndSortedShops.slice(0, itemsToShow);
  }, [filteredAndSortedShops, itemsToShow]);

  const hasMore = itemsToShow < filteredAndSortedShops.length;

  const loadMore = () => {
    setItemsToShow(prev => prev + 10);
  };

  // Reset pagination on search/sort
  useEffect(() => {
    setItemsToShow(10);
  }, [searchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    paginatedShops,
    hasMore,
    loadMore,
    totalCount: filteredAndSortedShops.length
  };
}
