import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { authenticated, register } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(userName, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'A regisztráció nem sikerült');
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 pt-32 pb-10 md:flex-row-reverse md:items-stretch animate-fade-up">
      <div className="hidden flex-1 md:block">
        <div className="relative h-full overflow-hidden rounded-3xl bg-[#FDF8F6] shadow-2xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=1000&q=80"
              alt="Cooking background"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F6] via-[#FDF8F6]/90 to-transparent" />
          </div>

          <div className="relative flex h-full flex-col justify-end p-10">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-slate-900">
              Kezdd el a <br />
              <span className="text-[#BD95A4]">kulináris utazást</span>
            </h2>
            <p className="mb-8 text-slate-600 leading-relaxed font-medium">
              Regisztrálj ingyenesen, és férj hozzá exkluzív funkciókhoz.
              Rendezd receptjeidet, és főzz szenvedéllyel!
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/60 p-3 backdrop-blur-sm shadow-sm border border-white/50">
                <p className="text-2xl font-bold text-[#BD95A4]">0Ft</p>
                <p className="text-xs text-slate-600">Ingyenes használat</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3 backdrop-blur-sm shadow-sm border border-white/50">
                <p className="text-2xl font-bold text-[#BD95A4]">∞</p>
                <p className="text-xs text-slate-600">Korlátlan recept</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="glass-card mx-auto max-w-md p-6 shadow-soft animate-scale-in">
          <h2 className="text-2xl font-semibold text-[#554040]">Regisztráció</h2>
          <p className="mt-1 text-sm text-slate-600">
            Hozz létre egy fiókot, hogy elmenthesd a kedvenc receptjeidet.
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
                <Mail size={14} className="text-[#A1836C]" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <UserPlus size={16} /> Regisztráció <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-600">
            Már van fiókod?{' '}
            <Link to="/login" className="font-semibold text-[#554040] hover:text-[#755463]">
              Bejelentkezés
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
