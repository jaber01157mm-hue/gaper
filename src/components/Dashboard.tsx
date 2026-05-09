import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { History, Bell, AlertTriangle, ChevronRight, Gauge, Lock, LogIn, Sparkles, BrainCircuit, Trash2, Pencil, CheckCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Booking, MaintenanceRecord } from '@/src/types';
import { cn } from '@/src/lib/utils';

import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';
import AIAssistant from './AIAssistant';

export default function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ date: '', time: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data as Booking[]);
      }
      setLoading(false);
    };

    fetchBookings();

    const channel = supabase.channel('bookings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `userId=eq.${user.id}` }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Login failed: " + (error.message || "Unknown error"));
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) alert("حدث خطأ أثناء الحذف");
  };

  const completeBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'completed' }).eq('id', id);
    if (error) alert("حدث خطأ أثناء التحديث");
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ date: editData.date, time: editData.time }).eq('id', id);
    if (error) {
      alert("حدث خطأ أثناء التعديل");
    } else {
      setEditingId(null);
    }
  };

  if (!user) return (
    <section id="dashboard" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-white/20 mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Your Dashboard is Locked</h2>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">Login to view your maintenance history, track upcoming services, and manage your vehicles.</p>
          <button 
            onClick={handleLogin}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 mx-auto hover:bg-[#F27D26] hover:text-black transition-colors"
          >
            <LogIn size={20} />
            <span>LOGIN TO CONTINUE</span>
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <section id="dashboard" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tighter">
              MY <span className="text-[#F27D26]">GARAGE</span>
            </h2>
            <p className="text-white/40">Manage your vehicles and maintenance schedule.</p>
          </div>
          
          <div className="p-4 bg-[#F27D26]/10 border border-[#F27D26]/20 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F27D26] flex items-center justify-center text-black">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#F27D26]">Next Service</p>
              <p className="font-bold">Approx. 2,450 km remaining</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Advisor - NEW */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-4 text-[#F27D26] uppercase tracking-[0.2em] text-[10px] font-bold">
              <BrainCircuit size={14} />
              <span>Smart Diagnostics</span>
            </div>
            <AIAssistant />
          </div>

          {/* Active Bookings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-4 text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
              <History size={14} />
              <span>Recent Appointments</span>
            </div>

            {loading ? (
              <div className="py-20 text-center text-white/20">Loading your history...</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl border-dashed">
                <p className="text-white/30">No bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="group bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          booking.status === 'pending' ? 'bg-yellow-500' : 
                          booking.status === 'completed' ? 'bg-blue-500' :
                          booking.status === 'confirmed' ? 'bg-green-500' : 'bg-white/20'
                        )} />
                        <div>
                          <h4 className="font-bold uppercase text-sm tracking-wide">{booking.serviceType.replace('_', ' ')}</h4>
                          <p className="text-xs text-white/40">{booking.date} @ {booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase py-1 px-3 bg-white/5 rounded-full border border-white/10">
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4 mt-2">
                      {editingId === booking.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <input type="date" className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm flex-1 outline-none focus:border-[#F27D26]" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} />
                          <input type="time" className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm flex-1 outline-none focus:border-[#F27D26]" value={editData.time} onChange={e => setEditData({...editData, time: e.target.value})} />
                          <button onClick={() => saveEdit(booking.id)} className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors"><CheckCircle size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          {booking.status !== 'completed' && (
                            <button onClick={() => completeBooking(booking.id)} title="إكمال الحجز" className="p-2 text-white/40 hover:text-blue-400 transition-colors">
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button onClick={() => { setEditingId(booking.id); setEditData({ date: booking.date, time: booking.time }); }} title="تعديل" className="p-2 text-white/40 hover:text-yellow-400 transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => deleteBooking(booking.id)} title="حذف" className="p-2 text-white/40 hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats / Vehicle Info */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-yellow-500" size={20} />
                <h3 className="font-bold uppercase text-sm tracking-widest">Maintenance Alert</h3>
              </div>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Your last oil change was on 12 Mar 2026. Based on average driving, we suggest a checkup soon.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all">
                View Maintenance Guide
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#F27D26] to-[#d16215] p-8 rounded-3xl text-black">
              <div className="flex items-center justify-between mb-8">
                <Gauge size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Engine Health</span>
              </div>
              <div className="mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status</p>
                <p className="text-2xl font-bold font-display uppercase italic">OPTIMIZED</p>
              </div>
              <div className="w-full h-1 bg-black/20 rounded-full mt-4">
                <div className="w-[92%] h-full bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
