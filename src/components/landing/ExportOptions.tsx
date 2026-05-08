import { motion } from "framer-motion";
import { FileText, Presentation, FileJson, Sparkles, Download, Monitor, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExportOptions = () => {
    return (
        <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-indigo-100">
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-40">
                    {/* Left Content */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg">
                                <Share2 className="w-4 h-4 text-indigo-400" />
                                Multi-Channel Distribution
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 leading-none tracking-tighter uppercase">
                                Present and <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Deploy Instantly</span>
                            </h2>
                            <p className="text-xl text-slate-500 mb-16 leading-relaxed font-bold uppercase tracking-tighter">
                                Our platform integrates with your existing technological ecosystem. 
                                Execute your curriculum directly or export to high-fidelity PowerPoint, 
                                Google Slides, or PDF assets with a single neural trigger.
                            </p>
                            <Button className="h-20 px-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/40 border-none group">
                                Initialize Core Free
                                <Sparkles className="w-4 h-4 ml-3 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Visuals */}
                    <div className="lg:w-1/2 relative min-h-[600px] flex items-center justify-center">
                        {/* Cards Container - Colorful Slides */}
                        <div className="relative w-full max-w-2xl mx-auto h-[400px] flex items-center justify-center perspective-2000">

                            {/* Slide 1: Content (Red/Orange) */}
                            <motion.div
                                initial={{ x: -150, y: 60, opacity: 0, rotateY: 20 }}
                                whileInView={{ x: -120, y: 30, opacity: 1, rotateY: 10 }}
                                animate={{ y: [30, 20, 30] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-56 bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-sm overflow-hidden border border-slate-200 transform -ml-40"
                            >
                                <div className="h-full w-full bg-gradient-to-br from-orange-500/5 to-rose-500/5 p-8 flex flex-col gap-5">
                                    <div className="h-10 w-3/4 bg-orange-600/20 rounded-xl shadow-inner" />
                                    <div className="space-y-4">
                                        <div className="h-2 w-full bg-white/5 rounded-full" />
                                        <div className="h-2 w-5/6 bg-white/5 rounded-full" />
                                        <div className="h-2 w-4/6 bg-white/5 rounded-full" />
                                    </div>
                                    <div className="mt-auto flex gap-4">
                                        <div className="h-14 w-1/2 bg-orange-500/10 rounded-2xl border border-orange-500/10" />
                                        <div className="h-14 w-1/2 bg-rose-500/10 rounded-2xl border border-rose-500/10" />
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-sm shadow-2xl shadow-orange-600/30 ring-4 ring-orange-600/10 uppercase tracking-tighter">PPTX</div>
                                </div>
                            </motion.div>

                            {/* Slide 2: Data (Blue/Teal) */}
                            <motion.div
                                initial={{ x: 150, y: 60, opacity: 0, rotateY: -20 }}
                                whileInView={{ x: 120, y: 30, opacity: 1, rotateY: -10 }}
                                animate={{ y: [30, 40, 30] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-56 bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-sm overflow-hidden border border-slate-200 transform ml-40 z-10"
                            >
                                <div className="h-full w-full bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-8 flex flex-col gap-5">
                                    <div className="h-10 w-1/2 bg-cyan-600/20 rounded-xl shadow-inner" />
                                    <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-2">
                                        <div className="w-10 bg-blue-600/20 rounded-xl h-[40%] border border-blue-500/10" />
                                        <div className="w-10 bg-blue-600/40 rounded-xl h-[75%] border border-blue-500/10" />
                                        <div className="w-10 bg-blue-600/30 rounded-xl h-[55%] border border-blue-500/10" />
                                        <div className="w-10 bg-blue-600/60 rounded-xl h-[90%] border border-blue-500/10" />
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-4 ring-blue-600/10">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Slide 3: Title (Gold/Yellow) - Front Center */}
                            <motion.div
                                initial={{ y: -80, opacity: 0, scale: 0.9 }}
                                whileInView={{ y: "-50%", opacity: 1, scale: 1 }}
                                animate={{ y: ["-50%", "calc(-50% - 20px)", "-50%"] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-64 bg-white/95 backdrop-blur-3xl rounded-[4rem] shadow-sm border border-slate-200 z-20"
                            >
                                <div className="h-full w-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-10 flex flex-col items-center justify-center text-center gap-8">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-amber-500/20 flex items-center justify-center mb-2 border border-amber-500/20 shadow-2xl shadow-amber-500/10 ring-4 ring-amber-500/5">
                                        <Presentation className="w-12 h-12 text-amber-400" />
                                    </div>
                                    <div className="w-full">
                                        <div className="h-6 w-56 bg-amber-600/20 rounded-full mb-4 mx-auto shadow-inner" />
                                        <div className="h-3 w-40 bg-white/5 rounded-full mx-auto" />
                                    </div>
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
                                    <div className="flex gap-4">
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-orange-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExportOptions;
