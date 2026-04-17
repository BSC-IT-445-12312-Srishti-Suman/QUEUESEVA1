'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Shop } from '@/lib/firebase/db';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Loader2, Store, ChevronRight, ArrowLeft, SlidersHorizontal, ChevronDown, Check, Sparkles, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useShopFilters, ShopSortOption } from '@/hooks/useShopFilters';
import { useRef } from 'react';
import SearchSkeleton from '@/components/shop/SearchSkeleton';

export default function CustomerLanding() {
  const router = useRouter();
  const { user, loading: authLoadingContext } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    paginatedShops,
    hasMore,
    loadMore,
    totalCount
  } = useShopFilters(shops);

  // Close sorting on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: { label: string; value: ShopSortOption }[] = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Category', value: 'category' }
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

  // Auth Guard
  useEffect(() => {
    if (!authLoadingContext && !user) {
      router.push('/customer/login');
    }
  }, [user, authLoadingContext, router]);

  useEffect(() => {
    if (!user) return; // Wait for auth

    const fetchShops = async () => {
      try {
        const q = query(collection(db, 'shops'));
        const querySnapshot = await getDocs(q);
        const shopsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Shop[];
        setShops(shopsList);
      } catch (error) {
        console.error("Error fetching shops", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [user]);

  const handleShopSelect = async (shopId: string) => {
    setAuthLoading(shopId);
    try {
      if (!user) {
        router.push('/customer/login');
        return;
      }
      router.push(`/${shopId}`);
    } catch (error) {
      console.error("Error routing to shop", error);
      setAuthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar subtitle="Search" />
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-glow-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-glow-violet rounded-full mix-blend-screen filter blur-[150px] opacity-10 translate-y-1/4 -translate-x-1/4"></div>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => router.push('/customer/dashboard')}
              className="text-foreground-muted hover:text-foreground flex items-center text-sm font-medium transition-colors mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Search Vendors</h1>
            <p className="text-foreground-muted text-sm mt-1">Find and join queues in your area.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-2xl">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground-muted">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-glass group-hover:border-cyan-500/20 placeholder:text-foreground-muted text-sm"
                placeholder="Hospital, salon, bank..."
              />
            </div>

            <div className="relative min-w-[180px]" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm font-medium text-foreground shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-foreground-muted group-hover:text-cyan-500 transition-colors" size={16} />
                  <span>{currentSortLabel}</span>
                </div>
                <ChevronDown className={`text-foreground-muted transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} size={16} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 left-0 mt-2 p-1 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs rounded-lg transition-all ${
                          sortBy === option.value 
                            ? 'bg-cyan-500/10 text-cyan-500' 
                            : 'text-foreground-muted hover:bg-foreground/5 hover:text-foreground'
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-foreground-muted">
            <Sparkles className="text-cyan-500" size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Available Locations</span>
            <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[10px] border border-foreground/10 font-bold">
              {totalCount} Total
            </span>
          </div>
        </div>

        {loading ? (
          <SearchSkeleton />
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedShops.length === 0 ? (
                <div className="col-span-1 md:col-span-2 text-center py-20 text-foreground-muted bg-card/20 rounded-3xl border border-border border-dashed">
                  <Store size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No locations found matching &quot;{searchQuery}&quot;</p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-cyan-500 hover:text-cyan-400 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                paginatedShops.map((shop, i) => (
                  <motion.div
                    key={shop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 10) * 0.05 }}
                    onClick={() => shop.id && handleShopSelect(shop.id)}
                    className="glass-panel p-6 cursor-pointer group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-colors duration-500"></div>
                    
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-input flex items-center justify-center text-foreground border border-border group-hover:border-cyan-500/30 transition-colors">
                          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground-muted">
                            {shop.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-lg group-hover:text-cyan-500 transition-colors">{shop.name}</h3>
                            {shop.shopNumber && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-[9px] text-amber-500 font-bold uppercase tracking-wider border border-amber-500/20">
                                Shop No. {shop.shopNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="inline-block self-start px-2 py-0.5 rounded-md bg-cyan-500/10 text-[10px] text-cyan-500 font-bold uppercase tracking-wider border border-cyan-500/20">
                              {shop.category}
                            </span>
                            {shop.address && (
                              <p className="text-[10px] text-foreground-muted line-clamp-1">
                                {shop.address}, {shop.city}
                              </p>
                            )}
                            {shop.phoneNumber && (
                              <div className="flex items-center text-[10px] text-cyan-500 font-medium">
                                <Phone size={10} className="mr-1" />
                                {shop.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
                        {authLoading === shop.id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="px-8 py-4 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-foreground/5 transition-all shadow-xl flex items-center space-x-2 mx-auto"
                >
                  <Sparkles size={18} className="text-cyan-500" />
                  <span>Load More Vendors</span>
                </button>
                <p className="mt-4 text-xs text-foreground-muted">
                  Showing {paginatedShops.length} of {totalCount} locations
                </p>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Decorative footer line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
    </div>
  );
}
