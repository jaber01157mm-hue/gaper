import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

const staticTestimonials = [
  {
    id: 'static-1',
    name: 'Ahmed Hassan',
    car: 'BMW 320i — 2023',
    rating: 5,
    text: 'Outstanding service! They diagnosed an issue that two other shops couldn\'t find. My car runs like new. Truly professional team with genuine expertise.',
    avatar: '👨‍💼',
  },
  {
    id: 'static-2',
    name: 'Sara Mohamed',
    car: 'Mercedes C200 — 2024',
    rating: 5,
    text: 'Best oil change service in Aswan. Fast, clean, and they explained everything clearly. The online booking made it so convenient. Highly recommend!',
    avatar: '👩‍💻',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>(staticTestimonials);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ text: '', rating: 5, car: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    
    fetchTestimonials();
    return () => subscription.unsubscribe();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      setTestimonials(data);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    const { error } = await supabase.from('testimonials').insert([{
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
      car: newReview.car || 'Customer Vehicle',
      rating: newReview.rating,
      text: newReview.text,
      avatar: '👤',
      user_id: user.id
    }]);

    if (error) {
      alert("Failed to submit review");
    } else {
      setNewReview({ text: '', rating: 5, car: '' });
      setShowForm(false);
      fetchTestimonials();
      alert("Review submitted successfully! Thank you.");
    }
    setIsSubmitting(false);
  };

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 px-6 relative overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[#F27D26]/[0.02] skew-x-[12deg] transform -translate-x-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-left">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">
              WHAT THEY <span className="text-[#F27D26]">SAY</span>
            </h2>
            <p className="text-white/40 text-lg">Hear from our satisfied customers.</p>
          </div>
          {user && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-[#F27D26] hover:text-black transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
            >
              <MessageSquarePlus size={18} />
              Add Review
            </button>
          )}
        </div>

        {showForm && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto"
            onSubmit={submitReview}
          >
            <h3 className="font-bold uppercase tracking-widest mb-6">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})}>
                      <Star size={24} className={star <= newReview.rating ? 'text-[#F27D26] fill-[#F27D26]' : 'text-white/20'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Your Vehicle (Optional)</label>
                <input type="text" placeholder="e.g. BMW 320i - 2023" value={newReview.car} onChange={e => setNewReview({...newReview, car: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F27D26]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Your Experience</label>
                <textarea required rows={4} placeholder="Tell us about your experience..." value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F27D26]" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-[#F27D26] text-black font-bold rounded-xl hover:brightness-110 transition-all uppercase tracking-widest text-xs">
                {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </div>
          </motion.form>
        )}

        {testimonials.length > 0 && (
          <div className="relative">
            {/* Quote icon */}
            <Quote className="absolute -top-4 -left-4 text-[#F27D26]/10 rotate-180" size={80} />

            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonials[current].rating ? 'text-[#F27D26] fill-[#F27D26]' : 'text-white/10'}
                  />
                ))}
              </div>

              <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 font-medium italic">
                "{testimonials[current].text}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F27D26]/20 border border-[#F27D26]/30 flex items-center justify-center text-2xl">
                    {testimonials[current].avatar || '👤'}
                  </div>
                  <div>
                    <p className="font-display font-bold text-base uppercase tracking-wide">
                      {testimonials[current].name}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F27D26]/70">
                      {testimonials[current].car}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all"
                  >
                    <ChevronLeft size={18} className="text-white/60" />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all"
                  >
                    <ChevronRight size={18} className="text-white/60" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={testimonials[i].id || i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-[#F27D26]' : 'w-1.5 bg-white/15 hover:bg-white/25'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
