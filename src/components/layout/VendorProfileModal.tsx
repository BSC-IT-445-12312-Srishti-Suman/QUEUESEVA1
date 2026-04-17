'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, ShieldCheck, Loader2, Save, Store, MapPin, Clock, Users, Tag, Hash, Settings, AlertCircle, Building, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile, updateShop, Shop, checkShopNumberUnique } from '@/lib/firebase/db';
import { CATEGORIES, INDIAN_STATES, SLOT_DURATIONS } from '@/app/vendor/onboarding/constants';
import { FormDropdown } from '@/app/vendor/onboarding/components/FormDropdown';
import { LocationService } from '@/lib/services/location-service';

interface VendorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopData: Shop | null;
  onShopUpdate: (updatedShop: Shop) => void;
}

type Tab = 'personal' | 'shop';

export default function VendorProfileModal({ isOpen, onClose, shopData, onShopUpdate }: VendorProfileModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Personal Profile State
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    displayName: '',
    email: '',
    phoneNumber: '+91',
  });

  // Shop State
  const [shop, setShop] = useState<Partial<Shop>>({});
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserProfile(user.uid);
      if (data) {
        setProfile(data);
      } else {
        setProfile({
          displayName: user.displayName || '',
          email: user.email || '',
          phoneNumber: '+91',
        });
      }
      
      if (shopData) {
        setShop(shopData);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user, shopData]);

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
      setSuccess(null);
      setError(null);
    }
    // We only want to initialize when the modal opens or user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  const fetchCities = useCallback(async (state: string) => {
    if (!state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const cityList = await LocationService.fetchCitiesByState(state);
      setCities(cityList);
    } catch (error) {
      console.error('Error fetching cities in ProfileModal:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    if (shop.state) {
      fetchCities(shop.state);
    }
  }, [shop.state, fetchCities]);

  const handleStateChange = (state: string) => {
    setShop(prev => ({ ...prev, state: state, city: '' }));
  };

  const validatePhone = (phone: string) => {
    const indianPhoneRegex = /^\+91[6789]\d{9}$/;
    return indianPhoneRegex.test(phone);
  };

  const handleSavePersonal = async () => {
    if (!user) return;
    setError(null);
    setSuccess(null);

    if (!profile.displayName?.trim()) {
      setError("Name is required");
      return;
    }

    if (!profile.phoneNumber || !validatePhone(profile.phoneNumber)) {
      setError("Please enter a valid Indian phone number (e.g., +919876543210)");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: profile.displayName,
        email: profile.email || user.email || '',
        phoneNumber: profile.phoneNumber,
        showContactToVendor: false // Vendors don't need this for themselves usually
      });

      // Also sync to Shop if it exists
      if (shopData?.id) {
        await updateShop(shopData.id, {
          ownerName: profile.displayName,
          phoneNumber: profile.phoneNumber
        });
        
        if (onShopUpdate) {
          onShopUpdate({
            ...shopData,
            ownerName: profile.displayName,
            phoneNumber: profile.phoneNumber
          });
        }
      }

      setSuccess("Personal details updated successfully!");
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShop = async () => {
    if (!user || !shopData?.id) return;
    setError(null);
    setSuccess(null);

    if (!shop.name?.trim()) {
      setError("Shop name is required");
      return;
    }
  
    setSaving(true);
    try {
      const updatedShopData = {
        ...shopData,
        name: shop.name || '',
        category: shop.category || '',
        shopNumber: shop.shopNumber || '',
        address: shop.address || '',
        city: shop.city || '',
        state: shop.state || '',
        zipCode: shop.zipCode || '',
        slotDuration: shop.slotDuration || 30,
        maxCapacity: shop.maxCapacity || 1,
        ownerName: profile.displayName || shopData.ownerName || '',
        phoneNumber: profile.phoneNumber || shopData.phoneNumber || '',
      } as Shop;
      
      // Check if shop number is unique if it has been changed
      if (shop.shopNumber !== shopData.shopNumber) {
        const isUnique = await checkShopNumberUnique(shop.shopNumber || '');
        if (!isUnique) {
          setError('This Shop Number is already registered. Please use a unique identifier.');
          setSaving(false);
          return;
        }
      }

      await updateShop(shopData.id, {
        name: updatedShopData.name,
        category: updatedShopData.category,
        shopNumber: updatedShopData.shopNumber,
        address: updatedShopData.address,
        city: updatedShopData.city,
        state: updatedShopData.state,
        zipCode: updatedShopData.zipCode,
        slotDuration: updatedShopData.slotDuration,
        maxCapacity: updatedShopData.maxCapacity,
        ownerName: updatedShopData.ownerName,
        phoneNumber: updatedShopData.phoneNumber,
      });
      onShopUpdate(updatedShopData);
      setSuccess("Shop details updated successfully!");
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error("Error saving shop:", err);
      setError("Failed to save shop details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-foreground/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                <Settings className="animate-spin-slow" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Account Settings</h2>
                <p className="text-xs text-foreground-muted">Manage your personal and business details</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-6 pt-4 border-b border-border bg-foreground/5">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-4 px-4 text-sm font-bold transition-all relative ${
                activeTab === 'personal' ? 'text-cyan-500' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Personal Info
              {activeTab === 'personal' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`pb-4 px-4 text-sm font-bold transition-all relative ${
                activeTab === 'shop' ? 'text-cyan-500' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Shop Details
              {activeTab === 'shop' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
              )}
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[440px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-cyan-500 mb-4" size={32} />
                <p className="text-sm text-foreground-muted font-medium">Loading details...</p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex items-center"
                    >
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm font-medium flex items-center"
                    >
                      <ShieldCheck size={16} className="mr-2 flex-shrink-0" />
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeTab === 'personal' ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center">
                          <User size={12} className="mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.displayName}
                          onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium placeholder:text-foreground-muted/30"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                          <Phone size={12} className="mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={profile.phoneNumber}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith('+91')) {
                               if (val.startsWith('91')) val = '+' + val;
                               else if (val.length > 0) val = '+91' + val;
                            }
                            setProfile({ ...profile, phoneNumber: val });
                          }}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono font-medium placeholder:text-foreground-muted/30"
                          placeholder="+91XXXXXXXXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                        <Mail size={12} className="mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground-muted cursor-not-allowed opacity-50"
                      />
                      <p className="text-[10px] text-foreground-muted/60 ml-1">Email cannot be changed.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                          <Store size={12} className="mr-2" />
                          Shop Name
                        </label>
                        <input
                          type="text"
                          value={shop.name}
                          onChange={(e) => setShop({ ...shop, name: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium placeholder:text-foreground-muted/30"
                          placeholder="e.g. Apollo Pharmacy"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                          <Hash size={12} className="mr-2" />
                          Shop Number / ID
                        </label>
                        <input
                          type="text"
                          value={shop.shopNumber}
                          onChange={(e) => setShop({ ...shop, shopNumber: e.target.value })}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium placeholder:text-foreground-muted/30"
                          placeholder="e.g. Shop 24"
                        />
                      </div>
                    </div>

                    <FormDropdown
                      label="Shop Category"
                      options={CATEGORIES}
                      value={shop.category || ''}
                      onChange={(val) => setShop({ ...shop, category: val })}
                      icon={<Tag size={16} />}
                      placeholder="Select Category"
                    />

                    <div className="space-y-1.5 flex flex-col">
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                        <MapPin size={12} className="mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={shop.address}
                        onChange={(e) => setShop({ ...shop, address: e.target.value })}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium placeholder:text-foreground-muted/30"
                        placeholder="Full Address"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                      <div className="col-span-2 md:col-span-1">
                        <FormDropdown
                          label="State"
                          options={INDIAN_STATES}
                          value={shop.state || ''}
                          onChange={handleStateChange}
                          icon={<Globe size={16} />}
                          placeholder="State"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <FormDropdown
                          label="City"
                          options={cities}
                          value={shop.city || ''}
                          onChange={(city) => setShop(prev => ({ ...prev, city }))}
                          icon={<Building size={16} />}
                          placeholder={shop.state ? "Select City" : "Select State..."}
                          disabled={!shop.state}
                          loading={loadingCities}
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <div className="space-y-1.5 flex flex-col">
                          <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            Zip Code
                          </label>
                          <input
                            type="text"
                            value={shop.zipCode}
                            onChange={(e) => setShop(prev => ({ ...prev, zipCode: e.target.value }))}
                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm font-medium"
                            maxLength={6}
                            placeholder="6-digit ZIP"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                          <Clock size={12} className="mr-2" />
                          Slot Duration
                        </label>
                        <select
                          value={shop.slotDuration}
                          onChange={(e) => setShop({ ...shop, slotDuration: parseInt(e.target.value) })}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium appearance-none"
                        >
                          {SLOT_DURATIONS.map(d => (
                            <option key={d} value={d} className="bg-card">{d} Minutes</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted ml-1 flex items-center">
                          <Users size={12} className="mr-2" />
                          Max Capacity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={shop.maxCapacity}
                          onChange={(e) => setShop({ ...shop, maxCapacity: parseInt(e.target.value) })}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!loading && (
            <div className="p-6 border-t border-border bg-foreground/5">
              <button
                onClick={activeTab === 'personal' ? handleSavePersonal : handleSaveShop}
                disabled={saving}
                className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}


