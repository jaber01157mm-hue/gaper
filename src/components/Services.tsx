import { Droplets, Settings, Zap, Search } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    icon: Droplets,
    title: "Oil Change Service",
    arabicTitle: "خدمة تغيير الزيت",
    description: "Premium synthetic and semi-synthetic oils tailored for your engine's longevity.",
    features: ["Filter replacement", "Fluid top-up", "Visual inspection"]
  },
  {
    icon: Settings,
    title: "Mechanical Repairs",
    arabicTitle: "إصلاحات ميكانيكية",
    description: "Expert handling of engines, brakes, transmission, and suspension systems.",
    features: ["Advanced tools", "OEM parts", "Precision tuning"]
  },
  {
    icon: Zap,
    title: "Electrical & Battery",
    arabicTitle: "الأنظمة الكهربائية والبطارية",
    description: "Complete electrical system diagnostics and component replacement.",
    features: ["Battery testing", "Alternator check", "Wiring repair"]
  },
  {
    icon: Search,
    title: "Computer Diagnostics",
    arabicTitle: "فحص الكمبيوتر",
    description: "Deep scans to identify and resolve complex system alerts and performance issues.",
    features: ["Error clearing", "System analysis", "Sensor calibration"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">
              BEYOND <span className="text-[#F27D26]">MAINTENANCE</span>
            </h2>
            <p className="text-white/40 text-lg">
              We provide comprehensive care for every aspect of your vehicle's performance.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="font-mono text-3xl font-bold opacity-10">01 / 04</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-[#F27D26]/30 transition-all cursor-default"
            >
              <service.icon className="text-[#F27D26] mb-8 h-10 w-10 group-hover:scale-110 transition-transform" />
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold mb-1 uppercase tracking-tight">{service.title}</h3>
                <p className="text-[#F27D26] text-sm font-bold font-display" dir="rtl">{service.arabicTitle}</p>
              </div>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26]/40" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
