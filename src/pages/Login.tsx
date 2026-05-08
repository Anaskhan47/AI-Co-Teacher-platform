import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { manualLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      manualLogin(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Credentials verification failed. Please check your institutional ID.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-10 selection:bg-indigo-100 font-sans">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/50">
        
        {/* Left Panel: Value Prop Architecture */}
        <div className="hidden lg:flex flex-col justify-between p-20 bg-slate-50/50 border-r border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-12 transition-transform group-hover:scale-110 duration-500">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] mb-8">
              Pioneering <br />
              <span className="text-indigo-600 italic">Academic</span> <br />
              Sovereignty.
            </h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-xs italic opacity-70">
              Institutional Nexus: The Unified Operating System for High-Performance Education.
            </p>
          </div>

          <div className="space-y-8 relative z-10">
            {[
                { title: "Autonomous Synthesis", desc: "AI-driven curriculum architecture" },
                { title: "Institutional Mastery", desc: "Aligned evaluation frameworks" },
                { title: "Operational Intelligence", desc: "Real-time pedagogical analytics" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 animate-in slide-in-from-left duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    v1.0.4 • Standard Edition
                </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Auth Protocol Form */}
        <div className="p-12 md:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-12">
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Authentication</h2>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] italic">Enter Institutional Credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-start gap-4 text-rose-600 text-[11px] font-black leading-relaxed uppercase tracking-tight shadow-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 group">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-indigo-600" htmlFor="email">Email Access Key</Label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-all" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="id@institution.edu"
                    className="h-14 pl-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all font-bold text-xs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-indigo-600" htmlFor="password">Security Protocol</Label>
                  <a href="#" className="text-[9px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors">Recovery?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-all" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-14 pl-14 pr-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all font-bold text-xs tracking-widest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden" 
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...</>
                ) : (
                  <>Access Institutional Nexus</>
                )}
              </Button>
            </form>

            <div className="text-center pt-10 border-t border-slate-100">
              <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em]">
                New to the network?{" "}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors ml-1 border-b border-indigo-600/30">Request Access</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
