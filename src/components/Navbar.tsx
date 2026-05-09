import { auth, db } from '@/src/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Car, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthModal } from './AuthModal';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check if user exists in DB, if not create profile
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || u.email?.split('@')[0],
            createdAt: serverTimestamp(),
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Car className="text-[#F27D26] h-8 w-8" />
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block">AUTOPRO</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white/60">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#booking" className="hover:text-white transition-colors">Booking</a>
            <a href="#location" className="hover:text-white transition-colors">Location</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button 
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                  onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">My Garage</span>
                </button>
                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors group"
                  title="Sign Out"
                >
                  <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#F27D26] text-black font-bold rounded-full hover:bg-[#F27D26]/90 transition-colors text-sm"
              >
                <LogIn size={18} />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
