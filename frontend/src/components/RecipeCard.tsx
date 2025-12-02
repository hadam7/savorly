import { Clock, Users, Heart, ArrowUpRight, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

import { SampleRecipe } from '../data/sampleRecipes';

interface RecipeCardProps {
  recipe: SampleRecipe;
  index?: number;
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.likes || 0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`savorly_favorites_${user.userName}`);
      if (savedFavorites) {
        try {
          const favorites = JSON.parse(savedFavorites);
          // Ensure we compare strings
          setIsFavorite(favorites.includes(String(recipe.id)));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    } else {
      setIsFavorite(false);
    }
  }, [user, recipe.id]);

  useEffect(() => {
    setLikesCount(recipe.likes || 0);
  }, [recipe.likes]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const api = await import('../api');
      let newLikes = likesCount;
      const recipeId = parseInt(String(recipe.id)); // Ensure number for API

      if (isFavorite) {
        const res = await api.unlikeRecipe(recipeId);
        newLikes = res.likes;
      } else {
        const res = await api.likeRecipe(recipeId);
        newLikes = res.likes;
      }

      setLikesCount(newLikes);

      // Update local storage for "favorite" status (UI toggle)
      const savedFavorites = localStorage.getItem(`savorly_favorites_${user.userName}`);
      let favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
      const strId = String(recipe.id);

      if (isFavorite) {
        favorites = favorites.filter((favId) => favId !== strId);
      } else {
        if (!favorites.includes(strId)) {
          favorites.push(strId);
        }
      }

      localStorage.setItem(`savorly_favorites_${user.userName}`, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);

    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="group relative h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-white border border-white/60 shadow-lg shadow-slate-200/40 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-64 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-500 z-10" />
          {/* Image or Fallback */}
          {imageError ? (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#BD95A4] to-[#A1836C] text-white">
              <ChefHat size={64} strokeWidth={1.5} className="opacity-90" />
            </div>
          ) : (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          )}

          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <span className="px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-sm">
              {(() => {
                const cats = (recipe as any).categories || (recipe as any).category;
                return Array.isArray(cats) ? cats[0] : cats;
              })()}
            </span>
            {recipe.isVegan && (
              <span className="px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase bg-[#A1836C]/90 backdrop-blur-md border border-white/30 rounded-full shadow-sm">
                Vegán
              </span>
            )}
          </div>

          {/* Quick Action Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 z-20 p-2.5 backdrop-blur-sm rounded-full transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg ${isFavorite
              ? 'bg-red-50 text-red-500 opacity-100'
              : 'bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100'
              }`}
          >
            <Heart size={18} className={`transition-transform active:scale-90 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-[#755463] transition-colors duration-300">
              {recipe.title}
            </h3>
            <div className="p-2 -mr-2 -mt-2 text-slate-300 group-hover:text-[#BD95A4] transition-colors duration-300">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
            {recipe.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#BD95A4]" />
                <span>{recipe.prepTime} perc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-[#A1836C]" />
                <span>{recipe.servings} adag</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={14} className="text-red-400" />
                <span>{likesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
