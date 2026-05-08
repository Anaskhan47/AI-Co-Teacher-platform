import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

const boards = [
  {
    name: "CBSE",
    fullName: "Central Board Registry",
    classes: "Classes 1–12",
    features: ["NCERT Aligned", "Chapter-wise Smart Maps", "Optimized Sample Assets"],
    color: "indigo"
  },
  {
    name: "ICSE",
    fullName: "Indian Certificate Authority",
    classes: "Classes 1–12",
    features: ["CISCE Standard Verified", "Comprehensive Lexicon", "Advanced Test Synthesis"],
    color: "violet"
  },
  {
    name: "SSC",
    fullName: "Regional State Collective",
    classes: "Classes 1–12",
    features: ["State Alignment Active", "Linguistic Interface Support", "Local Node Extraction"],
    color: "emerald"
  },
];

const Boards = () => {
  return (
    <section className="py-40 bg-slate-50 overflow-hidden relative selection:bg-indigo-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Curriculum Standards
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tighter uppercase leading-none"
          >
            Aligned with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 italic">Major Frameworks</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-bold uppercase tracking-tighter max-w-2xl mx-auto"
          >
            Assets and assessments tailored to your specific institutional requirements and regional standards.
          </motion.p>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {boards.map((board, index) => (
            <motion.div
              key={board.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-indigo-600/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[40px]" />
              <div className="relative bg-white rounded-[3.5rem] p-12 border border-slate-200 group-hover:border-indigo-300 transition-all duration-500 shadow-sm h-full flex flex-col">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] mx-auto mb-8 flex items-center justify-center border border-indigo-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                    <Sparkles className={`w-10 h-10 ${board.color === 'emerald' ? 'text-emerald-400' : 'text-indigo-400'}`} />
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter uppercase leading-none">
                    {board.name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">{board.fullName}</p>
                  <div className="inline-flex px-6 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                    {board.classes}
                  </div>
                </div>
                <ul className="space-y-6 mt-auto">
                  {board.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-5 group/item">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-lg">
                        <Check className="w-5 h-5 text-emerald-400" strokeWidth={4} />
                      </div>
                      <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest group-hover/item:text-indigo-700 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Boards;
