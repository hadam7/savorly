import { useParams, Link } from 'react-router-dom';
import { sampleRecipes } from '../data/sampleRecipes';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = sampleRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-slate-600">A recept nem található.</p>
        <Link to="/" className="nav-link inline-flex items-center gap-2 mt-4">
          <ArrowLeft size={16} /> Vissza a főoldalra
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/" className="nav-link inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Vissza
      </Link>

      <div className="glass-card mt-6 overflow-hidden">
        <div
          className="h-56 w-full"
          style={{
            backgroundImage: `linear-gradient(135deg, ${recipe.gradientFrom} 0%, ${recipe.gradientTo} 100%)`,
          }}
        />
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-slate-900">{recipe.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{recipe.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><Clock size={16} /> {recipe.time}</span>
            <span className="inline-flex items-center gap-2"><Tag size={16} /> {recipe.tag}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
