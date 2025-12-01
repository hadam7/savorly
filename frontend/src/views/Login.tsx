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
        <div className="relative h-full overflow-hidden rounded-3xl bg-[#FDF8F6] shadow-2xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=80"
              alt="Healthy food"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F6] via-[#FDF8F6]/90 to-transparent" />
          </div>

          <div className="relative flex h-full flex-col justify-end p-10">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-slate-900">
              Fedezd fel az ízek <br />
              <span className="text-[#BD95A4]">új világát</span>
            </h2>
            <p className="mb-8 text-slate-600 leading-relaxed font-medium">
              Csatlakozz közösségünkhöz, és mentsd el kedvenc receptjeidet egy helyen.
              Inspirálódj minden nap!
            </p>
          </div>
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
                <User size={14} className="text-[#A1836C]" /> Felhasználónév vagy Email
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
