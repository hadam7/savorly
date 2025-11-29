import { Route, Routes, useLocation } from 'react-router-dom';
import { Plus, ArrowRight, Timer, BookOpen, Search, Filter, SortAsc, SortDesc, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import RecipeDetail from './views/RecipeDetail';
import CreateRecipe from './views/CreateRecipe';
import RecipeCard from './components/RecipeCard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { sampleRecipes } from './data/sampleRecipes';
import { useAuth } from './hooks/useAuth';

function Home() {
  const { user } = useAuth();
  const [allRecipes, setAllRecipes] = useState(sampleRecipes);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'oldest'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const availableCategories = ['Reggeli', 'Ebéd', 'Vacsora', 'Desszert', 'Leves', 'Főétel', 'Egytálétel', 'Könnyű', 'Vegetáriánus', 'Vegán', 'Indiai', 'Olasz', 'Előétel', 'Tészta'];
  const availableAllergens = ['Glutén', 'Tej', 'Tojás', 'Mogyoró', 'Szója', 'Hal', 'Szezámmag', 'Diófélék', 'Zeller', 'Mustár'];

  const sortOptions = [
    { value: 'popular', label: 'Legkedveltebb' },
    { value: 'newest', label: 'Legújabb' },
    { value: 'oldest', label: 'Legrégebbi' }
  ];

  useEffect(() => {
    if (user) {
      const savedRecipes = localStorage.getItem(`savorly_user_recipes_${user.userName}`);
      if (savedRecipes) {
        try {
          const userRecipes = JSON.parse(savedRecipes);
          setAllRecipes([...userRecipes, ...sampleRecipes]);
        } catch (e) {
          console.error('Failed to parse user recipes', e);
        }
      }
    } else {
      setAllRecipes(sampleRecipes);
    }
  }, [user]);

  const filteredRecipes = useMemo(() => {
    let result = [...allRecipes];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(query));
    }

    // Category Filter
    if (selectedCategory) {
      result = result.filter(r => {
        if (Array.isArray(r.category)) {
          return r.category.includes(selectedCategory);
        }
        return r.category === selectedCategory;
      });
    }

    // Allergen Filter (Exclude if recipe has selected allergen)
    if (selectedAllergens.length > 0) {
      result = result.filter(r => {
        if (!r.allergens) return true;
        return !r.allergens.some(allergen => selectedAllergens.includes(allergen));
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likes || 0) - (a.likes || 0);
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
    });

    return result;
  }, [allRecipes, searchQuery, selectedCategory, selectedAllergens, sortBy]);

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Fedezd fel az ízek világát</h2>
              <p className="text-slate-500">Keress, szűrj és találd meg a kedvencedet!</p>
            </div>

            <div className="flex items-center gap-3 z-20">
              {/* Custom Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                  className={`flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl border font-medium transition-all duration-200 min-w-[160px] justify-between ${isSortOpen ? 'border-[#BD95A4] ring-1 ring-[#BD95A4] text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:border-[#BD95A4]'}`}
                >
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-[#BD95A4]' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden z-50"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as any);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === option.value ? 'bg-[#BD95A4]/10 text-[#BD95A4]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-colors ${showFilters ? 'bg-[#BD95A4] border-[#BD95A4] text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-[#BD95A4] hover:text-[#BD95A4]'}`}
              >
                <Filter size={18} />
                Szűrők
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            className="relative"
            animate={{ marginTop: isSortOpen ? 140 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Keresés étel neve alapján..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-lg shadow-sm focus:outline-none focus:border-[#BD95A4] focus:ring-1 focus:ring-[#BD95A4] transition-all"
            />
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Kategória</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Összes
                      </button>
                      {availableCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-[#BD95A4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allergens (Exclusion) */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-slate-900">Allergia (kizárás)</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Pipáld be, amire allergiás vagy!</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableAllergens.map(allergen => (
                        <button
                          key={allergen}
                          onClick={() => toggleAllergen(allergen)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedAllergens.includes(allergen) ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          {selectedAllergens.includes(allergen) && <X size={14} />}
                          {allergen}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((r, idx) => (
              <RecipeCard key={r.id} recipe={r} index={idx} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              Nincs a keresésnek megfelelő recept.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-20 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kategóriák felfedezése</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Találd meg a tökéletes receptet bármilyen alkalomra. Legyen szó gyors vacsoráról vagy ünnepi lakomáról.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Gyors', icon: '⚡', color: 'from-orange-400 to-orange-600' },
              { name: 'Egészséges', icon: '🥗', color: 'from-green-400 to-green-600' },
              { name: 'Desszert', icon: '🍰', color: 'from-pink-400 to-pink-600' },
              { name: 'Vegán', icon: '🌱', color: 'from-lime-400 to-lime-600' },
              { name: 'Főételek', icon: '🍖', color: 'from-red-400 to-red-600' },
              { name: 'Levesek', icon: '🍲', color: 'from-amber-400 to-amber-600' },
            ].map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500">120+ recept</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Recipes() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Receptjeid</h1>
          <p className="text-slate-500">Kezeld és rendszerezd saját receptgyűjteményedet.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#BD95A4] text-white rounded-full font-semibold shadow-lg shadow-[#BD95A4]/30 hover:bg-[#A1836C] hover:-translate-y-0.5 transition-all duration-300">
          <Plus size={18} />
          Új recept
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {['Tészta', 'Levesek', 'Desszertek'].map((cat, idx) => (
          <motion.article
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-slate-50 text-[#BD95A4] group-hover:bg-[#BD95A4] group-hover:text-white transition-colors duration-300">
                <BookOpen size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                3 recept
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{cat}</h3>
            <p className="text-sm text-slate-500 mb-6">
              Válogatott receptek a {cat.toLowerCase()} kategóriában.
            </p>
            <div className="flex items-center text-sm font-semibold text-[#BD95A4] group-hover:translate-x-1 transition-transform duration-300">
              Megnyitás <ArrowRight size={16} className="ml-1" />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Kategóriák</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Böngéssz a különböző kategóriák között és találd meg a kedvencedet.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {["Gyors", "Egészséges", "Vendégváró", "Comfort food", "Desszert", "Meal prep"].map((item, idx) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#BD95A4]/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#BD95A4] group-hover:text-white transition-colors duration-300">
                <BookOpen size={18} />
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-slate-900">{item}</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <Timer size={14} /> {3 + idx} recept
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AppShell() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 selection:bg-[#BD95A4]/20 selection:text-[#755463]">
      <Navbar />

      <main className="flex-1">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/edit-recipe/:id" element={<CreateRecipe />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
