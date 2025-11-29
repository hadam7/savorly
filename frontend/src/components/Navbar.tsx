import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Home, BookOpen, LogIn, UserPlus, Search, User, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { authenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled for styling
      setScrolled(currentScrollY > 20);

      // Determine visibility
      if (currentScrollY < 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 pt-8 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav
        className={`
          relative mx-4 flex items-center justify-between gap-8 rounded-full 
          bg-white/90 px-6 shadow-lg shadow-slate-200/20 
          backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          w-full max-w-6xl py-4
        `}
      >
        {/* Logo Area */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#BD95A4] to-[#A1836C] text-white shadow-md shadow-[#BD95A4]/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <ChefHat size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-800 text-xl tracking-tight group-hover:text-[#755463] transition-colors duration-300">
            Savorly
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <NavLink to="/" icon={<Home size={18} />} label="Főoldal" active={isActive('/')} />
          <NavLink to="/recipes" icon={<BookOpen size={18} />} label="Receptek" active={isActive('/recipes')} />
          <NavLink to="/categories" icon={<Search size={18} />} label="Kategóriák" active={isActive('/categories')} />
          {authenticated && (
            <NavLink to="/create-recipe" icon={<PlusCircle size={18} />} label="Új recept" active={isActive('/create-recipe')} />
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200/60">
          {authenticated ? (
            <Link
              to="/profile"
              className={`
                flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300
                ${isActive('/profile')
                  ? 'text-white bg-[#BD95A4] shadow-md shadow-[#BD95A4]/30'
                  : 'text-slate-600 hover:text-[#BD95A4] hover:bg-[#BD95A4]/10'}
              `}
            >
              <User size={20} strokeWidth={2} />
              <span className="hidden sm:inline">Profil</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`
                  flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300
                  ${isActive('/login')
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                <LogIn size={18} strokeWidth={2} />
                <span>Belépés</span>
              </Link>
              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5"
              >
                <UserPlus size={18} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-110" />
                <span>Regisztráció</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`
        relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300
        ${active
          ? 'text-[#755463] font-semibold bg-[#BD95A4]/10'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
      `}
    >
      <span className={`transition-colors duration-300 ${active ? 'text-[#BD95A4]' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
