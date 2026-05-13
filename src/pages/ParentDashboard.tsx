import { useState } from "react";
import { motion } from "framer-motion";
import {
    GraduationCap, LayoutDashboard, MessageSquare, BarChart3, LogOut,
    Calendar, Award, Bell, ChevronRight, TrendingUp, Clock, CheckCircle2, Loader2,
    Sparkles, ShieldCheck, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "@/components/layout/MobileNav";

const ParentDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const { logout } = useAuth();

    const menuItems = [
        { id: "overview", icon: LayoutDashboard, label: "Overview" },
        { id: "academic", icon: BarChart3, label: "Academic Record" },
        { id: "attendance", icon: CheckCircle2, label: "Attendance" },
        { id: "messages", icon: MessageSquare, label: "Messages" },
    ];

    const { data: parentData, isLoading } = useQuery({
        queryKey: ['parent-dashboard'],
        queryFn: async () => {
            const res = await api.get('/parent-dashboard/data');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-950 flex-col gap-6">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-[2rem] border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                    <ShieldCheck className="w-10 h-10 text-indigo-400" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Guardian Records...</p>
            </div>
        );
    }

    const child = parentData?.children?.[0];

    const stats = [
        { label: "Attendance Rate", value: (parentData?.stats?.attendanceRate ?? "0") + "%", sub: "Institutional benchmark: 95%", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Overall Performance", value: (parentData?.stats?.avgGrade ?? "0") + "%", sub: "Cohort average: 72%", icon: Award, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Pending Tasks", value: String(parentData?.stats?.pendingAssignments ?? "0"), sub: "Next deadline: Friday", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-40">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">AI Co-Teacher</span>
                </div>

                <nav className="flex-1 px-6 space-y-2 mt-8 overflow-y-auto custom-scrollbar">
                    <div className="pb-4">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Guardian Portal</p>
                    </div>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-xs ${activeTab === item.id
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 group border border-transparent"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-indigo-600"}`} />
                            <span className="uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Guardian Mode</p>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 border border-slate-200">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child?.user.name}parent`} />
                            </Avatar>
                            <p className="font-bold text-slate-900 text-xs tracking-tight truncate">{child?.user.name}'s Guardian</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-xs uppercase tracking-widest group border border-transparent hover:border-rose-200">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 overflow-auto relative">
                <header className="bg-white/90 backdrop-blur sticky top-0 z-30 border-b border-slate-200 px-4 lg:px-10 py-4 lg:py-6">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3 lg:gap-4">
                            <MobileNav menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} />
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-[8px] font-black uppercase tracking-widest mb-1 lg:mb-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    Guardian Uplink
                                </div>
                                <h1 className="text-xl lg:text-3xl font-black tracking-tight text-slate-900 leading-none">Parent Dashboard</h1>
                                <p className="text-slate-500 text-xs hidden lg:block font-medium mt-1.5">Academic monitoring for <span className="text-indigo-600 font-bold">{String(child?.user?.name || 'Student')}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 lg:gap-6">
                            <button className="relative w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-white hover:text-indigo-600 transition-all group shadow-sm">
                                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <Avatar className="h-10 w-10 lg:h-12 lg:w-12 border border-slate-200 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child?.user.name}`} />
                                <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">ST</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <div className="max-w-[1600px] mx-auto p-10 space-y-10 relative z-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border border-white/5 bg-slate-950/50 backdrop-blur-3xl overflow-hidden rounded-2xl group hover:border-indigo-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{stat.label}</p>
                                                <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{stat.value}</h3>
                                                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest opacity-60">{stat.sub}</p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-xl ${stat.bg} border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12">
                        {/* Academic Growth */}
                        <Card className="border border-white/5 bg-slate-950/50 backdrop-blur-3xl p-8 rounded-2xl shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight uppercase">Performance Metrics</h3>
                                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">Recent assessment telemetry</p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="space-y-4">
                                {(Array.isArray(child?.grades) ? child.grades : []).map((grade: any) => (
                                    <div key={grade.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                <BarChart3 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-base tracking-tight mb-0.5">{String(grade?.type || "Assessment")}</p>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{new Date(grade?.gradedAt || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl tracking-tight text-indigo-600">{grade?.score}/{grade?.maxScore}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified Result</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Attendance & Communication */}
                        <div className="space-y-10">
                        <div className="space-y-8">
                            <Card className="border border-white/5 bg-slate-950/50 backdrop-blur-3xl p-8 rounded-2xl shadow-2xl">
                                <h3 className="text-xl font-bold text-white tracking-tight uppercase mb-8">Sync Log: Attendance</h3>
                                <div className="flex gap-2 mb-8">
                                    {(Array.isArray(child?.attendance) ? child.attendance : []).slice(0, 7).map((log: any) => (
                                        <div
                                            key={log.id}
                                            className={`flex-1 h-12 rounded-xl flex items-center justify-center font-bold text-[10px] border transition-all ${log.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                                        >
                                            {new Date(log?.date || Date.now()).getDate()}
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full h-12 rounded-xl border border-white/5 bg-white/5 text-slate-500 font-bold uppercase tracking-widest text-[9px] hover:bg-white/10 hover:text-white transition-all">
                                    Detailed History Retrieval
                                </Button>
                            </Card>

                            <Card className="border-none shadow-[0_0_80px_rgba(79,70,229,0.15)] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold uppercase tracking-tight">Communication Uplink</h3>
                                        <MessageSquare className="w-5 h-5 opacity-50" />
                                    </div>
                                    <div className="space-y-4">
                                        {(Array.isArray(parentData?.recentMessages) ? parentData.recentMessages : []).map((msg: any) => (
                                            <div key={msg.id} className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:bg-white/15 transition-all">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Avatar className="w-7 h-7 border border-white/10">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg?.sender?.name || 'System'}`} />
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest leading-none">{msg?.sender?.name || 'System'}</p>
                                                        <p className="text-[8px] opacity-40 uppercase tracking-widest">{safeTime(msg?.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs font-medium leading-relaxed line-clamp-2">{msg?.content}</p>
                                            </div>
                                        ))}
                                        {(!parentData?.recentMessages || parentData.recentMessages.length === 0) && (
                                            <p className="text-indigo-100 text-[9px] font-bold uppercase tracking-widest opacity-60 text-center py-6">No active messages recorded.</p>
                                        )}
                                    </div>
                                    <Button className="w-full mt-8 bg-white text-indigo-700 hover:bg-slate-100 font-bold uppercase tracking-widest text-[9px] h-12 rounded-xl shadow-lg border-none transition-all">
                                        Open Transmission Center
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ParentDashboard;
