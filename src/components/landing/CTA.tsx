import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Main CTA Card */}
          <div className="relative bg-white rounded-[3.5rem] p-12 md:p-20 text-center overflow-hidden shadow-sm border border-slate-200 group">
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-indigo-100 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start for Free Today</span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tight leading-none uppercase">
                Ready to Transform <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-violet-500 italic">Your Teaching?</span>
              </h2>

              <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-bold uppercase tracking-tighter">
                Join thousands of elite educators who are saving time and improving student outcomes with AI Co-Teacher synthesis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Button
                  className="h-24 px-16 bg-white text-indigo-600 hover:bg-slate-100 shadow-[0_20px_80px_rgba(255,255,255,0.2)] rounded-[2rem] text-lg font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group/btn"
                  asChild
                >
                  <Link to="/app/dashboard">
                    Enter Dashboard
                    <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover/btn:translate-x-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

