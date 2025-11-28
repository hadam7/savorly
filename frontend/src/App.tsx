import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';

function Home() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:py-16">
      <div className="md:w-1/2 animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F6DECC]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#46873E] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
          <span className="h-1.5 w-1.5 rounded-full bg-[#77BA7B] pulse-soft" />
          Receptgyűjtő • Savorly
        </span>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Mentsd el minden kedvenc
          <span className="bg-gradient-to-r from-[#77BA7B] via-[#46873E] to-[#E26B6B] bg-clip-text text-transparent">
            {' '}receptedet
          </span>
          , egy helyen.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
          Készíts saját gyűjteményt, kategorizáld az ételeket és találd meg villámgyorsan,
          hogy mit főzz ma este. Mindezt egy letisztult, reszponzív felületen.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 animate-slide-right stagger-1">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#77BA7B] to-[#E26B6B] px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E26B6B]/70 focus-visible:ring-offset-2"
          >
            <span className="relative z-10">Kezdés ingyen</span>
            <span className="absolute inset-0 -z-0 shimmer-bg opacity-0 group-hover:opacity-100" />
          </Link>
          <Link
            to="/recipes"
            className="inline-flex items-center justify-center rounded-full border border-[#77BA7B]/30 bg-white/70 px-5 py-2.5 text-sm font-medium text-[#46873E] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#77BA7B] hover:bg-[#F6DECC]/60 hover:-translate-y-1 hover:shadow-md"
          >
            Receptjeim megnyitása
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2 animate-slide-right stagger-2 transition-all duration-300 hover:scale-105">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#B7D9A3]/80 text-[0.7rem] font-semibold text-[#46873E] transition-transform duration-300 group-hover:rotate-12">
              01
            </span>
            <span>Egyszerű regisztráció</span>
          </div>
          <div className="flex items-center gap-2 animate-slide-right stagger-2 transition-all duration-300 hover:scale-105">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F6DECC]/80 text-[0.7rem] font-semibold text-[#46873E] transition-transform duration-300 group-hover:rotate-12">
              02
            </span>
            <span>Gyors recept keresés</span>
          </div>
          <div className="flex items-center gap-2 animate-slide-right stagger-3 transition-all duration-300 hover:scale-105">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E26B6B]/10 text-[0.7rem] font-semibold text-[#E26B6B] transition-transform duration-300 group-hover:rotate-12">
              03
            </span>
            <span>Eszközökre optimalizálva</span>
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid flex-1 place-items-center md:mt-0">
        <div className="glass-card relative w-full max-w-md overflow-hidden p-5 shadow-soft animate-scale-in stagger-2">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#B7D9A3]/40 blur-3xl animate-float-slow" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-[#E26B6B]/20 blur-3xl animate-float-slow" style={{animationDelay: '1s'}} />

          <header className="relative flex items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#77BA7B]/90">
                Mai menü
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Gyors vacsora 30 perc alatt</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#77BA7B]/10 px-3 py-1 text-[0.65rem] font-medium text-[#77BA7B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#77BA7B]" />
              5 mentett recept ma
            </span>
          </header>

          <div className="relative grid gap-3 text-xs text-slate-600">
            <div className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-white cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">Krémes fokhagymás csirke</p>
                <p className="text-[0.7rem] text-slate-500">25 perc • egytálétel</p>
              </div>
              <span className="rounded-full bg-[#B7D9A3]/60 px-2.5 py-1 text-[0.65rem] font-semibold text-[#46873E]">
                Új
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-white cursor-pointer">
              <div>
                <p className="font-semibold text-slate-900">Mediterrán tésztasaláta</p>
                <p className="text-[0.7rem] text-slate-500">20 perc • könnyű</p>
              </div>
              <span className="rounded-full bg-[#F6DECC] px-2.5 py-1 text-[0.65rem] font-semibold text-[#46873E]">
                Kedvenc
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#77BA7B]/10 to-[#E26B6B]/10 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer gradient-animate">
              <div>
                <p className="font-semibold text-slate-900">Csokis brownie</p>
                <p className="text-[0.7rem] text-slate-500">35 perc • desszert</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[0.65rem] font-semibold text-[#E26B6B]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E26B6B]" />
                TOP 3
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Recipes() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 animate-fade-up">
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Receptjeid</h2>
          <p className="mt-1 text-sm text-slate-600">
            Itt fog megjelenni a teljes recept lista, szűréssel és szerkesztéssel.
          </p>
        </div>
        <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#77BA7B] px-4 py-2 text-xs font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:bg-[#46873E] hover:shadow-lg">
          <span>+</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">Új recept</span>
          + Új recept
        </button>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {['Tészta', 'Levesek', 'Desszertek'].map((cat) => (
          <article
            key={cat}
            className="glass-card group flex flex-col justify-between p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer animate-scale-in"
            style={{animationDelay: `${['Tészta', 'Levesek', 'Desszertek'].indexOf(cat) * 100}ms`}}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{cat}</h3>
              <p className="mt-1 text-xs text-slate-600">
                Kategória leírása – itt lesz majd a kategóriához tartozó rövid magyarázat.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[0.7rem] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#77BA7B]/80" />
                3 recept
              </span>
              <button className="text-[#77BA7B] transition-all duration-300 group-hover:text-[#46873E] group-hover:translate-x-1">Megnyitás →</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 animate-fade-up">
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Kategóriák</h2>
          <p className="mt-1 text-sm text-slate-600">
            Csoportosítsd a receptjeidet típus, alapanyag vagy hangulat szerint.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Gyors", "Egészséges", "Vendégváró", "Comfort food", "Desszert", "Meal prep"].map((item, idx) => (
          <div
            key={item}
            className="glass-card flex items-center justify-between px-4 py-3 text-sm text-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer animate-scale-in"
            style={{animationDelay: `${idx * 60}ms`}}
          >
            <span>{item}</span>
            <span className="text-[0.7rem] text-slate-500">{3 + idx} recept</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AppShell() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl transition-all duration-300">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-[#77BA7B] to-[#E26B6B] text-xs font-bold text-white shadow-soft animate-float-slow">
              S
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">Savorly</p>
              <p className="text-[0.65rem] text-slate-500">Receptgyűjtő</p>
            </div>
          </Link>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/" className={`nav-link ${isActive('/') ? 'text-[#46873E]' : ''}`}>
              Főoldal
            </Link>
            <Link to="/recipes" className={`nav-link ${isActive('/recipes') ? 'text-[#46873E]' : ''}`}>
              Receptek
            </Link>
            <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'text-[#46873E]' : ''}`}>
              Kategóriák
            </Link>
            <Link to="/login" className={`nav-link ${isActive('/login') || isActive('/register') ? 'text-[#46873E]' : ''}`}>
              Belépés
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="border-t border-white/60 bg-white/70 py-4 text-center text-[0.7rem] text-slate-500 backdrop-blur-xl transition-all duration-300">
        <span>Savorly  b7 Készült React + Tailwind segítségével</span>
      </footer>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
