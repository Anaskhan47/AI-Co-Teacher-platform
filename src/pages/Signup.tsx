import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, AlertCircle, Sparkles, ShieldCheck, Cpu, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/client";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { manualLogin } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res: any = await api.post("/auth/register", { name, email, password, role: "TEACHER" });
      // Interceptor unwraps response.data, so res = { success, data: { token, user }, error }
      if (res.success && res.data) {
        manualLogin(res.data.user, res.data.token);
      } else {
        setError(res.error || "Registration failed. Try a different email.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Registration failed. Try a different email.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden selection:bg-indigo-100">
      {/* Left Side - Strategic Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative p-24 flex-col justify-between overflow-hidden border-r border-white/5">
        {/* Animated Neural Field */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-5 group">
          <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ring-2 ring-white/10">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <span className="font-black text-3xl text-white tracking-tighter uppercase leading-none">AI Co-Teacher</span>
        </Link>

        <div className="relative z-10 space-y-16">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-2xl"
            >
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
              Join the Elite Collective
            </motion.div>
            <h2 className="text-6xl font-black text-white leading-none tracking-tighter uppercase max-w-lg">
              Start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Instructional</span> Evolution.
            </h2>
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px] max-w-sm leading-relaxed">Join 50,000+ high-performance educators transforming the classroom experience with AI.</p>
          </div>

          <div className="space-y-12">
            {[
              { title: "Personalized Support", desc: "AI tailored to your unique instructional style." },
              { title: "Strategic Security", desc: "Built with enterprise-grade data integrity." },
              { title: "Collaborative Power", desc: "Share resources across your entire institution." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="w-12 h-12 rounded-[1.25rem] bg-slate-950/50 border border-white/10 flex items-center justify-center shrink-0 mt-1 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:rotate-12 transition-all duration-500 shadow-2xl group-hover:scale-110">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-white text-xl tracking-tighter uppercase mb-1 leading-none">{item.title}</h4>
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-10 py-8 px-10 bg-slate-950/50 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 max-w-sm shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-12 h-12 rounded-[1.25rem] border-4 border-slate-900 bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white uppercase shadow-2xl">AI</div>
            ))}
          </div>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest leading-relaxed">+2,400 teachers <br /><span className="text-white">joined this cycle</span></p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 md:p-20 lg:p-32 relative overflow-y-auto bg-slate-950 selection:bg-indigo-500/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg space-y-20"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] animate-ping" />
              <div className="h-1 w-24 bg-indigo-600 rounded-full shadow-lg" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Register</h1>
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Join the world's most intelligent teaching collective.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-12">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-rose-600/10 border border-rose-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shadow-lg border border-rose-500/20">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                  </div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2" htmlFor="name">Full Identity</Label>
              <div className="relative group">
                <User className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-indigo-500 transition-all duration-500 pointer-events-none" />
                <Input
                  id="name"
                  placeholder="Prof. Jane Doe"
                  className="h-20 pl-20 rounded-[2rem] bg-white/5 border-white/10 text-white font-black text-xs focus-visible:ring-indigo-500/50 transition-all shadow-inner border-none focus:bg-slate-900 placeholder:text-slate-800 uppercase tracking-widest"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2" htmlFor="email">Work Identifier</Label>
              <div className="relative group">
                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-indigo-500 transition-all duration-500 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@school.network"
                  className="h-20 pl-20 rounded-[2rem] bg-white/5 border-white/10 text-white font-black text-xs focus-visible:ring-indigo-500/50 transition-all shadow-inner border-none focus:bg-slate-900 placeholder:text-slate-800 uppercase tracking-widest"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2" htmlFor="password">Security Passkey</Label>
              <div className="relative group">
                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-indigo-500 transition-all duration-500 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 12 Characters"
                  className="h-20 pl-20 pr-20 rounded-[2rem] bg-white/5 border-white/10 text-white font-black text-xs focus-visible:ring-indigo-500/50 transition-all shadow-inner border-none focus:bg-slate-900 placeholder:text-slate-800 uppercase tracking-[0.5em]"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-all duration-300"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-24 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_80px_rgba(79,70,229,0.4)] border-none transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-5 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="w-8 h-8 animate-spin" /> Provisioning Node...</>
              ) : (
                <><ShieldCheck className="w-8 h-8 group-hover:scale-110 transition-transform" /> Initialize Account</>
              )}
            </Button>
          </form>

          <div className="text-center pt-20 border-t border-white/5">
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">
              Active Terminal Detected?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-4 border-b border-indigo-400/20 pb-1">Initiate Session</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
