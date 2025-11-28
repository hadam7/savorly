import { ChefHat, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200/60 pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#BD95A4] to-[#A1836C] text-white">
                                <ChefHat size={16} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">Savorly</span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            A modern receptgyűjtő alkalmazás, ahol a főzés művészete találkozik a közösséggel.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Felfedezés</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/recipes" className="hover:text-[#BD95A4] transition-colors">Receptek</Link></li>
                            <li><Link to="/categories" className="hover:text-[#BD95A4] transition-colors">Kategóriák</Link></li>
                            <li><Link to="/popular" className="hover:text-[#BD95A4] transition-colors">Népszerű</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Közösség</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/about" className="hover:text-[#BD95A4] transition-colors">Rólunk</Link></li>
                            <li><Link to="/blog" className="hover:text-[#BD95A4] transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-[#BD95A4] transition-colors">Kapcsolat</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Kövess minket</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-[#BD95A4] hover:text-white transition-all duration-300">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-[#BD95A4] hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-[#BD95A4] hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>© 2024 Savorly. Minden jog fenntartva.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-600">Adatvédelem</a>
                        <a href="#" className="hover:text-slate-600">Felhasználási feltételek</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
