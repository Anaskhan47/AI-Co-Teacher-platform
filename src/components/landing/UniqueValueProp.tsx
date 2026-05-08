import { motion } from "framer-motion";
import { Sparkles, Sliders, CheckCircle2, Brain } from "lucide-react";

const UniqueValueProp = () => {
    return (
        <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-teal-100">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-teal-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-40">

                    {/* Left Visual - Layered App Interface */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Decorative Blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gradient-to-tr from-indigo-500/10 to-teal-500/10 rounded-full blur-[120px] -z-10" />

                            {/* Main Interface Window */}
                            <div className="bg-white rounded-[4rem] shadow-sm border border-slate-200 overflow-hidden relative z-10 group">
                                {/* Window Header */}
                                <div className="h-14 border-b border-slate-200 bg-slate-50 flex items-center px-10 gap-3">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    <div className="ml-auto flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">AI Sync</span>
                                    </div>
                                </div>

                                {/* Window Body */}
                                <div className="p-12 bg-slate-900/50">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h3 className="font-black text-slate-900 text-2xl tracking-tighter uppercase leading-none mb-2">Cell Biology: Osmosis</h3>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Science Lesson • Grade 9</span>
                                        </div>
                                        <div className="bg-emerald-500/10 text-emerald-400 text-[9px] px-5 py-2 rounded-xl font-black border border-emerald-500/20 uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10">Production Ready</div>
                                    </div>

                                    {/* Mock Content */}
                                    <div className="space-y-8">
                                        <div className="bg-slate-950/80 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex gap-8 group/card transition-all hover:bg-slate-950 hover:border-indigo-500/30">
                                            <div className="w-32 h-32 bg-slate-900 rounded-[1.5rem] overflow-hidden shrink-0 border border-white/5 transition-all duration-700 group-hover/card:scale-105 shadow-inner">
                                                <img src="/osmosis_diffusion_worksheet_card_1769609373988.png" alt="Osmosis" className="w-full h-full object-cover opacity-40 group-hover/card:opacity-80 transition-opacity" />
                                            </div>
                                            <div className="flex-1 pt-3">
                                                <div className="h-4 bg-white/10 rounded-full w-3/4 mb-5 shadow-inner" />
                                                <div className="h-2 bg-white/5 rounded-full w-full mb-3" />
                                                <div className="h-2 bg-white/5 rounded-full w-2/3" />
                                            </div>
                                        </div>

                                        <div className="bg-indigo-600/10 p-10 rounded-[3rem] border border-indigo-500/20 relative overflow-hidden group/tip">
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover/tip:scale-150" />
                                            <h4 className="text-[10px] font-black text-indigo-400 mb-5 flex items-center gap-4 uppercase tracking-[0.3em]">
                                                <Brain className="w-5 h-5 text-indigo-400/50" /> Strategic Plan
                                            </h4>
                                            <p className="text-slate-400 leading-relaxed font-bold text-sm uppercase tracking-tighter">
                                                Synthesize this diagram to explain semi-permeable membranes.
                                                Encourage students to identify the water flux across the concentration gradient during the simulation phase.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating "Settings" Card */}
                            <motion.div
                                className="absolute -right-8 md:-right-20 top-24 bg-slate-950/90 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 z-20 w-72"
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <div className="space-y-8">
                                    <div>
                                        <div className="text-[9px] text-slate-500 font-black mb-4 uppercase tracking-[0.3em]">Complexity Spectrum</div>
                                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                            <div className="h-full w-[75%] bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] rounded-full transition-all duration-1000" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-500 font-black mb-4 uppercase tracking-[0.3em]">Linguistic Interface</div>
                                        <div className="flex items-center justify-between text-[10px] font-black text-white bg-white/5 border border-white/10 px-5 py-4 rounded-2xl uppercase tracking-widest shadow-xl">
                                            Standard English
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm">
                                <Sparkles className="w-4 h-4 text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                                Strategic Customization
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 leading-none tracking-tighter uppercase">
                                Adapt to your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500 italic">
                                    AI Classroom
                                </span>
                            </h2>
                            <p className="text-xl text-slate-500 mb-16 leading-relaxed font-bold uppercase tracking-tighter">
                                Every educational ecosystem is unique. Our synthesis engine allows you to recalibrate complexity, 
                                switch linguistic interfaces, and adapt protocols to fit local standards in milliseconds.
                            </p>

                            <div className="flex flex-col gap-10">
                                <div className="flex items-center gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                                        <Sliders className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-1">Dynamic Complexity</h4>
                                        <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Instant transition from entry to mastery levels.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-1">Standard Alignment</h4>
                                        <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Verified mapping to Global and Regional Curriculum standards.</p>
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

export default UniqueValueProp;
