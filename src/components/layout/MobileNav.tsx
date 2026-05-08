import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface MobileNavProps {
    menuItems: { id: string; icon: any; label: string }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export const MobileNav = ({ menuItems, activeTab, onTabChange }: MobileNavProps) => {
    const [open, setOpen] = useState(false);
    const { logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    const handleSelect = (id: string) => {
        onTabChange(id);
        setOpen(false);
    };

    const drawerContent = (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[9999] lg:hidden">
                    {/* HIGH-FIDELITY BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* RESPONSIVE MISSION CONTROL DRAWER */}
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-screen w-[280px] bg-white flex flex-col shadow-2xl border-r border-slate-200 overflow-hidden"
                    >
                        {/* DRAWER HEADER */}
                        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight tracking-tight truncate uppercase">Mission Control</h2>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">Authorized Access Only</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(false)} 
                                className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90 shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* NAVIGATION PROTOCOLS */}
                        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar bg-white">
                            <div className="px-3 mb-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400/80">Navigation Core</p>
                            </div>
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item.id)}
                                    className={cn(
                                        "w-full h-14 flex items-center gap-4 px-4 rounded-2xl transition-all duration-300 group",
                                        activeTab === item.id
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 shrink-0 transition-colors",
                                        activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                                    )} />
                                    <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* DEPLOYMENT FOOTER */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                            <button
                                onClick={() => { logout(); setOpen(false); }}
                                className="w-full h-14 flex items-center gap-4 px-4 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-[10px] uppercase tracking-[0.15em] group"
                            >
                                <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
                                <span>Terminate Session</span>
                            </button>
                        </div>
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setOpen(true)}
                className="h-11 w-11 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                aria-label="Open Navigation Console"
            >
                <Menu className="w-5 h-5" />
            </button>

            {mounted && createPortal(drawerContent, document.body)}
        </div>
    );
};
