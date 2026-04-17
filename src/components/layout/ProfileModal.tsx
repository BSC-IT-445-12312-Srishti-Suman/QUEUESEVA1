'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, ShieldCheck, Loader2, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/firebase/db';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    displayName: '',
    email: '',
    phoneNumber: '+91',
    showContactToVendor: true
  });
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserProfile(user.uid);
      if (data) {
        setProfile(data);
      } else {
        // Initialize with user info if profile doesn't exist
        setProfile({
          displayName: user.displayName || '',
          email: user.email || '',
          phoneNumber: '+91',
          showContactToVendor: true
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user, fetchProfile]);

  const validatePhone = (phone: string) => {
    const indianPhoneRegex = /^\+91[6789]\d{9}$/;
    return indianPhoneRegex.test(phone);
  };

  const handleSave = async () => {
    if (!user) return;
    setError(null);

    // Basic validation
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
        showContactToVendor: profile.showContactToVendor || false
      });
      onClose();
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-foreground/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Profile Settings</h2>
                <p className="text-xs text-foreground-muted">Manage your personal information</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-cyan-500 mb-4" size={32} />
                <p className="text-sm text-foreground-muted">Loading your profile...</p>
              </div>
            ) : (
              <>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center text-foreground-muted">
                      <User size={14} className="mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center text-foreground-muted">
                      <Mail size={14} className="mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-foreground/5 border border-foreground/5 rounded-xl px-4 py-3 text-foreground-muted cursor-not-allowed"
                    />
                    <p className="text-[10px] text-foreground-muted/60 px-1">Email is managed via your account and cannot be changed here.</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center text-foreground-muted">
                      <Phone size={14} className="mr-2" />
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
                      placeholder="+91XXXXXXXXXX"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono font-medium"
                    />
                    <p className="text-[10px] text-foreground-muted/60 px-1">Must be a valid Indian number starting with +91</p>
                  </div>

                  {/* Visibility Toggle */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-foreground/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Share with Vendors</p>
                          <p className="text-[11px] text-foreground-muted">Share contact info for better service</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setProfile({ ...profile, showContactToVendor: !profile.showContactToVendor })}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                          profile.showContactToVendor ? 'bg-cyan-500' : 'bg-foreground/20'
                        }`}
                      >
                        <motion.div
                          animate={{ x: profile.showContactToVendor ? 24 : 2 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!loading && (
            <div className="p-6 border-t border-foreground/5 bg-foreground/5">
              <button
                onClick={handleSave}
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
    </AnimatePresence>
  );
}
