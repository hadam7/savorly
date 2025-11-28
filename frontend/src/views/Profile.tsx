import { useState } from 'react';
import { User, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'data' | 'likes'>('data');

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

            <div className="mb-8 flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('data')}
                    className={`relative pb-4 text-sm font-semibold transition-colors ${activeTab === 'data' ? 'text-[#BD95A4]' : 'text-slate-500 hover:text-slate-700'
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
                    className={`relative pb-4 text-sm font-semibold transition-colors ${activeTab === 'likes' ? 'text-[#BD95A4]' : 'text-slate-500 hover:text-slate-700'
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
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'data' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card max-w-lg p-8"
                    >
                        <h2 className="mb-6 text-xl font-semibold text-slate-900">Felhasználói adatok</h2>
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
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Még nincsenek kedvelt receptek</h3>
                            <p className="mt-2 text-slate-500">Böngéssz a receptek között és mentsd el a kedvenceidet!</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
