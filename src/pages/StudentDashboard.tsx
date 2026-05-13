import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Sparkles,
  Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";

import { MobileNav } from "@/components/layout/MobileNav";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Command Center" },
    { id: "lessons", icon: BookOpen, label: "My Lessons" },
    { id: "assignments", icon: FileText, label: "Assignments" },
    { id: "quizzes", icon: ClipboardCheck, label: "Assessments" },
    { id: "grades", icon: BarChart3, label: "Academic Record" },
  ];

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      try {
        const res = await api.get('/student-dashboard/dashboard');
        return res.data || res;
      } catch (err) {
        return null;
      }
    },
    retry: 0,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 flex-col gap-6">
        <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-[2rem] border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <GraduationCap className="w-10 h-10 text-indigo-400" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Academic Profile...</p>
      </div>
    );
  }

  const safeDate = (date: any) => {
    try {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const stats = [
    { label: "Lessons Completed", value: String(dashboardData?.stats?.lessonsCompleted ?? "0"), icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Assignments Due", value: String(dashboardData?.stats?.assignmentsDue ?? "0"), icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Average Score", value: String(dashboardData?.stats?.avgScore ?? "0") + "%", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Attendance", value: String(dashboardData?.stats?.attendanceRate ?? "0") + "%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      {/* Sidebar handles main nav */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-40">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">AI Co-Teacher</span>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8 overflow-y-auto custom-scrollbar">
          <div className="pb-4">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Portal</p>
          </div>
          {(Array.isArray(menuItems) ? menuItems : []).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-xs ${activeTab === item.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-600 hover:bg-white hover:text-indigo-600 group border border-transparent hover:border-slate-100"
                }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-indigo-600"}`} />
              <span className="uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-xs uppercase tracking-widest group border border-transparent hover:border-rose-200">
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
                  <Sparkles className="w-3 h-3" />
                  Active Profile
                </div>
                <h1 className="text-xl lg:text-3xl font-black tracking-tight text-slate-900 leading-none">
                  Hello, <span className="text-indigo-600">{String(dashboardData?.profile?.user?.name || "Student").split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 text-xs hidden lg:block font-medium mt-1">Track lessons, assignments, and progress in one place.</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-10 space-y-10 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(Array.isArray(stats) ? stats : []).map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-slate-200 bg-white overflow-hidden rounded-[2.5rem] group hover:border-indigo-500 transition-all shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                        <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-indigo-600 transition-all`} style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 border border-slate-200 bg-white p-10 rounded-[3rem] shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Current Curriculum</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">High-priority learning materials</p>
                </div>
                <Button variant="ghost" className="text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 hover:text-indigo-700">Open Catalog <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
              <div className="space-y-6">
                {(Array.isArray(dashboardData?.lessons) ? dashboardData.lessons : []).map((lesson: any) => (
                  <div key={lesson.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xl tracking-tight mb-1">{String(lesson?.title || "Untitled")}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{String(lesson?.subject?.name || 'General')}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Active Lesson</span>
                          </div>
                        </div>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-md shadow-indigo-600/10 border-none transition-all">Launch</Button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-10">
              <Card className="border border-slate-200 bg-white p-10 rounded-[3rem] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Deadlines</h3>
                    <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-6">
                  {(Array.isArray(dashboardData?.assignments) ? dashboardData.assignments : []).map((asn: any) => (
                    <div key={asn.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asn?.submissions?.length > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} border`}>
                          {asn?.submissions?.length > 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm tracking-tight mb-0.5">{String(asn?.title || "Assignment")}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Terminating: {safeDate(asn?.dueDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
