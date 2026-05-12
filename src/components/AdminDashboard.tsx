import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Activity, Users, Calendar, DollarSign, CheckCircle, Clock, Trash2, ShieldAlert, Database, Server } from 'lucide-react';
import { Booking } from '@/src/types';
import { cn } from '@/src/lib/utils';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    fetchBookings();

    const channel = supabase.channel('admin_bookings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Error fetching all bookings:", error);
    } else {
      const bks = data as Booking[];
      setBookings(bks);
      setStats({
        total: bks.length,
        pending: bks.filter(b => b.status === 'pending').length,
        completed: bks.filter(b => b.status === 'completed').length,
      });
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) alert("Failed to update status");
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) alert("Failed to delete");
  };

  return (
    <section id="admin-dashboard" className="py-24 px-6 bg-[#030303] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="text-red-500" size={32} />
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white">
                SERVER <span className="text-red-500">CONTROL</span>
              </h2>
            </div>
            <p className="text-white/40">Master Administration Panel for Platform Control.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black">
                <Server size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">System Status</p>
                <p className="font-bold text-white">Online & Syncing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Bookings', value: stats.total, icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Completed Services', value: stats.completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
            { label: 'Active Users', value: '12+', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((stat, i) => (
            <div key={i} className={cn("p-6 rounded-3xl border flex items-center gap-6", stat.bg, stat.border)}>
              <div className={cn("w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center", stat.color)}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{stat.label}</p>
                <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-widest text-white">All Platform Bookings</h3>
            <span className="text-[10px] font-bold uppercase py-1 px-3 bg-red-500/20 text-red-500 rounded-full border border-red-500/20">
              Live Data
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
                <tr>
                  <th className="p-6 font-medium">ID / Type</th>
                  <th className="p-6 font-medium">Customer Info</th>
                  <th className="p-6 font-medium">Date & Time</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-white/20">Syncing with database...</td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-white/20">No system records found.</td>
                  </tr>
                ) : bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="font-bold uppercase text-white">{booking.serviceType.replace('_', ' ')}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-1">{booking.id.substring(0,8)}...</div>
                    </td>
                    <td className="p-6">
                      <div className="text-white">{booking.name}</div>
                      <div className="text-white/40 text-xs">{booking.phone}</div>
                      <div className="text-white/40 text-[10px]">{booking.carMake} {booking.carModel} ({booking.carYear})</div>
                    </td>
                    <td className="p-6">
                      <div className="text-white">{booking.date}</div>
                      <div className="text-white/40">{booking.time}</div>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase py-1 px-3 rounded-full border",
                        booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                        booking.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/10 text-white/60 border-white/20'
                      )}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-2">
                      {booking.status === 'pending' && (
                        <button onClick={() => updateStatus(booking.id, 'confirmed')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors" title="Confirm">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button onClick={() => updateStatus(booking.id, 'completed')} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors" title="Mark Completed">
                          <Activity size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteBooking(booking.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
