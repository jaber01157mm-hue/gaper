import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingForm from './components/BookingForm';
import UserDashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F27D26] selection:text-black">
      <Navbar />
      
      <main>
        <Hero />
        <Services />
        <BookingForm />
        <UserDashboard />
      </main>

      {/* Location / Contact Section */}
      <section id="location" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-4xl font-bold mb-8 uppercase tracking-tighter">
              FIND <span className="text-[#F27D26]">US</span>
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F27D26] group-hover:bg-[#F27D26] group-hover:text-black transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Our Address</p>
                  <p className="font-medium text-lg">Aswan, Egypt</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F27D26] group-hover:bg-[#F27D26] group-hover:text-black transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Call Us</p>
                  <p className="font-medium text-lg">01144622380</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F27D26] group-hover:bg-[#F27D26] group-hover:text-black transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email</p>
                  <p className="font-medium text-lg">jaber01157mm@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            {/* Embedded maps or image placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114674.39860641217!2d32.82572797680783!3d24.09249767258385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14367b5ab0f7b0b1%3A0x6b307cf0fdf8f4a!2sAswan%2C%20Aswan%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1715000000000!5m2!1sen!2seg" 
              className="w-full h-full border-0 brightness-75 hover:brightness-100 transition-all duration-500"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl tracking-tighter">AUTOPRO</span>
          </div>
          
          <div className="text-white/20 text-sm font-medium">
            © 2026 AutoPro Center. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-white/40 hover:text-[#F27D26] transition-colors"><Instagram size={20} /></a>
            <a href="#" className="p-2 text-white/40 hover:text-[#F27D26] transition-colors"><Facebook size={20} /></a>
            <a href="#" className="p-2 text-white/40 hover:text-[#F27D26] transition-colors"><Twitter size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
