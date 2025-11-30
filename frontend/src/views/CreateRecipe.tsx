import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createRecipe, updateRecipe, fetchRecipeById, fetchCategories, CategoryDto } from '../api';
import { Plus, Minus, Upload, Clock, Users, Save, ArrowLeft } from 'lucide-react';

export default function CreateRecipe() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [servings, setServings] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState<string[]>(['']);
    const [isVegan, setIsVegan] = useState(false);
    const [difficulty, setDifficulty] = useState('Közepes');

    const availableAllergens = ['Glutén', 'Tej', 'Tojás', 'Mogyoró', 'Szója', 'Hal', 'Szezámmag', 'Diófélék', 'Zeller', 'Mustár'];

    useEffect(() => {
        const loadData = async () => {
            try {
                const cats = await fetchCategories();
                setAvailableCategories(cats);

                if (id && user) {
                    const recipe = await fetchRecipeById(parseInt(id));
                    setTitle(recipe.title);
                    setDescription(recipe.description || '');
                    setImageUrl(recipe.imageUrl || '');
                    setPrepTime(recipe.prepTimeMinutes?.toString() || '');
                    setServings(recipe.servings.toString());

                    setSelectedCategoryIds(recipe.categoryIds || []);
                    setSelectedAllergens(recipe.allergens || []);
                    setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : ['']);
                    setInstructions(recipe.instructions.length > 0 ? recipe.instructions : ['']);
                    setIsVegan(recipe.isVegan);
                    setDifficulty(recipe.difficulty || 'Közepes');
                }
            } catch (error) {
                console.error('Failed to load data', error);
                if (id) navigate('/');
            }
        };
        loadData();
    }, [id, user, navigate]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleAddIngredient = () => setIngredients([...ingredients, '']);
    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };
    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleAddInstruction = () => setInstructions([...instructions, '']);
    const handleRemoveInstruction = (index: number) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };
    const handleInstructionChange = (index: number, value: string) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleCategory = (catId: number) => {
        setSelectedCategoryIds(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const toggleAllergen = (allergen: string) => {
        setSelectedAllergens(prev =>
            prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        const token = localStorage.getItem('savorly_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const recipeData = {
            title,
            description,
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
            prepTimeMinutes: parseInt(prepTime) || 0,
            servings: parseInt(servings) || 1,
            categoryIds: selectedCategoryIds,
            isVegan: isVegan,
            allergens: selectedAllergens,
            ingredients: ingredients.filter(i => i.trim() !== ''),
            instructions: instructions.filter(i => i.trim() !== ''),
            difficulty: difficulty
        };

        try {
            if (id) {
                // Update existing
                await updateRecipe(token, parseInt(id), recipeData);
                navigate(`/recipe/${id}`);
            } else {
                // Create new
                await createRecipe(token, recipeData);
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to save recipe', error);
            alert('Hiba történt a mentés során.');
        }
    };

    return (
        <section className="min-h-screen pb-20 pt-28 px-4">
            <div className="mx-auto max-w-3xl">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#BD95A4] transition-colors"
                >
                    <ArrowLeft size={16} /> Vissza a főoldalra
                </button>

                <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/20 md:p-12">
                    <h1 className="mb-8 text-3xl font-bold text-slate-900">{id ? 'Recept szerkesztése' : 'Új recept létrehozása'}</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Recept neve</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                    placeholder="pl. Tárkonyos csirkeragu leves"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Rövid leírás <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                    placeholder="Írd le röviden, milyen ez az étel..."
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Recept képe</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-3 text-slate-500 transition-colors hover:border-[#BD95A4] hover:bg-[#BD95A4]/5 hover:text-[#BD95A4]"
                                        >
                                            <Upload size={20} />
                                            {imageUrl ? 'Kép cseréje' : 'Kép feltöltése'}
                                        </label>
                                    </div>
                                    {imageUrl && (
                                        <div className="mt-4 relative h-48 w-full overflow-hidden rounded-xl border border-slate-200">
                                            <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm hover:text-red-500 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">Kategóriák</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableCategories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleCategory(cat.id)}
                                                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${selectedCategoryIds.includes(cat.id)
                                                        ? 'bg-[#BD95A4] text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Elkészítési idő (perc)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={prepTime}
                                            onChange={(e) => setPrepTime(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Adagok száma</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={servings}
                                            onChange={(e) => setServings(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                            placeholder="4"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Nehézség</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                >
                                    <option value="Könnyű">Könnyű</option>
                                    <option value="Közepes">Közepes</option>
                                    <option value="Nehéz">Nehéz</option>
                                </select>
                            </div>


                            <div>
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={isVegan}
                                        onChange={(e) => setIsVegan(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-[#BD95A4] focus:ring-[#BD95A4] accent-[#BD95A4]"
                                    />
                                    <span className="font-semibold text-slate-700">Vegán recept</span>
                                </label>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Allergének</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableAllergens.map(allergen => (
                                        <button
                                            key={allergen}
                                            type="button"
                                            onClick={() => toggleAllergen(allergen)}
                                            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${selectedAllergens.includes(allergen)
                                                ? 'bg-[#BD95A4] text-white'
                                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                        >
                                            {allergen}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <label className="text-lg font-semibold text-slate-900">Hozzávalók</label>
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                >
                                    <Plus size={16} /> Hozzáadás
                                </button>
                            </div>
                            <div className="space-y-3">
                                {ingredients.map((ingredient, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            required
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(idx, e.target.value)}
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                            placeholder={`pl. 50 dkg liszt`}
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIngredient(idx)}
                                                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Minus size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <label className="text-lg font-semibold text-slate-900">Elkészítés lépései</label>
                                <button
                                    type="button"
                                    onClick={handleAddInstruction}
                                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                >
                                    <Plus size={16} /> Hozzáadás
                                </button>
                            </div>
                            <div className="space-y-3">
                                {instructions.map((instruction, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-400">
                                            {idx + 1}
                                        </div>
                                        <textarea
                                            required
                                            value={instruction}
                                            onChange={(e) => handleInstructionChange(idx, e.target.value)}
                                            rows={2}
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                            placeholder="Írd le a lépést..."
                                        />
                                        {instructions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInstruction(idx)}
                                                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Minus size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD95A4] py-4 text-lg font-bold text-white shadow-lg shadow-[#BD95A4]/20 transition-all hover:bg-[#A17A8C] hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <Save size={20} />
                                Recept mentése
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </section >
    );
}
