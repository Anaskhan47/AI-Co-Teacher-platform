import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle, BookOpen, Layers, FileText, Sparkles, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const RESOURCES = [
    {
        title: "The Human Heart",
        category: "Lessons",
        description: "Create fun, accurate, and classroom-ready slides. Instantly align to standards.",
        type: "Lesson Plan",
        image: "/heart-quiz-card.png",
        theme: "rose",
        bg: "bg-rose-500/10", 
        accent: "text-rose-400",
        style: "floating-ui"
    },
    {
        title: "Osmosis vs Diffusion",
        category: "Lesson series",
        description: "Want to plan an entire unit? Create an ordered series of lessons on complex topics.",
        type: "Unit Plan",
        image: "/osmosis-card.png",
        theme: "orange",
        bg: "bg-orange-500/10", 
        accent: "text-orange-400",
        style: "stacked"
    },
    {
        title: "Origins of the Mongol Empire",
        category: "Activity sheets",
        description: "Generate engaging activities to go with your lessons. Ready to share, export or print.",
        type: "Worksheet",
        image: "/mongol-card.png",
        theme: "teal",
        bg: "bg-emerald-500/10", 
        accent: "text-emerald-400",
        style: "stacked-teal"
    }
];

const ResourceShowcase = () => {
    return (
        <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-indigo-100">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Premium Synthetics
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tighter uppercase leading-none"
                    >
                        Assets that look <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Professionally Synthesized</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-bold uppercase tracking-tighter"
                    >
                        Eliminate the formatting bottleneck. Our engine generates beautiful, high-fidelity, and deployable assets instantly.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
                    {RESOURCES.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="group flex flex-col"
                        >
                            {/* Visual Card Area */}
                            <div className={`${resource.bg} rounded-[4rem] p-12 aspect-[4/5] relative overflow-hidden transition-all duration-1000 hover:-translate-y-6 mb-10 flex items-center justify-center border border-slate-200 group-hover:border-indigo-300 group-hover:bg-opacity-20 shadow-sm`}>

                                {/* Background Decorative Blobs */}
                                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

                                {/* Render Style: Floating UI (Heart) */}
                                {resource.style === "floating-ui" && (
                                    <div className="relative w-full max-w-[280px] perspective-2000">
                                        {/* Main Document Card */}
                                        <div className="bg-slate-900 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 relative z-10 rotate-[-3deg] transition-all duration-1000 group-hover:rotate-0 group-hover:scale-105">
                                            <div className="h-2.5 bg-rose-500 w-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                                            <div className="p-8">
                                                <h4 className="font-black text-white text-2xl leading-none mb-3 tracking-tighter uppercase">The Human Heart</h4>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">Anatomy Lesson Plan</p>
                                                <div className="w-full aspect-video bg-slate-950 rounded-2xl mb-6 overflow-hidden border border-white/5 shadow-inner">
                                                    <img src={resource.image} alt="" className="w-full h-full object-cover opacity-40 transition-all duration-700 group-hover:opacity-80 group-hover:scale-110" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="h-2 w-full bg-white/5 rounded-full" />
                                                    <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Pills */}
                                        <motion.div
                                            animate={{ y: [0, -15, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute -right-8 top-16 bg-slate-950/90 backdrop-blur-3xl rounded-2xl shadow-2xl border border-white/10 p-4 flex items-center gap-4 z-20"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-lg">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objectives</span>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                                        </motion.div>

                                        <motion.div
                                            animate={{ y: [0, 15, 0] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                            className="absolute -left-8 bottom-12 bg-slate-950/90 backdrop-blur-3xl rounded-2xl shadow-2xl border border-white/10 p-4 flex items-center gap-4 z-20"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-400 flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
                                                <PlayCircle className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visualization</span>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                                        </motion.div>
                                    </div>
                                )}

                                {/* Render Style: Stacked (Orange/Teal) */}
                                {(resource.style === "stacked" || resource.style === "stacked-teal") && (
                                    <div className="relative w-full max-w-[260px] perspective-2000">
                                        {/* Stack Layers */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 rounded-[3rem] shadow-2xl border border-white/5 rotate-[8deg] opacity-30 scale-90 translate-x-8 translate-y-6" />
                                        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 rounded-[3rem] shadow-2xl border border-white/5 rotate-[4deg] opacity-50 scale-95 translate-x-4 translate-y-3" />

                                        {/* Main Card */}
                                        <div className="bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 relative z-10 transition-all duration-1000 group-hover:-translate-y-4 group-hover:scale-105">
                                            <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden">
                                                <img src={resource.image} alt="" className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                                <div className="absolute bottom-6 left-8 text-white">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">{resource.type}</p>
                                                    <p className="text-xl font-black tracking-tighter uppercase leading-none">{resource.title}</p>
                                                </div>
                                            </div>
                                            <div className="p-8 bg-slate-900">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center shadow-lg border border-indigo-500/20">
                                                       <Sparkles className="w-5 h-5 text-indigo-400" />
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">AI Generation</div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="px-4 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-white/5">Grade 8</span>
                                                    <span className="px-4 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-white/5">Science</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Badge */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.8 }}
                                            className={`absolute -right-10 bottom-16 bg-slate-950/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 flex items-center gap-5 z-20 border border-white/10`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl bg-${resource.theme === 'orange' ? 'orange' : 'emerald'}-600/10 flex items-center justify-center text-${resource.theme === 'orange' ? 'orange' : 'emerald'}-400 shrink-0 border border-${resource.theme === 'orange' ? 'orange' : 'emerald'}-500/20 shadow-lg`}>
                                                {resource.theme === 'orange' ? <Layers className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Architecture</p>
                                                <p className="text-xs font-black text-white uppercase tracking-widest">
                                                    {resource.theme === 'orange' ? '3 Lesson Nodes' : 'Activity Node'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}

                            </div>

                            {/* Text Content */}
                            <div className="px-4">
                                <h3 className="text-3xl font-black text-slate-900 mb-5 uppercase tracking-tighter leading-none">
                                    {resource.category}
                                </h3>
                                <p className="text-slate-500 leading-relaxed mb-8 font-bold text-sm uppercase tracking-tighter">
                                    {resource.description}
                                </p>
                                <div className={`flex items-center ${resource.accent} font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer group/link hover:text-indigo-700 transition-colors`}>
                                    Start Generation <ArrowRight className="w-5 h-5 ml-3 transition-all duration-500 group-hover/link:translate-x-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResourceShowcase;
