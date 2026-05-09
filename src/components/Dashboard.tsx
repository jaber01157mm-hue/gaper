import { useEffect, useState } from 'react';
import { db, auth } from '@/src/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { History, Bell, AlertTriangle, ChevronRight, Gauge, Lock, LogIn, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';
import { Booking, MaintenanceRecord } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';
import AIAssistant from './AIAssistant';

export default function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const bQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribeBookings = onSnapshot(bQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });

    return () => unsubscribeBookings();
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Login failed: " + (error.message || "Unknown error"));
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
                    className="group bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/[0.08] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        booking.status === 'pending' ? 'bg-yellow-500' : 
                        booking.status === 'confirmed' ? 'bg-green-500' : 'bg-white/20'
                      )} />
                      <div>
                        <h4 className="font-bold uppercase text-sm tracking-wide">{booking.serviceType.replace('_', ' ')}</h4>
                        <p className="text-xs text-white/40">{booking.date} @ {booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase py-1 px-3 bg-white/5 rounded-full border border-white/10">
                        {booking.status}
                      </span>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
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
