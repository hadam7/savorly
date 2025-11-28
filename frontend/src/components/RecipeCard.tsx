import { Link } from 'react-router-dom';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import type { SampleRecipe } from '../data/sampleRecipes';

type Props = {
  recipe: SampleRecipe;
};

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A1836C]/70"
      aria-label={`${recipe.title} megnyitása`}
    >
      <article className="glass-card overflow-hidden p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div
          className="h-40 w-full bg-gradient-to-br"
          style={{
            backgroundImage: `linear-gradient(135deg, ${recipe.gradientFrom} 0%, ${recipe.gradientTo} 100%)`,
          }}
        />
        <div className="px-4 py-3">
          <h3 className="text-base font-semibold text-slate-900">{recipe.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{recipe.description}</p>

          <div className="mt-3 flex items-center justify-between text-[0.75rem] text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Clock size={14} /> {recipe.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag size={14} /> {recipe.tag}
            </span>
            <span className="inline-flex items-center gap-1 text-[#755463] transition-transform duration-300 group-hover:translate-x-1">
              Megnyitás <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
