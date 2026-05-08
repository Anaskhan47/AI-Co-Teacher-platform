import { motion } from "framer-motion";
import {
    Edit3,
    Sparkles,
    AlignLeft,
    Bold,
    Italic,
    List,
    Undo,
    Redo,
    Type,
    Image,
    Grid,
    HelpCircle,
    Maximize2,
    Minimize2,
    Wand2,
    Check,
    PenTool
} from "lucide-react";

const LessonEditor = () => {
    return (
        <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-indigo-100">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute bottom-1/4 right-1/4 w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-40">

                    {/* Left Content */}
                    <div className="flex-1 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg">
                                <PenTool className="w-4 h-4 text-amber-400" />
                                Artistic Control
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 leading-none tracking-tighter uppercase">
                                Refine until <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-500 italic">
                                    Absolute Perfection
                                </span>
                            </h2>
                            <p className="text-xl text-slate-500 mb-16 leading-relaxed font-bold uppercase tracking-tighter">
                                Our synthesis engine provides the foundation. You provide the soul.
                                Utilize high-performance editing tools to calibrate content, or trigger 
                                neural shortcuts for instant simplification or linguistic translation.
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-center gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 shadow-2xl">
                                        <Wand2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-1">AI Shortcuts</h4>
                                        <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] leading-relaxed">Instantly simplify complexity or expand thematic nodes.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-2xl">
                                        <Edit3 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-1">Professional Synthesis</h4>
                                        <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] leading-relaxed">Full semantic control over formatting and structural integrity.</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                    {/* Right Visual - Editor Mockup */}
                    <div className="flex-1 w-full relative perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
                            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="flex gap-8 items-center">
                                {/* Left Toolbar Strip (Mock) */}
                                <div className="hidden md:flex flex-col gap-10 bg-white/90 backdrop-blur-3xl rounded-[3rem] py-12 px-6 border border-slate-200 shadow-sm text-slate-500 items-center">
                                    <div className="space-y-8 border-b border-white/5 pb-10">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:text-indigo-400 cursor-pointer transition-all hover:scale-110"><Undo className="w-5 h-5" /></div>
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:text-indigo-400 cursor-pointer transition-all hover:scale-110"><Redo className="w-5 h-5" /></div>
                                    </div>
                                    <div className="space-y-10">
                                        <Type className="w-7 h-7 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" />
                                        <Image className="w-7 h-7 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" />
                                        <Grid className="w-7 h-7 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" />
                                    </div>
                                    <div className="mt-auto pt-10 border-t border-white/5">
                                        <HelpCircle className="w-7 h-7 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" />
                                    </div>
                                </div>

                                {/* Main Slide Area - 3 Column Layout */}
                                <div className="flex-1 bg-white aspect-auto md:aspect-[4/3] rounded-[4rem] shadow-sm border border-slate-200 overflow-hidden relative isolate p-12 flex flex-col md:flex-row items-center gap-10 group">

                                    {/* Left Col: Portrait */}
                                    <div className="w-full md:w-1/3 shrink-0">
                                        <div className="w-full aspect-[3/4] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl -rotate-6 border-8 border-slate-800 transition-all duration-1000 group-hover:rotate-0 group-hover:scale-105">
                                            <img
                                                src="/features/newton_portrait.png"
                                                alt="Portrait"
                                                className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity"
                                            />
                                        </div>
                                    </div>

                                    {/* Middle Col: Text */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h1 className="text-3xl md:text-5xl font-black text-white mb-8 font-display leading-[0.9] tracking-tighter uppercase">
                                            Lunar <br />Gravity
                                        </h1>
                                        <div className="space-y-6 text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-tighter">
                                            <p>
                                                The Lunar field is significantly weaker than Earth's. Vector magnitude is calibrated at approximately
                                                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-xl mx-2 font-black border border-indigo-500/20 shadow-lg">
                                                    16.6% Core Strength
                                                </span>.
                                            </p>
                                            <p className="text-slate-600 opacity-60">
                                                In practice, a 60kg unit would experience only 10kg of surface tension.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Col: Secondary Visual */}
                                    <div className="w-full md:w-1/3 shrink-0">
                                        <div className="w-full aspect-square bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-6 border-8 border-slate-800 transition-all duration-1000 group-hover:rotate-0 group-hover:scale-105 mb-10 md:mb-0">
                                            <img
                                                src="/features/moon_gravity.png"
                                                alt="Visual"
                                                className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity"
                                            />
                                        </div>
                                    </div>

                                    {/* Floating AI Popup - Centered */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-slate-950/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 p-3 z-20"
                                    >
                                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 mb-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                                                <span className="font-black text-[10px] text-white uppercase tracking-[0.3em]">AI Shortcuts</span>
                                            </div>
                                            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                                        </div>

                                        <div className="p-2 space-y-3">
                                            {[
                                                { icon: Wand2, color: "emerald", label: "Simplify Lesson" },
                                                { icon: Maximize2, color: "indigo", label: "Expand Node" },
                                                { icon: Check, color: "amber", label: "Verify Integrity" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-5 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-all group/item">
                                                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 border border-${item.color}-500/20 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all`}>
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/item:text-white transition-colors">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LessonEditor;
