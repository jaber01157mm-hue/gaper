import { motion } from 'motion/react';
import { ChevronRight, Wrench } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 overflow-hidden px-6">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F27D26]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#F27D26]">
            Expert Car Maintenance
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter mb-8"
        >
          PRECISION <br className="hidden md:block" />
          <span className="text-[#F27D26]">AUTO</span>PRO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl font-medium mb-12"
        >
          Your vehicle deserves the highest standard of care. From diagnostics to major repairs, 
          we combine cutting-edge technology with mechanical mastery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:w-auto px-8 py-4 bg-[#F27D26] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all"
          >
            <span>BOOK SERVICE</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Wrench size={20} />
            <span>EXPLORE SERVICES</span>
          </button>
        </motion.div>
      </div>

      <div className="mt-20 w-full flex justify-center opacity-20 hover:opacity-40 transition-opacity">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
          alt="Sports car detail" 
          className="w-full max-w-5xl h-[400px] object-cover rounded-3xl grayscale"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
