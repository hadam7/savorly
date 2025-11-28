import { Clock, Users, Heart, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  servings: number;
  category: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div className="relative h-full overflow-hidden rounded-3xl bg-white border border-white/60 shadow-lg shadow-slate-200/40 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-500 z-10" />
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
          />

          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-sm">
              {recipe.category}
            </span>
          </div>

          {/* Quick Action Button */}
          <button className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg">
            <Heart size={18} className="transition-transform active:scale-90" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-[#755463] transition-colors duration-300">
              {recipe.title}
            </h3>
            <Link
              to={`/recipe/${recipe.id}`}
              className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-[#BD95A4] transition-colors duration-300"
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#BD95A4]" />
                <span>{recipe.prepTime} perc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-[#A1836C]" />
                <span>{recipe.servings} adag</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
