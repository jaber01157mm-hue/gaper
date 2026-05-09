import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Calendar, Clock, Car, ChevronRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceType } from '@/src/types';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';
import { predictServiceType } from '@/src/services/aiService';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    serviceType: 'oil_change' as ServiceType,
    date: '',
    time: '',
    notes: ''
  });
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleSmartSuggest = async () => {
    if (!formData.notes.trim()) return;
    setIsSuggesting(true);
    const predicted = await predictServiceType(formData.notes);
    setFormData(prev => ({ ...prev, serviceType: predicted }));
    setIsSuggesting(false);
  };

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Login failed: " + (error.message || "Unknown error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        ...formData,
        userId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      if (error) throw error;
      setIsSuccess(true);
      setFormData({ make: '', model: '', serviceType: 'oil_change', date: '', time: '', notes: '' } as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F27D26]/5 skew-x-[-12deg] transform translate-x-20 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">
            READY FOR <span className="text-[#F27D26]">SERVICE?</span>
          </h2>
          <p className="text-white/40 text-lg">Book your appointment in less than 60 seconds.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          {!user ? (
            <div className="text-center py-12">
              <Car className="mx-auto mb-6 text-white/20" size={48} />
              <h3 className="text-xl font-bold mb-4">Please login to book a service</h3>
              <p className="text-white/40 mb-8">We need your account details to track your vehicle maintenance history.</p>
              <button 
                onClick={handleLogin}
                className="px-8 py-3 bg-[#F27D26] text-black font-bold rounded-xl inline-flex items-center gap-2 hover:bg-[#F27D26]/90 transition-all font-display uppercase tracking-wider"
              >
                <span>Login with Google</span>
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-white/40 mb-8">We've received your request. Our team will contact you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Book another
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F27D26] mb-2">Vehicle Details</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          required
                          placeholder="Make (e.g. BMW)"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#F27D26] outline-none transition-all"
                          value={formData.vehicleMake}
                          onChange={e => setFormData({...formData, vehicleMake: e.target.value})}
                        />
                      </div>
                      <input
                        required
                        placeholder="Model"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F27D26] outline-none transition-all"
                        value={formData.vehicleModel}
                        onChange={e => setFormData({...formData, vehicleModel: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Service Type</label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F27D26] outline-none appearance-none cursor-pointer"
                      value={formData.serviceType}
                      onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceType})}
                    >
                      <option value="oil_change">Oil Change Service</option>
                      <option value="mechanical">Mechanical Repair</option>
                      <option value="electrical">Electrical & Diagnostics</option>
                      <option value="diagnostic">Computer Scan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Schedule</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          required
                          type="date"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#F27D26] outline-none transition-all text-sm"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          required
                          type="time"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#F27D26] outline-none transition-all text-sm"
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">Additional Notes</label>
                      <button
                        type="button"
                        onClick={handleSmartSuggest}
                        disabled={!formData.notes.trim() || isSuggesting}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#F27D26] hover:text-[#F27D26]/80 disabled:opacity-30 flex items-center gap-1 transition-all"
                      >
                        {isSuggesting ? <Loader2 className="animate-spin" size={10} /> : <Sparkles size={10} />}
                        Smart Suggest Service
                      </button>
                    </div>
                    <textarea
                      placeholder="Tell us about the issue... (e.g. engine is making a knocking sound)"
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F27D26] outline-none transition-all resize-none"
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#F27D26] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:translate-y-[-2px] disabled:opacity-50 disabled:hover:translate-y-0 transition-all font-display text-lg uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                    {!isSubmitting && <ChevronRight />}
                  </button>
                  <p className="text-center text-[9px] uppercase tracking-[0.2em] text-white/20 mt-4">
                    By booking you agree to our service terms and privacy policy.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
