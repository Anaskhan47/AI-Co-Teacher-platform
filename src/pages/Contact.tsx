import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send, MapPin, Phone, Loader2, CheckCircle2, Sparkles, Cpu, Satellite } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate send
        await new Promise(r => setTimeout(r, 1500));
        setSending(false);
        setSent(true);
        setName(""); setEmail(""); setMessage("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 overflow-x-hidden">
            <Navbar />

            <main className="flex-grow pt-48 pb-40 px-10 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="text-center mb-32 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-white/10 backdrop-blur-3xl shadow-lg"
                        >
                            <Satellite className="w-4 h-4 text-indigo-400" />
                            <span>Communication Uplink</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase"
                        >
                            Establish <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">School Connection.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-black uppercase tracking-tighter"
                        >
                            Encountering anomalies or seeking to scale your instructional collective? 
                            Our tactical support unit is available for immediate synthesis.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-24 items-start">
                        {/* Contact Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 transition-all duration-1000 group-hover:scale-150" />
                            
                            {sent ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center gap-10 relative z-10">
                                    <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/10 animate-bounce">
                                        <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Transmission Received</h3>
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Your signal has been integrated into our priority queue.</p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSent(false)} 
                                        className="h-16 px-10 text-white hover:bg-white/5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] border border-white/5"
                                    >
                                        Re-Initialize Transmission
                                    </Button>
                                </div>
                            ) : (
                             <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label htmlFor="name" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Node Name</label>
                                        <Input id="name" placeholder="Enter identification" required
                                            className="h-16 bg-slate-950/50 border-white/5 rounded-2xl focus:border-indigo-500/50 focus:bg-slate-950 transition-all text-white font-bold uppercase tracking-widest text-xs px-8 shadow-inner"
                                            value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-4">
                                        <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Transmission Address</label>
                                        <Input id="email" type="email" placeholder="you@collective.com" required
                                            className="h-16 bg-slate-950/50 border-white/5 rounded-2xl focus:border-indigo-500/50 focus:bg-slate-950 transition-all text-white font-bold uppercase tracking-widest text-xs px-8 shadow-inner"
                                            value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label htmlFor="message" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Payload Details</label>
                                    <Textarea id="message" placeholder="Initialize data stream..." required
                                        className="min-h-[220px] bg-slate-950/50 border-white/5 rounded-[2rem] focus:border-indigo-500/50 focus:bg-slate-950 transition-all resize-none text-white font-bold uppercase tracking-widest text-xs p-8 shadow-inner"
                                        value={message} onChange={e => setMessage(e.target.value)} />
                                </div>
                                <Button type="submit" disabled={sending}
                                    className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-2xl transition-all shadow-[0_20px_80px_rgba(79,70,229,0.4)] flex items-center justify-center gap-4 border-none uppercase tracking-[0.4em] hover:scale-[1.05] active:scale-[0.95] group">
                                    {sending ? <><Loader2 className="w-6 h-6 animate-spin" />Syncing...</> : <><Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />Launch Signal</>}
                                </Button>
                            </form>
                            )}
                        </motion.div>

                        {/* Support Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="space-y-16 lg:pl-12 pt-10"
                        >
                            <div className="space-y-12">
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Tactical Support <br />for the <span className="text-indigo-400 italic">1% of Educators</span></h3>
                                
                                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-12">
                                    {[
                                        { icon: Mail, color: "indigo", title: "Email Uplink", value: "support@co-teacher.com", sub: "Priority retrieval within 24h cycle." },
                                        { icon: MessageSquare, color: "blue", title: "Support Chat", value: "Direct Dashboard Link", sub: "Operational 09:00 - 18:00 EST." },
                                        { icon: Phone, color: "purple", title: "Voice Encryption", value: "+1 (555) 123-4567", sub: "Global synthesis support 24/7." },
                                        { icon: MapPin, color: "emerald", title: "Office Location", value: "Innovation Hub, Sector 7", sub: "123 Learning Way, Alpha-Alpha." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-8 group">
                                            <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-${item.color}-500/10 ring-4 ring-${item.color}-500/5`}>
                                                <item.icon className={`w-7 h-7 text-${item.color}-400`} />
                                            </div>
                                            <div>
                                                <p className="font-black text-white uppercase tracking-[0.3em] text-[10px] mb-3">{item.title}</p>
                                                <p className="text-xl text-slate-300 font-black tracking-tighter uppercase leading-none mb-2">{item.value}</p>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
