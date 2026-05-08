import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Brain,
  ClipboardList,
  Users,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Globe,
  Database,
  CheckCircle2,
  Video
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Intelligent Lesson Planning",
    description: "Generate comprehensive, curriculum-aligned lesson plans in seconds with advanced AI.",
    icon: BookOpen,
    color: "indigo",
    image: "/features/intelligent-lesson-planning.png" // AI Generated
  },
  {
    title: "AI Resource Generation",
    description: "Create interactive quizzes, worksheets and teaching aids tailored to your specific topics.",
    icon: Brain,
    color: "amber",
    image: "/features/ai-resource-generation.png" // AI Generated
  },
  {
    title: "Automated Assessments",
    description: "Streamline grading and feedback with AI-powered quiz generation and auto-evaluations.",
    icon: ClipboardList,
    color: "blue",
    image: "/features/automated-assessments.png" // AI Generated
  },
  {
    title: "Collaborative Learning",
    description: "Connect students and teachers in a seamless environment for real-time collaboration.",
    icon: Users,
    color: "emerald",
    image: "/features/collaborative-learning.png" // AI Generated
  },
  {
    title: "Interactive Multimedia",
    description: "Embed videos, interactive diagrams, and smart media to bring lessons to life.",
    icon: Video,
    color: "violet",
    image: "/features/interactive-multimedia.png" // AI Generated
  },
  {
    title: "Data-Driven Insights",
    description: "Visualize student progress and class performance with high-fidelity analytics.",
    icon: BarChart3,
    color: "rose",
    image: "/features/data-driven-insights.png" // AI Generated
  },
  {
    title: "Universal Content Hub",
    description: "Organize and access all your teaching materials in one cloud-based, smart repository.",
    icon: Database,
    color: "sky",
    image: "/features/universal-content-hub.png" // AI Generated
  },
  {
    title: "Curriculum Alignment",
    description: "Ensure every lesson meets international standards with automatic curriculum mapping.",
    icon: CheckCircle2,
    color: "yellow",
    image: "/features/curriculum-alignment.png" // AI Generated
  }
];

const Features = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-slate-200"
          >
            <Brain className="w-4 h-4" />
            AI Architecture
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tight leading-none uppercase"
          >
            Smarter Teaching, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 italic">Core Intelligence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto uppercase tracking-tighter"
          >
            A comprehensive suite of high-performance tools designed to reclaim 10+ hours of your week through automated synthesis.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border border-slate-200 bg-white backdrop-blur-xl hover:bg-slate-50 transition-all duration-500 group rounded-[2rem] overflow-hidden flex flex-col">
                {/* Visual Area */}
                <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover opacity-60 transform transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 to-transparent" />
                </div>

                <div className="p-12 flex-1 flex flex-col">
                  <div className={`w-16 h-16 rounded-[1.5rem] mb-10 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-2xl
                                      ${feature.color === "indigo" ? "bg-indigo-600/20 text-indigo-400 shadow-indigo-600/10" : ""}
                                      ${feature.color === "amber" ? "bg-amber-600/20 text-amber-400 shadow-amber-600/10" : ""}
                                      ${feature.color === "blue" ? "bg-blue-600/20 text-blue-400 shadow-blue-600/10" : ""}
                                      ${feature.color === "emerald" ? "bg-emerald-600/20 text-emerald-400 shadow-emerald-600/10" : ""}
                                      ${feature.color === "violet" ? "bg-violet-600/20 text-violet-400 shadow-violet-600/10" : ""}
                                      ${feature.color === "rose" ? "bg-rose-600/20 text-rose-400 shadow-rose-600/10" : ""}
                                      ${feature.color === "sky" ? "bg-sky-600/20 text-sky-400 shadow-sky-600/10" : ""}
                                      ${feature.color === "yellow" ? "bg-yellow-600/20 text-yellow-400 shadow-yellow-600/10" : ""}
                                  `}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-5 tracking-tight uppercase leading-none">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-10 flex-1 font-bold text-sm uppercase tracking-tighter">{feature.description}</p>
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3 group-hover:gap-5 transition-all group-hover:text-indigo-400">
                    Access Platform <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
