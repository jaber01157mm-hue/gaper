import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Car, Users, Award, Clock } from 'lucide-react';

const stats = [
  { icon: Car, value: 5200, suffix: '+', label: 'VEHICLES SERVICED', color: '#F27D26' },
  { icon: Users, value: 3800, suffix: '+', label: 'HAPPY CUSTOMERS', color: '#22C55E' },
  { icon: Award, value: 12, suffix: '+', label: 'YEARS EXPERIENCE', color: '#3B82F6' },
  { icon: Clock, value: 98, suffix: '%', label: 'ON-TIME DELIVERY', color: '#A855F7' },
];

function AnimatedNumber({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span className="font-display text-4xl md:text-5xl font-bold tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F27D26]/[0.03] to-transparent pointer-events-none" />
      
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative group text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all"
            >
              {/* Accent line */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full opacity-60 group-hover:w-20 transition-all duration-500"
                style={{ backgroundColor: stat.color }}
              />
              
              <stat.icon 
                className="mx-auto mb-4 opacity-40 group-hover:opacity-80 transition-opacity" 
                size={28} 
                style={{ color: stat.color }}
              />
              
              <div className="mb-2" style={{ color: stat.color }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} isVisible={isInView} />
              </div>
              
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 group-hover:text-white/50 transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
