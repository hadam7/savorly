import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    } catch (err) {
      console.error(err);
      setError('A regisztráció nem sikerült');
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 py-10 md:flex-row-reverse md:items-stretch animate-fade-up">
      <div className="hidden flex-1 md:block">
        <div className="glass-card relative h-full overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-16 -top-10 h-44 w-44 rounded-full bg-[#B7D9A3]/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-52 w-52 rounded-full bg-[#77BA7B]/30 blur-3xl" />

          <h2 className="relative text-2xl font-semibold text-slate-900">Csatlakozz a Savorly-hoz!</h2>
          <p className="relative mt-2 text-sm text-slate-600">
            Hozz létre egy fiókot, hogy elmenthesd a kedvenc receptjeidet, és mindig kéznél legyenek.
          </p>

          <div className="relative mt-6 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Mentett receptek</p>
                <p className="text-sm font-semibold text-slate-900">Mindig kéznél</p>
              </div>
              <span className="rounded-full bg-[#F6DECC] px-3 py-1 text-[0.65rem] font-semibold text-[#46873E]">
                Kedvencek
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#77BA7B]/10 to-[#E26B6B]/10 px-3 py-2 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Kategóriák</p>
                <p className="text-sm font-semibold text-slate-900">Teljes kontroll</p>
              </div>
              <span className="text-[0.7rem] text-slate-600">Te döntesz, hogyan rendezed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="glass-card mx-auto max-w-md p-6 shadow-soft animate-scale-in">
          <h2 className="text-2xl font-semibold text-slate-900">Regisztráció</h2>
          <p className="mt-1 text-sm text-slate-600">
            Hozz létre egy fiókot, hogy elmenthesd a kedvenc receptjeidet.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1 text-sm">
              <label className="block text-slate-700">
                Felhasználónév
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#77BA7B] focus:ring-2 focus:ring-[#77BA7B]/40"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#77BA7B] focus:ring-2 focus:ring-[#77BA7B]/40"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-slate-700">
                Jelszó
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#77BA7B] focus:ring-2 focus:ring-[#77BA7B]/40"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[#E26B6B]/30 bg-[#E26B6B]/10 px-3 py-2 text-xs text-[#E26B6B]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#77BA7B] to-[#E26B6B] px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Regisztráció
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-600">
            Már van fiókod?{' '}
            <Link to="/login" className="font-semibold text-[#46873E] hover:text-[#E26B6B]">
              Bejelentkezés
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
