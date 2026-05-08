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
      const res = await api.get('/student-dashboard/dashboard');
      return res.data;
    }
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

  const stats = [
    { label: "Lessons Completed", value: dashboardData?.stats.lessonsCompleted || "0", icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Assignments Due", value: dashboardData?.stats.assignmentsDue || "0", icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Average Score", value: (dashboardData?.stats.avgScore || "0") + "%", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Attendance", value: (dashboardData?.stats.attendanceRate || "0") + "%", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-40">
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
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-xs ${activeTab === item.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 group border border-transparent"
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
                  Hello, <span className="text-indigo-600">{dashboardData?.profile?.user?.name?.split(' ')[0] || 'Student'}</span>
                </h1>
                <p className="text-slate-500 text-xs hidden lg:block font-medium mt-1">Track lessons, assignments, and progress in one place.</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
               <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Academic Rank</span>
                    <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-white font-black text-xs uppercase tracking-widest leading-none pt-0.5">Grade {dashboardData?.profile?.grade || 'N/A'}-{dashboardData?.profile?.section || 'N/A'}</span>
                    </div>
               </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-10 space-y-10 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-white/5 bg-slate-950/50 backdrop-blur-3xl overflow-hidden rounded-[2.5rem] group hover:border-indigo-500/50 transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{stat.value}</h3>
                        <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${stat.bg.replace('/10', '')} transition-all`} style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 border border-white/5 bg-slate-950/50 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Current Curriculum</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">High-priority learning materials</p>
                </div>
                <Button variant="ghost" className="text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500/10 hover:text-indigo-300">Open Catalog <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
              <div className="space-y-6">
                {dashboardData?.lessons.map((lesson: any) => (
                  <div key={lesson.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                          <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-xl tracking-tight mb-1">{lesson.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{lesson.subject?.name || 'General'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] text-indigo-500/60 font-black uppercase tracking-widest">Active Lesson</span>
                          </div>
                        </div>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-indigo-600/20 border-none transition-all">Launch</Button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-10">
              <Card className="border border-white/5 bg-slate-950/50 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Deadlines</h3>
                    <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-6">
                  {dashboardData?.assignments.map((asn: any) => (
                    <div key={asn.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asn.submissions.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'} border`}>
                          {asn.submissions.length > 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-black text-white text-sm tracking-tight mb-0.5">{asn.title}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Terminating: {new Date(asn.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="font-black text-[9px] uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300">
                        {asn.submissions.length > 0 ? 'Results' : 'Upload'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-none shadow-[0_0_80px_rgba(79,70,229,0.2)] bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black font-display uppercase tracking-tighter">Performance</h3>
                    <BarChart3 className="w-6 h-6 opacity-50" />
                    </div>
                    <div className="space-y-5">
                    {dashboardData?.profile?.grades?.slice(0, 3).map((grade: any) => (
                        <div key={grade.id} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:bg-white/20 transition-all">
                        <span className="font-black text-xs uppercase tracking-widest">{grade.type}</span>
                        <div className="flex flex-col items-end">
                            <span className="font-black text-lg tracking-tighter">{grade.score}/{grade.maxScore}</span>
                            <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Verified Score</span>
                        </div>
                        </div>
                    ))}
                    {dashboardData?.profile.grades.length === 0 && (
                        <p className="text-indigo-100 text-xs font-black uppercase tracking-widest opacity-60 text-center py-4">No assessments indexed.</p>
                    )}
                    </div>
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
