import { motion } from "framer-motion";
import { UploadCloud, FileText, Link, Check, FileUp, Loader2, Sparkles, Database } from "lucide-react";

const ResourceImport = () => {
    return (
        <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-emerald-100">
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/4 w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-40">

                    {/* Left Visual - Upload Interface */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Background Decoration - Emerald Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

                            {/* Main Container - Dark Glassmorphism */}
                            <div className="bg-emerald-50 backdrop-blur-3xl rounded-[4rem] border border-emerald-200 shadow-sm p-12 pb-44 relative overflow-hidden group">
                                
                                {/* Top Icons Row - Dark Cards with Emerald Icons */}
                                <div className="grid grid-cols-3 gap-8 mb-12">
                                    {[FileUp, UploadCloud, Link].map((Icon, i) => (
                                        <div key={i} className="bg-white rounded-[2rem] h-32 flex items-center justify-center cursor-pointer border border-slate-200 shadow-sm hover:bg-slate-50 transition-all group/icon hover:scale-105 active:scale-95">
                                            <Icon className="w-12 h-12 text-emerald-400 group-hover/icon:scale-110 group-hover/icon:rotate-6 transition-all duration-500" />
                                        </div>
                                    ))}
                                </div>

                                {/* Main File Info Card */}
                                <div className="bg-white backdrop-blur-2xl rounded-[3rem] border border-slate-200 p-10 pb-32 relative z-10 shadow-sm">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-black text-2xl text-slate-900 truncate tracking-tighter uppercase leading-none mb-1">
                                                Chapter 4: Photosynthesis.pdf
                                            </h4>
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Payload Detected</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                                <Check className="w-5 h-5 text-emerald-400" strokeWidth={4} />
                                            </div>
                                            <span>Tokens extracted: <span className="text-slate-900 ml-2">1,450 units</span></span>
                                        </div>
                                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                                <Check className="w-5 h-5 text-emerald-400" strokeWidth={4} />
                                            </div>
                                            <span>Visual identified: <span className="text-slate-900 ml-2">12 assets</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Floating "Uploading" Card */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="absolute bottom-12 left-8 right-8 bg-white/95 backdrop-blur-3xl rounded-[3rem] border border-slate-200 shadow-sm p-10 z-20"
                                >
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                            <h3 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px]">Processing Node...</h3>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">75% Sync</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                                        <motion.div
                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                                            initial={{ width: "10%" }}
                                            whileInView={{ width: "75%" }}
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                        />
                                    </div>
                                    <p className="mt-5 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Converting to neural interface...</p>
                                </motion.div>

                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg">
                                <Database className="w-4 h-4 text-emerald-400" />
                                Resource Ingestion
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 leading-none tracking-tighter uppercase">
                                Synthesize from <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500 italic">
                                    Local Data
                                </span>
                            </h2>
                            <p className="text-xl text-slate-500 mb-16 leading-relaxed font-bold uppercase tracking-tighter">
                                Already possess core materials? Our engine optimizes them instantly.
                                Ingest PDFs, source documents, or paste network links to generate high-fidelity 
                                instructional assets in milliseconds.
                            </p>

                            <ul className="space-y-10">
                                {[
                                    { icon: FileUp, title: "Asset Ingestion", desc: "Supports PDF, DOCX, and PPTX high-performance formats." },
                                    { icon: Link, title: "Network Uplink", desc: "Extract key primitives from web articles and video streams." },
                                    { icon: Sparkles, title: "AI Extraction", desc: "Automated synthesis of definitions, timelines, and logic nodes." }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-8 group">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mt-1 shrink-0 transition-all duration-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 shadow-2xl group-hover:scale-110">
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-1">{item.title}</h4>
                                            <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResourceImport;
