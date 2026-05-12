import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Hassan',
    car: 'BMW 320i — 2023',
    rating: 5,
    text: 'Outstanding service! They diagnosed an issue that two other shops couldn\'t find. My car runs like new. Truly professional team with genuine expertise.',
    avatar: '👨‍💼',
  },
  {
    name: 'Sara Mohamed',
    car: 'Mercedes C200 — 2024',
    rating: 5,
    text: 'Best oil change service in Aswan. Fast, clean, and they explained everything clearly. The online booking made it so convenient. Highly recommend!',
    avatar: '👩‍💻',
  },
  {
    name: 'Youssef Ali',
    car: 'Toyota Camry — 2022',
    rating: 5,
    text: 'I\'ve been coming here for 3 years now. The team is always honest about what needs fixing and what can wait. Fair pricing and excellent work quality.',
    avatar: '👨‍🔧',
  },
  {
    name: 'Mona Khalil',
    car: 'Hyundai Tucson — 2023',
    rating: 4,
    text: 'The computer diagnostics found the exact problem in minutes. Very impressed with their technology and the friendly staff. Will definitely come back!',
    avatar: '👩‍🎓',
  },
  {
    name: 'Omar Farouk',
    car: 'Nissan Patrol — 2021',
    rating: 5,
    text: 'They fixed my electrical issue that was draining the battery. Quick turnaround and great communication throughout the process. 5 stars all the way!',
    avatar: '👨‍✈️',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[#F27D26]/[0.02] skew-x-[12deg] transform -translate-x-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">
            WHAT THEY <span className="text-[#F27D26]">SAY</span>
          </h2>
          <p className="text-white/40 text-lg">Hear from our satisfied customers.</p>
        </div>

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
                  {testimonials[current].avatar}
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
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-[#F27D26]' : 'w-1.5 bg-white/15 hover:bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
