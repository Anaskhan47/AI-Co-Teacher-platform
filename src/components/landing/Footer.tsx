import { Link } from "react-router-dom";
import { GraduationCap, Twitter, Linkedin, Facebook, Instagram, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white pt-40 pb-16 border-t border-slate-200 selection:bg-indigo-100">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-32">
          <div className="col-span-2 space-y-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-all duration-500 ring-1 ring-white/10">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="font-black text-3xl tracking-tighter text-slate-900 uppercase">
                AI Co-Teacher
              </span>
            </Link>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm font-bold uppercase tracking-tighter">
              Empowering the world's most elite educators with high-performance neural synthesis tools for instructional excellence.
            </p>
            <div className="flex gap-5">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-2xl hover:scale-110 hover:rotate-6"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-10 uppercase tracking-[0.3em] text-[10px]">Product Terminal</h4>
            <ul className="space-y-5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
              <li><Link to="/for-teachers" className="hover:text-indigo-400 transition-colors">Core Features</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors">Licensing</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Lesson Planner</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Enterprise Node</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-10 uppercase tracking-[0.3em] text-[10px]">Collective</h4>
            <ul className="space-y-5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Terminal</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Education Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-10 uppercase tracking-[0.3em] text-[10px]">Governance</h4>
            <ul className="space-y-5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Security Audit</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-indigo-500/50" />
            <p className="text-slate-600 font-black text-[9px] uppercase tracking-[0.3em]">© 2024 AI Co-Teacher Collective. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-indigo-400/60 font-black text-[9px] uppercase tracking-[0.4em] italic">Engineered for the 1% of Educators</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
