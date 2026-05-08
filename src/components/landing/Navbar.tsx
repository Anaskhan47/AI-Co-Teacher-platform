import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const navLinks = [
    { name: "Frameworks", href: "/for-teachers" },
    { name: "License", href: "/pricing" },
    { name: "Terminal", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 selection:bg-indigo-100">
      <div className="container mx-auto px-10">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-500 ring-1 ring-indigo-100">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase">
              AI Co-Teacher
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <Link to="/dashboard" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all active:scale-95">
                Terminal Access
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[10px] font-black text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-all px-4 py-2">
                  Initialize
                </Link>
                <Link to="/signup" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/20">
                  Join Collective
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[260px] bg-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-slate-900 font-black text-sm tracking-tight uppercase">Mission Control</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-8 space-y-4">
                <div className="px-4 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Matrix</p>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-indigo-600 transition-all border border-transparent hover:bg-slate-50 rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="h-14 w-full flex items-center justify-center bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                  >
                    Terminal Access
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="h-14 w-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm"
                    >
                      Initialize
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="h-14 w-full flex items-center justify-center bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                    >
                      Join Collective
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
