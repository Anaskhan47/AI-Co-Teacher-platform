import { motion } from "framer-motion";
import { Check, ChevronDown, BookOpen, Sparkles, ShieldCheck } from "lucide-react";

const CurriculumStandards = () => {
    return (
        <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-rose-100">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 right-1/4 w-[60%] h-[60%] bg-rose-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-40">

                    {/* Left Content */}
                    <div className="flex-1 max-w-xl order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg">
                                <ShieldCheck className="w-4 h-4 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                Curriculum Alignment
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 leading-none tracking-tighter uppercase">
                                Aligned to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500 italic">
                                    Global Standards
                                </span>
                            </h2>
                            <p className="text-xl text-slate-500 mb-16 leading-relaxed font-bold uppercase tracking-tighter">
                                Synchronize your instructional content with specific curriculum frameworks instantly.
                                From CBSE to International IB boards, ensure total compliance and academic rigor.
                            </p>

                            <div className="space-y-8">
                                {[
                                    "Smart Mapping to Learning Objectives",
                                    "Comprehensive Board Coverage (CBSE, ICSE, SSC)",
                                    "Automated Gap Analysis for Syllabus Completion"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20 shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6">
                                            <Check className="w-6 h-6" strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{item}</span>
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    </div>

                    {/* Right Visual - UI Mockup */}
                    <div className="flex-1 w-full relative order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Background Decoration Blob */}
                            <div className="absolute -right-20 -top-20 w-[120%] h-[120%] bg-rose-500/5 rounded-[5rem] -z-10 rotate-6 blur-[100px]" />

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: -40, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-3xl px-10 py-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 whitespace-nowrap group"
                            >
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                <span className="font-black text-slate-900 uppercase tracking-[0.3em] text-xs">Curriculum Sync Active</span>
                                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                            </motion.div>

                            {/* Main Interface Card */}
                            <div className="bg-white rounded-[4rem] shadow-sm border border-slate-200 overflow-hidden relative z-20 group">
                                {/* Header */}
                                <div className="p-14 pb-10 text-center border-b border-white/5 bg-slate-950/20">
                                    <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter leading-none">Alignment Terminal</h3>
                                    <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">Initialize Standard Retrieval</p>
                                </div>

                                {/* Inputs */}
                                <div className="p-12 bg-slate-950/30 space-y-10">

                                    {/* Selector Row */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="bg-slate-900 border border-white/5 rounded-[1.5rem] h-16 px-8 flex justify-between items-center group-hover:border-indigo-500/30 transition-all cursor-pointer shadow-inner">
                                            <span className="font-black text-white text-[10px] uppercase tracking-widest">Grade 10</span>
                                            <ChevronDown className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div className="bg-slate-900 border border-white/5 rounded-[1.5rem] h-16 px-8 flex justify-between items-center group-hover:border-indigo-500/30 transition-all cursor-pointer shadow-inner">
                                            <span className="font-black text-white text-[10px] uppercase tracking-widest">Chemistry</span>
                                            <ChevronDown className="w-5 h-5 text-slate-600" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute right-0 -top-1 text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-5 py-2.5 rounded-xl border border-indigo-400/20 cursor-pointer hover:bg-indigo-400 hover:text-white transition-all uppercase tracking-widest shadow-lg">
                                            AI Help
                                        </div>
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8 mt-2 pl-2">
                                            Synthesized Objectives (2)
                                        </div>

                                        {/* Standard Item 1 */}
                                        <div className="bg-slate-900/80 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-6 flex gap-8 relative overflow-hidden group/item hover:border-emerald-500/30 transition-all duration-500">
                                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-white mb-3 tracking-[0.2em] uppercase">SCI.10.CHEM.01</div>
                                                <p className="text-sm text-slate-500 font-bold leading-relaxed uppercase tracking-tighter">
                                                    Chemical Synthesis: Balance multi-stage equations and optimize reactionary outcomes.
                                                </p>
                                            </div>
                                            <div className="shrink-0 pt-1">
                                                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/10">
                                                    <Check className="w-6 h-6" strokeWidth={4} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Standard Item 2 */}
                                        <div className="bg-slate-900/80 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex gap-8 relative overflow-hidden group/item hover:border-emerald-500/30 transition-all duration-500">
                                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-white mb-3 tracking-[0.2em] uppercase">SCI.10.ACID.02</div>
                                                <p className="text-sm text-slate-500 font-bold leading-relaxed uppercase tracking-tighter">
                                                    pH Equilibrium: Calibrate ionic concentrations for industrial-scale everyday synthesis.
                                                </p>
                                            </div>
                                            <div className="shrink-0 pt-1">
                                                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/10">
                                                    <Check className="w-6 h-6" strokeWidth={4} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CurriculumStandards;
