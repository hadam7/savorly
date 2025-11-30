import { ChefHat, Github, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200/60 pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-4 max-w-sm text-center md:text-left">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#BD95A4] to-[#A1836C] text-white shadow-md shadow-[#BD95A4]/20">
                                <ChefHat size={20} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-slate-800 text-xl tracking-tight">
                                Savorly
                            </span>
                        </Link>
                        <p className="text-slate-500 leading-relaxed">
                            A modern receptgyűjtő alkalmazás, ahol a főzés művészete találkozik a közösséggel.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="font-semibold text-slate-900">Kövess minket</h3>
                        <div className="flex gap-3">
                            <a href="https://github.com/hadam7" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-[#BD95A4] hover:text-white transition-all duration-300">
                                <Github size={20} />
                            </a>
                            <a href="https://www.facebook.com/adam.halasz.7528/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="https://www.instagram.com/halaszadam7/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-[#E4405F] hover:text-white transition-all duration-300">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} Savorly.
                </div>
            </div>
        </footer>
    );
}
