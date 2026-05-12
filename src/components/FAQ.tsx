import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a service appointment?',
    answer: 'Simply scroll to the booking section on our website, select your vehicle make and model, choose the service type, pick a date and time, and submit. You\'ll receive a confirmation instantly. You can also call us directly at 01144622380.',
  },
  {
    question: 'What types of vehicles do you service?',
    answer: 'We service all makes and models including sedans, SUVs, trucks, and luxury vehicles. Our team is trained and equipped to handle European, Japanese, American, and Korean vehicles with equal expertise.',
  },
  {
    question: 'How long does a typical oil change take?',
    answer: 'A standard oil change takes approximately 30-45 minutes. This includes draining old oil, replacing the oil filter, adding premium synthetic or semi-synthetic oil, and performing a basic visual inspection of your vehicle.',
  },
  {
    question: 'Do you offer any warranties on repairs?',
    answer: 'Yes! All our repairs come with a 6-month warranty on parts and labor. For major engine and transmission work, we offer an extended 12-month warranty. We use only OEM or equivalent quality parts.',
  },
  {
    question: 'Can I track my service status online?',
    answer: 'Absolutely! Once logged in, you can view your service history, current appointment status, and upcoming maintenance reminders through the "My Garage" dashboard on our website.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, all major credit/debit cards (Visa, Mastercard), and mobile payment solutions like Fawry and Vodafone Cash. Payment is due upon completion of service.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="border-b border-white/5 last:border-none"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#F27D26]/40 font-bold w-6">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-display font-bold text-base md:text-lg uppercase tracking-tight group-hover:text-[#F27D26] transition-colors">
            {faq.question}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-white/30 transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? 'rotate-180 text-[#F27D26]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-white/50 text-sm md:text-base leading-relaxed pb-6 pl-10">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-[#F27D26]" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F27D26]">
                Got Questions?
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">
              FREQUENTLY <span className="text-[#F27D26]">ASKED</span>
            </h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs">
            Everything you need to know about our services and processes.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
