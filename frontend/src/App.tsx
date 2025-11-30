import { Route, Routes, useLocation } from 'react-router-dom';
import { fetchRecipes } from './api';
import { Plus, ArrowRight, Timer, BookOpen, Search, Filter, SortAsc, SortDesc, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import RecipeDetail from './views/RecipeDetail';
import CreateRecipe from './views/CreateRecipe';
import AdminDashboard from './views/AdminDashboard';
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
  const [isVeganFilter, setIsVeganFilter] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'oldest'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const availableCategories = ['Reggeli', 'Ebéd', 'Vacsora', 'Desszert', 'Leves', 'Főétel', 'Egytálétel', 'Könnyű', 'Vegetáriánus', 'Indiai', 'Olasz', 'Előétel', 'Tészta'];
  const availableAllergens = ['Glutén', 'Tej', 'Tojás', 'Mogyoró', 'Szója', 'Hal', 'Szezámmag', 'Diófélék', 'Zeller', 'Mustár'];

  const sortOptions = [
    { value: 'popular', label: 'Legkedveltebb' },
    { value: 'newest', label: 'Legújabb' },
    { value: 'oldest', label: 'Legrégebbi' }
  ];

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const backendRecipes = await fetchRecipes();

        const mappedRecipes = backendRecipes.map(r => ({
          ...r,
          instructions: [],
          servings: r.servings || 4,
          isVegan: r.isVegan,
          allergens: [],
          ingredients: [],
          createdAt: new Date().toISOString(),
          category: r.categories,
          author: 'Savorly Chef',
          likes: r.likes,
          prepTime: r.prepTimeMinutes || 0,
          difficulty: r.difficulty || 'Közepes'
        }));

        if (mappedRecipes.length > 0) {
          setAllRecipes(mappedRecipes as any);
        } else {
          setAllRecipes(sampleRecipes);
        }
      } catch (e) {
        console.error('Failed to load recipes', e);
        setAllRecipes(sampleRecipes);
      }
    };

    loadRecipes();
  }, []);

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

    // Vegan Filter
    if (isVeganFilter) {
      result = result.filter(r => r.isVegan);
    }

    // Difficulty Filter
    if (difficultyFilter) {
      result = result.filter(r => r.difficulty === difficultyFilter);
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
  }, [allRecipes, searchQuery, selectedCategory, selectedAllergens, sortBy, isVeganFilter, difficultyFilter]);

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  return (
    <>
      <Hero />

      <section id="recipes" className="mx-auto max-w-6xl px-4 py-12">
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

                  {/* Difficulty & Vegan */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Nehézség</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setDifficultyFilter(null)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!difficultyFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          Összes
                        </button>
                        {['Könnyű', 'Közepes', 'Nehéz'].map(diff => (
                          <button
                            key={diff}
                            onClick={() => setDifficultyFilter(difficultyFilter === diff ? null : diff)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${difficultyFilter === diff ? 'bg-[#BD95A4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Egyéb</h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isVeganFilter}
                          onChange={(e) => setIsVeganFilter(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-[#BD95A4] focus:ring-[#BD95A4]"
                        />
                        <span className="text-sm font-medium text-slate-700">Csak vegán receptek</span>
                      </label>
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
    </>
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
                    <Route path="/admin" element={<AdminDashboard />} />
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
