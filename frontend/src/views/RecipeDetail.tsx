import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sampleRecipes } from '../data/sampleRecipes';
import { Clock, Users, Heart, Check, Trash2, Edit, ChefHat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchRecipeById, deleteRecipe } from '../api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      setError(null);

      try {
        const backendRecipe = await fetchRecipeById(parseInt(id));

        const mappedRecipe = {
          ...backendRecipe,
          instructions: backendRecipe.instructions || [],
          allergens: backendRecipe.allergens || [],
          ingredients: backendRecipe.ingredients || [],
          category: backendRecipe.categories || [],
          author: backendRecipe.authorName || 'Unknown',
          likes: backendRecipe.likes || 0,
          prepTime: backendRecipe.prepTimeMinutes || 0
        };

        setRecipe(mappedRecipe);
        setLikesCount(mappedRecipe.likes);
      } catch (err) {
        console.error('Failed to load recipe', err);

        const sample = sampleRecipes.find(r => String(r.id) === String(id));
        if (sample) {
          setRecipe(sample);
        } else {
          setError('A recept nem található.');
          setRecipe(null);
        }
      }
    };

    loadRecipe();
  }, [id, navigate]);


  useEffect(() => {
    if (user && id) {
      const savedFavorites = localStorage.getItem(`savorly_favorites_${user.userName}`);
      if (savedFavorites) {
        try {
          const favorites = JSON.parse(savedFavorites);
          setIsFavorite(favorites.includes(id));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    } else {
      setIsFavorite(false);
    }
  }, [user, id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      const api = await import('../api');
      let newLikes = likesCount;

      if (isFavorite) {
        const res = await api.unlikeRecipe(parseInt(id));
        newLikes = res.likes;
      } else {
        const res = await api.likeRecipe(parseInt(id));
        newLikes = res.likes;
      }

      setLikesCount(newLikes);

      const savedFavorites = localStorage.getItem(`savorly_favorites_${user.userName}`);
      let favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (isFavorite) {
        favorites = favorites.filter((favId) => favId !== id);
      } else {
        if (!favorites.includes(id)) {
          favorites.push(id);
        }
      }

      localStorage.setItem(`savorly_favorites_${user.userName}`, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a receptet?')) {
      try {
        if (id) {
          await deleteRecipe(parseInt(id));
          navigate('/');
        }
      } catch (e) {
        console.error('Failed to delete recipe', e);
        alert('Hiba történt a törlés során.');
      }
    }
  };


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


  const [completedIngredients, setCompletedIngredients] = useState<number[]>([]);


  useEffect(() => {
    if (user && id) {
      const savedIngredients = localStorage.getItem(`savorly_ingredients_${user.userName}_${id}`);
      if (savedIngredients) {
        try {
          setCompletedIngredients(JSON.parse(savedIngredients));
        } catch (e) {
          console.error('Failed to parse saved ingredients', e);
        }
      } else {
        setCompletedIngredients([]);
      }
    }
  }, [user, id]);


  useEffect(() => {
    if (isLoaded && user && id) {
      localStorage.setItem(`savorly_ingredients_${user.userName}_${id}`, JSON.stringify(completedIngredients));
    }
  }, [completedIngredients, user, id, isLoaded]);

  const toggleIngredient = (index: number) => {
    setCompletedIngredients((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 pt-32 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Hoppá!</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full bg-[#BD95A4] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#BD95A4]/20 transition-all hover:bg-[#A17A8C] hover:shadow-xl hover:-translate-y-0.5"
        >
          Vissza a főoldalra
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 pt-32">
        <p className="text-slate-600">Betöltés...</p>
      </div>
    );
  }

  const isOwner = user && recipe.author === user.userName;

  return (
    <section className="min-h-screen pb-20">

      <div className="relative h-[40vh] w-full overflow-hidden md:h-[50vh]">
        <div className="absolute inset-0 bg-slate-900/20" />
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#BD95A4] to-[#A1836C] text-white">
            <ChefHat size={120} strokeWidth={1} className="opacity-90" />
          </div>
        ) : (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8 md:p-12">
          <div className="mx-auto max-w-4xl">

            <h1 className="text-3xl font-bold text-white md:text-5xl">{recipe.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-4xl px-4 relative z-10">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/20 md:p-12">

          <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap gap-4 md:gap-8">
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
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
                  <ChefHat size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Nehézség</p>
                  <p className="font-semibold text-slate-900">{recipe.difficulty || 'Közepes'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-red-400">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Kedvelések</p>
                  <p className="font-semibold text-slate-900">{likesCount}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="flex gap-3">
                {isOwner && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-recipe/${id}`)}
                      className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200 hover:text-slate-900"
                    >
                      <Edit size={18} />
                      Szerkesztés
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 font-semibold text-red-500 transition-all duration-300 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                      Törlés
                    </button>
                  </>
                )}
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-all duration-300 ${isFavorite
                    ? 'bg-red-50 text-red-500'
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                  {isFavorite ? 'Mentve' : 'Mentés'}
                </button>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {recipe.isVegan && (
                  <span className="inline-flex items-center rounded-full bg-[#A1836C]/10 px-3 py-1 text-xs font-medium text-[#A1836C]">
                    Vegán
                  </span>
                )}
                {recipe.allergens && recipe.allergens.map((allergen: string) => (
                  <span key={allergen} className="inline-flex items-center rounded-full bg-[#BD95A4] px-3 py-1 text-xs font-medium text-white">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {Array.isArray(recipe.category) ? recipe.category.map((cat: string) => (
              <span key={cat} className="inline-flex items-center rounded-full bg-[#A1836C]/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white shadow-sm border border-white/20">
                {cat}
              </span>
            )) : (
              <span className="inline-flex items-center rounded-full bg-[#A1836C]/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white shadow-sm border border-white/20">
                {recipe.category}
              </span>
            )}
          </div>


          <div className="prose prose-slate max-w-none mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Leírás</h2>
            <p className="text-lg leading-relaxed text-slate-600">{recipe.description}</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">

            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BD95A4]/10 text-[#BD95A4]">
                  <Users size={18} />
                </span>
                Hozzávalók
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient: string, idx: number) => {
                  const isChecked = completedIngredients.includes(idx);
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-start gap-3 rounded-xl p-3 transition-all cursor-pointer group ${isChecked
                        ? 'bg-[#BD95A4]/10'
                        : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                    >
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isChecked
                        ? 'border-[#BD95A4] bg-[#BD95A4]'
                        : 'border-slate-300 bg-white group-hover:border-[#BD95A4]'
                        }`}>
                        {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-slate-700 transition-all ${isChecked ? 'line-through opacity-60' : ''}`}>
                        {ingredient}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>


            <div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A1836C]/10 text-[#A1836C]">
                  <Clock size={18} />
                </span>
                Elkészítés
              </h3>
              <div className="space-y-8">
                {recipe.instructions.map((step: string, idx: number) => {
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
