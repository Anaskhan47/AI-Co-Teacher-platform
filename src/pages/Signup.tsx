import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, AlertCircle, ShieldCheck, CheckCircle2, Globe, Sparkles } from "lucide-react";
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
      if (res.success && res.data) {
        manualLogin(res.data.user, res.data.token);
      } else {
        setError(res.error || "Provisioning failed. Please verify credentials.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Institutional connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans selection:bg-indigo-100">
      {/* LEFT PANEL: Institutional Value Proposition */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-slate-900 relative p-12 flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group mb-20">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight uppercase">AI Co-Teacher</span>
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Institutional OS
              </div>
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-[1.1] tracking-tight uppercase">
                The Operating <br />
                System for <br />
                <span className="text-indigo-400 italic">Modern</span> Education.
              </h1>
              <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs">
                A unified platform for high-performance instructional design, 
                automated assessment, and curriculum synchronization.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              {[
                { title: "Curriculum Sync", desc: "Aligned with global academic frameworks.", icon: Globe },
                { title: "Privacy First", desc: "Enterprise-grade institutional security.", icon: ShieldCheck },
                { title: "AI Orchestration", desc: "Synthesized lesson plans in seconds.", icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm tracking-tight uppercase leading-none mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-[10px] font-medium leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 py-6 px-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white uppercase">AI</div>
            ))}
          </div>
          <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider leading-tight">
            Trusted by <br /><span className="text-white">50,000+ Educators</span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Protocol */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-slate-50 relative overflow-y-auto">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase mb-2">Account Provisioning</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Initialize your institutional profile</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 font-bold text-[11px] uppercase tracking-tight"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {String(error)}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="name">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                  <Input
                    id="name"
                    placeholder="Prof. Alexander Sterling"
                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium text-sm placeholder:text-slate-400"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="email">Work Identifier</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="sterling@institution.edu"
                    className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium text-sm placeholder:text-slate-400"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="password">Security Passkey</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-12 pl-12 pr-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium text-sm tracking-widest placeholder:tracking-normal placeholder:text-slate-400"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/10 border-none transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Deploying Node...</>
                ) : (
                  <>Create Institutional Account</>
                )}
              </Button>
            </form>

            <div className="text-center mt-10 pt-8 border-t border-slate-100">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                Existing Credentials?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors ml-2 font-black border-b border-indigo-600/20 pb-0.5">Sign In</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-[9px] font-medium uppercase tracking-[0.25em]">
              Security Compliance • Institutional Policy v1.0.4
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
