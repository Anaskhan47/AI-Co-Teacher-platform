import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Ghost, Satellite, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Page not found at:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-10 overflow-hidden relative selection:bg-indigo-100">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="mb-16 inline-flex items-center justify-center w-40 h-40 rounded-[3rem] bg-slate-900/50 border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] group"
        >
            <Satellite className="w-20 h-20 text-indigo-400 animate-pulse group-hover:scale-110 transition-transform duration-700" />
        </motion.div>
        
        <div className="relative">
            <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-[180px] font-black text-white leading-none tracking-tighter opacity-10 absolute left-1/2 -translate-x-1/2 -top-24 select-none"
            >
                404
            </motion.h1>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 text-5xl font-black text-white uppercase tracking-tighter leading-none relative z-10"
            >
                Uplink <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Terminated.</span>
            </motion.h2>
            
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] leading-relaxed max-w-sm mx-auto"
            >
                The requested page was not found. Please return to the dashboard or home page.
            </motion.p>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Link 
                to="/" 
                className="inline-flex items-center gap-5 px-14 py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-500 shadow-[0_20px_80px_rgba(79,70,229,0.4)] hover:scale-[1.05] active:scale-[0.95] group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-3 transition-transform" />
                Return to Mission Control
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
