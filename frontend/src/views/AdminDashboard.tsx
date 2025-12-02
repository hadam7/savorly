import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchUsers, deleteUser, toggleUserStatus, fetchUserRecipes, deleteRecipe, RecipeListItemDto } from '../api';
import { Trash2, Shield, ShieldOff, User as UserIcon, Search, AlertTriangle, BookOpen, X, Wrench, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
    id: number;
    userName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [userRecipes, setUserRecipes] = useState<RecipeListItemDto[]>([]);
    const [recipesLoading, setRecipesLoading] = useState(false);


    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [editingCategory, setEditingCategory] = useState<{ id: number, name: string } | null>(null);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError('Nem sikerült betölteni a felhasználókat.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await import('../api').then(m => m.fetchCategories());
            setCategories(data);
        } catch (err) {
            alert('Nem sikerült betölteni a kategóriákat.');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const api = await import('../api');

            if (editingCategory) {
                await api.updateCategory(editingCategory.id, newCategoryName);
                setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: newCategoryName } : c));
                setEditingCategory(null);
            } else {
                const newCat = await api.createCategory(newCategoryName);
                setCategories([...categories, newCat]);
            }
            setNewCategoryName('');
        } catch (err) {
            alert('Hiba a kategória mentésekor.');
        }
    };

    const startEditing = (cat: { id: number, name: string }) => {
        setEditingCategory(cat);
        setNewCategoryName(cat.name);
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setNewCategoryName('');
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) return;
        try {
            const api = await import('../api');
            await api.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            alert('Hiba a kategória törlésekor.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) return;

        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Hiba történt a törlés során.');
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            const res = await toggleUserStatus(id);
            setUsers(users.map(u => u.id === id ? { ...u, isActive: res.isActive } : u));
        } catch (err) {
            alert('Hiba történt a státusz módosítása során.');
        }
    };

    const handleViewRecipes = async (userData: UserData) => {
        setSelectedUser(userData);
        setRecipesLoading(true);
        try {
            const recipes = await fetchUserRecipes(userData.id);
            setUserRecipes(recipes);
        } catch (err) {
            alert('Nem sikerült betölteni a recepteket.');
            setSelectedUser(null);
        } finally {
            setRecipesLoading(false);
        }
    };

    const handleDeleteRecipe = async (recipeId: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a receptet?')) return;
        try {
            await deleteRecipe(recipeId);
            setUserRecipes(userRecipes.filter(r => r.id !== recipeId));
        } catch (err) {
            alert('Hiba történt a recept törlése során.');
        }
    };

    const filteredUsers = users.filter(u =>
        u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user || user.role !== 'Admin') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900">Hozzáférés megtagadva</h2>
                    <p className="text-slate-500">Ez az oldal csak adminisztrátorok számára elérhető.</p>
                </div>
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-6xl px-4 pt-32 pb-20 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Adminisztrációs Pult</h1>
                    <p className="text-slate-500">Felhasználók és kategóriák kezelése.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setShowCategories(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showCategories ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Felhasználók
                        </button>
                        <button
                            onClick={() => {
                                setShowCategories(true);
                                if (categories.length === 0) loadCategories();
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showCategories ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Kategóriák
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={showCategories ? "Keresés a kategóriák között..." : "Keresés a felhasználók között..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-80 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#BD95A4] focus:ring-1 focus:ring-[#BD95A4] bg-white"
                        />
                    </div>
                </div>
            </div>

            {showCategories ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Kategóriák</h2>

                    <form onSubmit={handleCreateCategory} className="flex gap-4 mb-8">
                        <input
                            type="text"
                            placeholder={editingCategory ? "Kategória átnevezése" : "Új kategória neve"}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#BD95A4] focus:ring-1 focus:ring-[#BD95A4]"
                        />
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Mégse
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!newCategoryName.trim()}
                            className="px-6 py-2 bg-[#BD95A4] text-white rounded-xl font-semibold hover:bg-[#A1836C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {editingCategory ? 'Mentés' : 'Létrehozás'}
                        </button>
                    </form>

                    {loadingCategories ? (
                        <div className="text-center py-12 text-slate-500">Betöltés...</div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            {searchQuery ? 'Nincs a keresésnek megfelelő kategória.' : 'Nincsenek még kategóriák. Hozz létre egyet!'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredCategories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 group hover:border-[#BD95A4]/30 transition-colors">
                                    <span className="font-medium text-slate-700">{cat.name}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEditing(cat)}
                                            className="p-2 text-slate-400 hover:text-[#BD95A4] hover:bg-[#BD95A4]/10 rounded-lg transition-colors"
                                            title="Szerkesztés"
                                        >
                                            <Wrench size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Törlés"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : loading ? (
                <div className="text-center py-20">Betöltés...</div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Felhasználó</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Szerepkör</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Státusz</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Regisztrált</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence>
                                    {filteredUsers.map((u) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <UserIcon size={16} />
                                                    </div>
                                                    <span className="font-medium text-slate-900">{u.userName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(u.id)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${u.isActive
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {u.isActive ? (
                                                        <>
                                                            <Shield size={12} /> Aktív
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldOff size={12} /> Tiltva
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                {new Date(u.createdAt).toLocaleDateString('hu-HU')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewRecipes(u)}
                                                        className="p-2 text-slate-400 hover:text-[#BD95A4] hover:bg-[#BD95A4]/10 rounded-lg transition-colors"
                                                        title="Receptek megtekintése"
                                                    >
                                                        <BookOpen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Felhasználó törlése"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            Nincs találat.
                        </div>
                    )}
                </div>
            )}


            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedUser.userName} receptjei</h3>
                                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {recipesLoading ? (
                                    <div className="text-center py-12 text-slate-500">Betöltés...</div>
                                ) : userRecipes.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        Ennek a felhasználónak még nincsenek receptjei.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userRecipes.map(recipe => (
                                            <div
                                                key={recipe.id}
                                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                                                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#BD95A4]/30 hover:bg-[#BD95A4]/5 transition-colors cursor-pointer"
                                            >
                                                <div className="h-16 w-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {recipe.imageUrl && !failedImages.has(recipe.id) ? (
                                                        <img
                                                            src={recipe.imageUrl}
                                                            alt={recipe.title}
                                                            className="h-full w-full object-cover"
                                                            onError={() => setFailedImages(prev => new Set(prev).add(recipe.id))}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#BD95A4] to-[#A1836C] text-white">
                                                            <ChefHat size={24} strokeWidth={1.5} className="opacity-90" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-900 truncate">{recipe.title}</h4>
                                                    <p className="text-sm text-slate-500 truncate">{recipe.description}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {recipe.categories.map(cat => (
                                                            <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteRecipe(recipe.id);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Recept törlése"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
