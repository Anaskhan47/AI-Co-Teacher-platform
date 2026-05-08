import { useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2, Presentation, GraduationCap, Clock, Sparkles, Brain, ArrowRight, Monitor, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const ForTeachers = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-10 relative z-10 text-center">
                    <div className="max-w-5xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-lg"
                        >
                            <Cpu className="w-4 h-4 text-indigo-400" />
                            Next-Gen Instructional Terminal
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-12 leading-none uppercase"
                        >
                            Calibrate standards <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 italic">Optimize Load.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-500 mb-16 max-w-4xl mx-auto leading-relaxed font-black uppercase tracking-tighter"
                        >
                            Empower every instructional node to synthesize curriculum-aligned, high-fidelity 
                            lessons and assessments in milliseconds. Total architectural control.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-8"
                        >
                            <Button className="h-20 px-12 text-[10px] font-black bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] shadow-2xl shadow-indigo-600/40 transition-all hover:scale-[1.05] active:scale-[0.95] border-none uppercase tracking-[0.3em] group">
                                Start Free Trial
                                <Sparkles className="w-4 h-4 ml-3 group-hover:rotate-12 transition-transform" />
                            </Button>
                            <Button variant="outline" className="h-20 px-10 text-[10px] font-black border-white/10 bg-white/5 text-white rounded-[1.5rem] hover:bg-white/10 gap-4 transition-all uppercase tracking-[0.3em] backdrop-blur-3xl group">
                                <PlayCircle className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                                Watch Demo
                            </Button>
                        </motion.div>
                    </div>

                    {/* Dashboard Preview / Video */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                        className="mt-48 relative max-w-7xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-indigo-600 blur-[200px] opacity-10 -z-10 rounded-full" />
                        <div className="aspect-video bg-slate-900 rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.7)] overflow-hidden border border-white/10 relative group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <div className="w-40 h-40 bg-slate-950/40 backdrop-blur-3xl rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:shadow-[0_0_100px_rgba(79,70,229,0.5)] border border-white/20">
                                    <PlayCircle className="w-20 h-20 text-white fill-current" />
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1544533382-7c9b878021d0?q=80&w=2070&auto=format&fit=crop"
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover opacity-20 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-40"
                            />
                            <div className="absolute bottom-16 left-16 text-left z-20">
                                <div className="inline-flex px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl mb-6 shadow-2xl ring-4 ring-indigo-600/10">
                                    Product Synthesis
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter max-w-2xl leading-none uppercase">
                                    Automate lesson <br />planning in milliseconds
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Metrics Section */}
            <div className="bg-slate-950 border-y border-white/5 py-40 relative overflow-hidden">
                <div className="container mx-auto px-10 relative z-10">
                    <div className="grid md:grid-cols-3 gap-24">
                        {[
                            { icon: Clock, title: "Save 10+ Hours/Week", desc: "Automate repetitive nodes like grading, planning, and asset synthesis." },
                            { icon: Presentation, title: "AI PPT Maker", desc: "Generate high-fidelity, curriculum-aligned slide decks in milliseconds." },
                            { icon: GraduationCap, title: "Optimized Outcomes", desc: "Focus on delivery while our engine ensures standards integrity." }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-8 group">
                                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center backdrop-blur-3xl border border-white/10 group-hover:border-indigo-500/50 transition-all duration-500 group-hover:-translate-y-4 shadow-2xl group-hover:rotate-6">
                                    <stat.icon className="w-12 h-12 text-indigo-400" />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{stat.title}</h3>
                                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] leading-relaxed">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Highlight: PPT Maker */}
            <section className="py-56 relative">
                <div className="container mx-auto px-10">
                    <div className="flex flex-col lg:flex-row items-center gap-40">
                        <div className="lg:w-1/2 space-y-16">
                             <div>
                                <div className="inline-flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-10 bg-indigo-500/10 px-5 py-2.5 rounded-full border border-indigo-500/20 shadow-lg">
                                    <Brain className="w-4 h-4 text-indigo-400" /> AI Spotlight
                                </div>
                                <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-none uppercase">AI <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Lesson Maker</span></h2>
                                <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-16 font-black uppercase tracking-tighter">
                                    Stop wrestling with legacy formatting. Just enter your topic, standard, and grade level. 
                                    Our engine generates professional, high-fidelity slide decks in milliseconds.
                                </p>
                                <div className="space-y-10">
                                    {[
                                        "Alignment with CBSE, ICSE, and Global curriculums",
                                        "Automatic asset retrieval and layout synthesis",
                                        "Export to PowerPoint or PDF instantly",
                                        "Real-time node collaboration with colleagues"
                                    ].map((item, i) => (
                                         <div key={i} className="flex items-center gap-8 group">
                                             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-2xl group-hover:rotate-12 group-hover:scale-110">
                                                 <CheckCircle2 className="w-6 h-6" />
                                             </div>
                                             <span className="font-black text-slate-400 uppercase tracking-[0.2em] text-[10px]">{item}</span>
                                         </div>
                                    ))}
                                </div>
                                 <div className="pt-16">
                                     <Button className="h-20 px-12 bg-white text-slate-950 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-[0_20px_80px_rgba(255,255,255,0.2)] group">
                                         Initialize PPT Maker <ArrowRight className="w-5 h-5 ml-4 transition-all group-hover:translate-x-3" />
                                     </Button>
                                 </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="relative">
                                 <div className="absolute inset-0 bg-indigo-600/10 blur-[150px] -z-10 rounded-full scale-125" />
                                 <div className="bg-slate-900 rounded-[4rem] shadow-[0_0_120px_rgba(0,0,0,0.7)] p-10 border border-white/10 rotate-3 hover:rotate-0 transition-all duration-1000 group relative z-10">
                                     <div className="aspect-[4/3] bg-slate-950 rounded-[3rem] overflow-hidden border border-white/10 flex flex-col shadow-inner relative">
                                        {/* Browser-like Toolbar */}
                                        <div className="h-20 bg-slate-900 border-b border-white/5 flex items-center px-10 gap-5">
                                            <div className="flex gap-3">
                                                <div className="w-4 h-4 rounded-full bg-rose-500/40"></div>
                                                <div className="w-4 h-4 rounded-full bg-amber-500/40"></div>
                                                <div className="w-4 h-4 rounded-full bg-emerald-500/40"></div>
                                            </div>
                                            <div className="h-3 w-48 bg-white/5 rounded-full ml-8" />
                                            <div className="ml-auto flex items-center gap-5">
                                                <div className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl ring-4 ring-indigo-600/10">
                                                    <Sparkles className="w-4 h-4" /> Synthesis Active
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex overflow-hidden">
                                            {/* Slides Sidebar */}
                                            <div className="w-40 bg-slate-900/50 border-r border-white/5 p-8 flex flex-col gap-8">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className={`aspect-video rounded-2xl border transition-all duration-700 ${i === 1 ? 'bg-indigo-600/20 border-indigo-500 shadow-2xl scale-105' : 'bg-white/5 border-white/5 opacity-20 hover:opacity-40'}`}>
                                                        <div className="p-4 space-y-3">
                                                            <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                                                            <div className="h-1 w-full bg-white/10 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Main Canvas */}
                                            <div className="flex-1 bg-slate-950 p-12 flex items-center justify-center relative">
                                                <div className="w-full aspect-video bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[3rem] p-12 relative overflow-hidden border border-white/10">
                                                    <div className="mb-10">
                                                        <div className="h-10 w-3/5 bg-white/10 rounded-xl mb-5 shadow-inner"></div>
                                                        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-transparent rounded-full opacity-50"></div>
                                                    </div>
                                                    <div className="flex gap-10">
                                                        <div className="w-1/2 space-y-6 pt-3">
                                                            <div className="h-3 w-full bg-white/5 rounded-full"></div>
                                                            <div className="h-3 w-11/12 bg-white/5 rounded-full"></div>
                                                            <div className="h-3 w-4/5 bg-white/5 rounded-full"></div>
                                                        </div>
                                                        <div className="w-1/2 h-40 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center border border-indigo-500/20 relative group/icon overflow-hidden shadow-inner">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                                                            <Sparkles className="w-16 h-16 text-indigo-500 opacity-40 group-hover/icon:scale-125 group-hover/icon:rotate-12 transition-all duration-1000" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     {/* Tooltip Overlay */}
                                     <div className="absolute -bottom-10 -right-10 bg-slate-950/95 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 flex items-center gap-6 group-hover:translate-y-[-20px] transition-all duration-1000">
                                         <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 ring-4 ring-indigo-600/10">
                                             <Sparkles className="w-8 h-8 text-white" />
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Generation Status</p>
                                             <p className="font-black text-white text-2xl tracking-tighter uppercase leading-none">Synthesis Ready</p>
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-64 bg-slate-950 text-center relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 bg-indigo-600/10 blur-[200px] pointer-events-none" />
                <div className="container mx-auto px-10 relative z-10">
                    <h2 className="text-6xl md:text-9xl font-black text-white mb-16 tracking-tighter leading-none uppercase">Ready to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Synchronize?</span></h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-10">
                        <Button className="h-24 px-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl uppercase tracking-[0.3em] shadow-[0_20px_80px_rgba(79,70,229,0.4)] border-none transition-all hover:scale-[1.05] active:scale-[0.95] group">
                            Start Free Trial
                            <Sparkles className="w-5 h-5 ml-4 group-hover:rotate-12 transition-transform" />
                        </Button>
                    </div>
                    <p className="mt-16 text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Zero Latency Onboarding • Cancel Instantly</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ForTeachers;
