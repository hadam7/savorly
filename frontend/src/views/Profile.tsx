import { useState, useEffect } from 'react';
import { User, Heart, LogOut, ChefHat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { sampleRecipes } from '../data/sampleRecipes';
import RecipeCard from '../components/RecipeCard';

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'data' | 'likes' | 'my-recipes'>('data');
    const [likedRecipes, setLikedRecipes] = useState<typeof sampleRecipes>([]);
    const [myRecipes, setMyRecipes] = useState<typeof sampleRecipes>([]);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [editForm, setEditForm] = useState({
        userName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError('');
        setEditSuccess('');

        if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
            setEditError('Az új jelszavak nem egyeznek.');
            return;
        }

        try {
            await updateProfile({
                userName: editForm.userName,
                email: editForm.email,
                currentPassword: editForm.currentPassword,
                newPassword: editForm.newPassword
            });
            setEditSuccess('Profil sikeresen frissítve!');
            setTimeout(() => {
                setIsEditing(false);
                setEditSuccess('');
            }, 1500);
        } catch (err: any) {
            setEditError(err.message || 'Hiba történt a frissítés során.');
        }
    };

    useEffect(() => {
        if (user) {
            // Load favorites
            if (activeTab === 'likes') {
                const savedFavorites = localStorage.getItem(`savorly_favorites_${user.userName}`);
                if (savedFavorites) {
                    try {
                        const favoriteIds = JSON.parse(savedFavorites);
                        const recipes = sampleRecipes.filter(r => favoriteIds.includes(r.id));
                        setLikedRecipes(recipes);
                    } catch (e) {
                        console.error('Failed to parse favorites', e);
                    }
                } else {
                    setLikedRecipes([]);
                }
            }

            // Load user recipes
            if (activeTab === 'my-recipes') {
                const savedUserRecipes = localStorage.getItem(`savorly_user_recipes_${user.userName}`);
                if (savedUserRecipes) {
                    try {
                        setMyRecipes(JSON.parse(savedUserRecipes));
                    } catch (e) {
                        console.error('Failed to parse user recipes', e);
                    }
                } else {
                    setMyRecipes([]);
                }
            }
        }
    }, [user, activeTab]);

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-500">Jelentkezz be a profilod megtekintéséhez.</p>
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-4xl px-4 pt-32 pb-20 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Szia, {user.userName}!</h1>
                    <p className="text-slate-500">Kezeld a profilodat és a kedvenc receptjeidet.</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                    <LogOut size={16} />
                    Kijelentkezés
                </button>
            </div>

            <div className="mb-8 flex gap-4 border-b border-slate-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('data')}
                    className={`relative pb-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'data' ? 'text-[#BD95A4]' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <User size={18} />
                        Profil adatok
                    </div>
                    {activeTab === 'data' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BD95A4]"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('likes')}
                    className={`relative pb-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'likes' ? 'text-[#BD95A4]' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Heart size={18} />
                        Kedvelt receptek
                    </div>
                    {activeTab === 'likes' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BD95A4]"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('my-recipes')}
                    className={`relative pb-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'my-recipes' ? 'text-[#BD95A4]' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <ChefHat size={18} />
                        Saját receptek
                    </div>
                    {activeTab === 'my-recipes' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BD95A4]"
                        />
                    )}
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'data' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card max-w-lg p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-900">Felhasználói adatok</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => {
                                        setEditForm({
                                            userName: user.userName,
                                            email: user.email || '',
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setIsEditing(true);
                                        setEditError('');
                                        setEditSuccess('');
                                    }}
                                    className="text-sm font-semibold text-[#BD95A4] hover:text-[#A17A8C]"
                                >
                                    Szerkesztés
                                </button>
                            )}
                        </div>

                        {editError && (
                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {editError}
                            </div>
                        )}

                        {editSuccess && (
                            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                                {editSuccess}
                            </div>
                        )}

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Felhasználónév</label>
                                    <input
                                        type="text"
                                        value={editForm.userName}
                                        onChange={e => setEditForm({ ...editForm, userName: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Email cím</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Jelszó módosítása (opcionális)</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-500">Jelenlegi jelszó</label>
                                            <input
                                                type="password"
                                                value={editForm.currentPassword}
                                                onChange={e => setEditForm({ ...editForm, currentPassword: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                                placeholder="Csak jelszócserekor szükséges"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-500">Új jelszó</label>
                                            <input
                                                type="password"
                                                value={editForm.newPassword}
                                                onChange={e => setEditForm({ ...editForm, newPassword: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-500">Új jelszó megerősítése</label>
                                            <input
                                                type="password"
                                                value={editForm.confirmPassword}
                                                onChange={e => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-[#BD95A4] focus:outline-none focus:ring-1 focus:ring-[#BD95A4]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-[#BD95A4] py-2.5 text-sm font-semibold text-white hover:bg-[#A17A8C]"
                                    >
                                        Mentés
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Mégse
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Felhasználónév</label>
                                    <div className="text-lg font-medium text-slate-900">{user.userName}</div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Email cím</label>
                                    <div className="text-lg font-medium text-slate-900">{user.email || 'Nincs megadva'}</div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-500">Szerepkör</label>
                                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                                        {user.role}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'likes' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {likedRecipes.length > 0 ? (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {likedRecipes.map((recipe, idx) => (
                                    <div key={recipe.id} className="h-[400px]">
                                        <RecipeCard recipe={recipe} index={idx} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                                    <Heart size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Még nincsenek kedvelt receptek</h3>
                                <p className="mt-2 text-slate-500">Böngéssz a receptek között és mentsd el a kedvenceidet!</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'my-recipes' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {myRecipes.length > 0 ? (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {myRecipes.map((recipe, idx) => (
                                    <div key={recipe.id} className="h-[400px]">
                                        <RecipeCard recipe={recipe} index={idx} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                                    <ChefHat size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Még nincsenek saját receptek</h3>
                                <p className="mt-2 text-slate-500">Készítsd el az első saját receptedet!</p>
                                <button
                                    onClick={() => window.location.href = '/create-recipe'}
                                    className="mt-6 rounded-full bg-[#BD95A4] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#BD95A4]/30 transition-all hover:bg-[#A1836C] hover:-translate-y-0.5"
                                >
                                    Recept létrehozása
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
