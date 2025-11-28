import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-[10%] w-96 h-96 bg-[#BD95A4]/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-[10%] w-80 h-80 bg-[#A1836C]/10 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm mb-8"
                >
                    <Sparkles size={14} className="text-[#BD95A4]" />
                    <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">A főzés művészete</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
                    Fedezd fel az <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD95A4] via-[#A1836C] to-[#755463]">
                        ízek világát
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Merülj el a gasztronómia csodáiban. Válogatott receptek, kulináris inspirációk és egy közösség, ami összeköt.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/recipes"
                        className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold overflow-hidden shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 hover:-translate-y-1"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Böngészés <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    <button className="group px-8 py-4 bg-white text-slate-900 rounded-full font-semibold border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                        <PlayCircle size={18} className="text-[#BD95A4] group-hover:scale-110 transition-transform duration-300" />
                        Hogyan működik?
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
