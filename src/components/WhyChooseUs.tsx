import { motion } from 'motion/react';
import { Shield, Truck, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '6-Month Warranty',
    description: 'All repairs backed by our comprehensive parts & labor guarantee.',
  },
  {
    icon: Truck,
    title: 'Free Pickup',
    description: 'Complimentary vehicle pickup & delivery within Aswan city limits.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Pay via cash, cards, Fawry, or Vodafone Cash — your choice.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock assistance via WhatsApp for urgent breakdowns.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F27D26] mb-4 inline-block">
            Why AutoPro?
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            THE <span className="text-[#F27D26]">AUTOPRO</span> ADVANTAGE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#F27D26]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8 rounded-2xl border border-white/5 hover:border-[#F27D26]/20 transition-all text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F27D26]/10 border border-[#F27D26]/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#F27D26]/20 transition-all">
                  <feature.icon className="text-[#F27D26]" size={24} />
                </div>
                
                <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-white/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
