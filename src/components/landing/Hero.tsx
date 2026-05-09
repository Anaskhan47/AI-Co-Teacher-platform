import { Search, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate("/app/dashboard");
  };

  return (
    <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-gradient-to-b from-slate-50 to-indigo-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white text-slate-700 text-[9px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 border border-slate-200 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Education Platform</span>
          </div>

          <h1 className="text-4xl md:text-8xl font-black leading-[0.95] md:leading-[0.9] mb-10 md:mb-12 text-slate-900 tracking-tighter uppercase">
            Plan Less, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-400 to-cyan-400 italic relative inline-block">
              Teach More
            </span>
          </h1>

          <p className="text-lg md:text-2xl mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed text-slate-500 font-bold tracking-tight px-4 md:px-0">
            Instantly generate curriculum-aligned lesson plans, quizzes, and worksheets 
            tailored to your classroom. Join 50,000+ elite educators worldwide.
          </p>

          <div className="flex flex-col items-center gap-12">
            <button
              className="group relative h-24 px-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-2xl uppercase tracking-tighter shadow-[0_20px_80px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all border-none overflow-hidden"
              onClick={handleGenerate}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="w-8 h-8 text-indigo-200 group-hover:rotate-12 transition-transform" />
              Generate Core
              <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </button>

            <div className="flex flex-wrap justify-center gap-4">
              {["Lesson Plans", "Quizzes", "Slides", "Worksheets", "Lab Guides"].map((type) => (
                <div key={type} className="group cursor-default">
                  <span className="bg-white backdrop-blur-xl text-slate-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500/50 transition-all shadow-sm">
                    {type}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                Zero Cost Entry
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                No Expiry
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                CBSE / ICSE Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

