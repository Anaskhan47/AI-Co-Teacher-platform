import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Clock,
    FileBox,
    MessageSquare,
    ChevronLeft,
    Search,
    Bell,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileOpen]);

    const { loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50 flex-col gap-6">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-[2rem] border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                    <GraduationCap className="w-10 h-10 text-indigo-400" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Initializing System...</p>
            </div>
        );
    }


    const menuItems = [
        { name: "Executive Overview", icon: LayoutDashboard, href: "/" },
        { name: "Curriculum Designer", icon: BookOpen, href: "/" },
        { name: "Examination Builder", icon: ClipboardList, href: "/" },
        { name: "Assignment Vault", icon: FileBox, href: "/" },
        { name: "Student Roster", icon: Users, href: "/" },
        { name: "Attendance Registry", icon: Clock, href: "/" },
        { name: "Resource Matrix", icon: Layers, href: "/" },
        { name: "Communications", icon: MessageSquare, href: "/" },
        { name: "System Settings", icon: Settings, href: "/" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const sidebarContent = (
        <AnimatePresence>
            {mobileOpen && (
                <div className="fixed inset-0 z-[9999] lg:hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setMobileOpen(false)}
                    />

                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 left-0 h-screen w-[300px] bg-white flex flex-col shadow-2xl overflow-hidden"
                    >
                        <div className="h-24 px-8 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                    <GraduationCap className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">Institutional</h2>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Nexus</p>
                                </div>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 px-5 py-10 space-y-2 overflow-y-auto custom-scrollbar">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-3">Administrative Control</p>
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 h-14 px-4 rounded-2xl transition-all duration-300 group",
                                        location.pathname === item.href
                                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 shrink-0", location.pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                    <span className="font-black text-[11px] uppercase tracking-widest">{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <button onClick={handleLogout} className="w-full flex items-center gap-4 h-14 px-4 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-black text-[11px] uppercase tracking-widest group">
                                <LogOut className="w-5 h-5 shrink-0" />
                                <span>Terminate Session</span>
                            </button>
                        </div>
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden selection:bg-indigo-100">
            {/* Desktop Sidebar Architecture */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-500 hidden lg:flex flex-col shadow-sm",
                collapsed ? "w-24" : "w-72"
            )}>
                <div className="h-24 px-8 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
                    {!collapsed && (
                        <div className="flex items-center gap-4 animate-in fade-in duration-500">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-sm tracking-tighter text-slate-900 uppercase leading-none">Co-Teacher</span>
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Platform</span>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all absolute -right-4 top-9 z-50 shadow-md"
                    >
                        <ChevronLeft className={cn("w-4 h-4 transition-transform duration-500", collapsed && "rotate-180")} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-10 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4", collapsed && "text-center")}>
                        {collapsed ? "NAV" : "Institutional Nexus"}
                    </p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center h-12 px-4 rounded-2xl transition-all duration-300 group relative",
                                location.pathname === item.href
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600",
                                collapsed ? "justify-center" : "gap-4"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", location.pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                            {!collapsed && <span className="font-black text-[11px] uppercase tracking-widest truncate">{item.name}</span>}
                            
                            {collapsed && (
                                <div className="absolute left-full ml-6 px-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 shadow-2xl z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                    <div className={cn("p-3 rounded-2xl border border-slate-200 bg-white flex items-center mb-4 shadow-sm", collapsed ? "justify-center" : "gap-4")}>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-black text-xs shrink-0 shadow-inner">
                            {user?.name?.charAt(0) || "T"}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 text-[10px] uppercase truncate tracking-tight">{user?.name || "Academic Lead"}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-slate-400 text-[8px] font-black uppercase truncate tracking-[0.1em] italic">Lead Educator</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleLogout} className={cn("w-full flex items-center h-12 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-black text-[10px] uppercase tracking-widest group", collapsed ? "justify-center" : "px-4 gap-4")}>
                        <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                        {!collapsed && <span>Terminate Session</span>}
                    </button>
                </div>
            </aside>

            {/* Content Architecture Area */}
            <main className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-500",
                collapsed ? "lg:ml-24" : "lg:ml-72"
            )}>
                {/* Application Global Header */}
                <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            className="lg:hidden h-12 w-12 rounded-2xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="max-w-xl w-full relative hidden md:block group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                            <Input
                                placeholder="Search Institutional Database..."
                                className="pl-12 h-13 bg-slate-50/50 border-slate-100 hover:border-slate-200 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-600/5 focus-visible:border-indigo-600/20 transition-all rounded-2xl text-[11px] font-bold tracking-tight uppercase placeholder:text-slate-400 shadow-inner"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{user?.name}</span>
                            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1">Operational Control</span>
                        </div>
                        <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all relative group shadow-sm">
                            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Dynamic Viewport Architecture */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    <div className="max-w-[1400px] mx-auto p-8 lg:p-14 w-full">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Portal Injection */}
            {mounted && createPortal(sidebarContent, document.body)}
        </div>
    );
};

export default AppLayout;
