import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { authenticated, login } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(userName, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Hibás felhasználónév vagy jelszó');
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 pt-32 pb-10 md:flex-row md:items-stretch animate-fade-up">
      <div className="hidden flex-1 md:block">
        <div className="glass-card relative h-full overflow-hidden p-6">
          <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[#BD95A4]/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-[#A1836C]/20 blur-3xl" />

          <h2 className="relative text-2xl font-semibold text-[#554040]">Üdv újra a Savorly-ban!</h2>
          <p className="relative mt-2 text-sm text-slate-600">
            Lépj be, és folytasd ott, ahol abbahagytad: a kedvenc receptjeid csak egy kattintásnyira vannak.
          </p>

          <ul className="relative mt-6 space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#77BA7B]" />
              <span>Mentett receptek gyors elérése.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#77BA7B]" />
              <span>Kategóriák, amik rendszert visznek a főzésbe.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#77BA7B]" />
              <span>Reszponzív felület mobilra és asztalira.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1">
        <div className="glass-card mx-auto max-w-md p-6 shadow-soft animate-scale-in">
          <h2 className="text-2xl font-semibold text-slate-900">Bejelentkezés</h2>
          <p className="mt-1 text-sm text-slate-600">
            Jelentkezz be a receptgyűjtő felület használatához.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1 text-sm">
              <label className="block text-slate-700 flex items-center gap-2">
                <User size={14} className="text-[#A1836C]" /> Felhasználónév
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#BD95A4] focus:ring-2 focus:ring-[#BD95A4]/40"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-slate-700 flex items-center gap-2">
                <Lock size={14} className="text-[#A1836C]" /> Jelszó
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#BD95A4] focus:ring-2 focus:ring-[#BD95A4]/40"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[#A1836C]/40 bg-[#A1836C]/10 px-3 py-2 text-xs text-[#755463]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#BD95A4] to-[#A1836C] px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <LogIn size={16} /> Belépés <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-600">
            Nincs még fiókod?{' '}
            <Link to="/register" className="font-semibold text-[#554040] hover:text-[#755463]">
              Regisztráció
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
