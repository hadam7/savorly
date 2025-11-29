import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sampleRecipes } from '../data/sampleRecipes';
import { ArrowLeft, Clock, Users, Heart, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const recipe = sampleRecipes.find((r) => r.id === id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress on mount or when user/recipe changes
  useEffect(() => {
    if (user && id) {
      const savedProgress = localStorage.getItem(`savorly_progress_${user.userName}_${id}`);
      if (savedProgress) {
        try {
          setCompletedSteps(JSON.parse(savedProgress));
        } catch (e) {
          console.error('Failed to parse saved progress', e);
        }
      } else {
        setCompletedSteps([]);
      }
      setIsLoaded(true);
    }
  }, [user, id]);

  // Save progress whenever it changes
  useEffect(() => {
    if (isLoaded && user && id) {
      localStorage.setItem(`savorly_progress_${user.userName}_${id}`, JSON.stringify(completedSteps));
    }
  }, [completedSteps, user, id, isLoaded]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (!recipe) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 pt-32">
        <p className="text-slate-600">A recept nem található.</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-4 text-[#BD95A4] hover:text-[#755463]">
          <ArrowLeft size={16} /> Vissza a főoldalra
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen pb-20 pt-28">
      {/* Hero Image */}
      <div className="relative h-[40vh] w-full overflow-hidden md:h-[50vh]">
        <div className="absolute inset-0 bg-slate-900/20" />
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8 md:p-12">
          <div className="mx-auto max-w-4xl">
            <span className="mb-4 inline-block rounded-full bg-[#BD95A4] px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
              {recipe.category}
            </span>
            <h1 className="text-3xl font-bold text-white md:text-5xl">{recipe.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-4xl px-4 relative z-10">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/20 md:p-12">
          {/* Meta Data & Actions */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[#BD95A4]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Elkészítés</p>
                  <p className="font-semibold text-slate-900">{recipe.prepTime} perc</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[#A1836C]">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Adagok</p>
                  <p className="font-semibold text-slate-900">{recipe.servings} fő</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${isFavorite
                ? 'bg-red-50 text-red-500'
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'
                }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              {isFavorite ? 'Mentve' : 'Mentés kedvencekhez'}
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-slate max-w-none mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Leírás</h2>
            <p className="text-lg leading-relaxed text-slate-600">{recipe.description}</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            {/* Ingredients */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BD95A4]/10 text-[#BD95A4]">
                  <Users size={18} />
                </span>
                Hozzávalók
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#BD95A4]" />
                    <span className="text-slate-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A1836C]/10 text-[#A1836C]">
                  <Clock size={18} />
                </span>
                Elkészítés
              </h3>
              <div className="space-y-8">
                {recipe.instructions.map((step, idx) => {
                  const isCompleted = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`group relative pl-8 transition-all duration-300 ${isCompleted ? 'opacity-60' : ''}`}
                    >
                      <button
                        onClick={() => toggleStep(idx)}
                        className={`absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 font-bold shadow-sm transition-all duration-300 hover:scale-110 ${isCompleted
                          ? 'border-[#BD95A4] bg-[#BD95A4] text-white'
                          : 'border-white bg-slate-100 text-slate-400 group-hover:bg-[#BD95A4] group-hover:text-white'
                          }`}
                      >
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                      </button>
                      <div className="border-l-2 border-slate-100 pl-8 pb-8 last:border-0 last:pb-0">
                        <p
                          className={`text-lg leading-relaxed transition-all duration-300 cursor-pointer ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'
                            }`}
                          onClick={() => toggleStep(idx)}
                        >
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
