import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, Globe, Sparkles } from "lucide-react";
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
      const res: any = await api.post("/auth/login", { email, password });
      if (res.success && res.data) {
        manualLogin(res.data.user, res.data.token);
      } else {
        setError(res.error || "Authentication failed. Access denied.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Institutional connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans selection:bg-indigo-100">
      {/* LEFT PANEL: Institutional Branding */}
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
                <ShieldCheck className="w-3 h-3" />
                Secure Interface
              </div>
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-[1.1] tracking-tight uppercase">
                Welcome to the <br />
                Instructional <br />
                <span className="text-indigo-400 italic">Terminal</span>.
              </h1>
              <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs">
                Access your personalized workspace, synchronized with institutional 
                standards and high-performance AI tools.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              {[
                { title: "Institutional Mastery", desc: "Aligned evaluation frameworks.", icon: Globe },
                { title: "Unified Registry", desc: "Access all classroom assets instantly.", icon: Sparkles },
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

        <div className="relative z-10 text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">
          Version 2.4.0 • Enterprise Core
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-slate-50 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase mb-2">Initiate Session</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Authorized personnel only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 font-bold text-[11px] uppercase tracking-tight"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

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
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="password">Security Passkey</Label>
                  <Link to="/forgot-password" disable className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">Recover</Link>
                </div>
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
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Node...</>
                ) : (
                  <>Authorize Access</>
                )}
              </Button>
            </form>

            <div className="text-center mt-10 pt-8 border-t border-slate-100">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                Unauthorized?{" "}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors ml-2 font-black border-b border-indigo-600/20 pb-0.5">Request Account</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-[9px] font-medium uppercase tracking-[0.25em]">
              Encrypted Session • SEC-402 Compliant
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
