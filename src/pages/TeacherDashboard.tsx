import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Brain,
  ClipboardCheck,
  Video,
  Calendar,
  ChevronRight,
  MoreVertical,
  Loader2,
  CheckCircle2,
  ScrollText,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Presentation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { LessonCreateDialog } from "@/components/dashboard/LessonCreateDialog";
import { AssignmentsTab } from "@/components/dashboard/AssignmentsTab";
import { QuizGeneratorTab } from "@/components/dashboard/QuizGeneratorTab";
import { TeachingMaterialTab } from "@/components/dashboard/TeachingMaterialTab";
import { AttendanceTab } from "@/components/dashboard/AttendanceTab";
import { QuestionPaperTab } from "@/components/dashboard/QuestionPaperTab";
import { MessagesTab } from "@/components/dashboard/MessagesTab";
import { StudentsTab } from "@/components/dashboard/StudentsTab";
import { AIAssistantTab } from "@/components/dashboard/AIAssistantTab";
import { AILessonPlanGeneratorTab } from "@/components/dashboard/AILessonPlanGeneratorTab";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { PPTGeneratorTab } from "@/components/dashboard/PPTGeneratorTab";
import { CalendarTab } from "@/components/dashboard/CalendarTab";
import { DataAnalysisTab } from "@/components/dashboard/DataAnalysisTab";
import { LessonSummarizerTab } from "@/components/dashboard/LessonSummarizerTab";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "@/components/layout/MobileNav";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assistantMode, setAssistantMode] = useState<"lesson" | "material" | "quiz">("lesson");
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "generator", icon: Brain, label: "AI Lesson Planner" },
    { id: "summarizer", icon: FileText, label: "Summarizer" },
    { id: "ppt", icon: Presentation, label: "PPT Generator" },
    { id: "assignments", icon: FileText, label: "Assignments" },
    { id: "exams", icon: ScrollText, label: "Examinations" },
    { id: "attendance", icon: CheckCircle2, label: "Attendance" },
    { id: "students", icon: Users, label: "Students" },
  ];

  const quickActions = [
    { icon: BookOpen, label: "Synthesize Lesson", color: "indigo", bgColor: "bg-indigo-50", iconColor: "text-indigo-600", mode: "lesson" },
    { icon: Brain, label: "Generate Resources", color: "amber", bgColor: "bg-amber-50", iconColor: "text-amber-600", mode: "material" },
    { icon: Presentation, label: "Create Slides", color: "violet", bgColor: "bg-violet-50", iconColor: "text-violet-600", mode: "lesson" },
    { icon: ScrollText, label: "Prepare Exam", color: "blue", bgColor: "bg-blue-50", iconColor: "text-blue-600", mode: "lesson" },
  ];

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data?.data || res.data;
    }
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const res = await api.get('/lessons');
      return res.data?.data || res.data || [];
    }
  });

  const stats = [
    { label: "Total Students", value: String(dashboardStats?.totalStudents || "0"), change: "+12% Periodicity", icon: Users, iconColor: "text-indigo-600" },
    { label: "Plans Created", value: String(dashboardStats?.lessonsCreated || "0"), change: "+5 Academic Cycle", icon: BookOpen, iconColor: "text-emerald-600" },
    { label: "Avg. Performance", value: String(dashboardStats?.avgPerformance || "78") + "%", change: "+3% Institutional", icon: BarChart3, iconColor: "text-blue-600" },
    { label: "Attendance Rate", value: String(dashboardStats?.attendanceRate || "95") + "%", change: "92% Real-time", icon: TrendingUp, iconColor: "text-orange-600" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Local Tab Navigation (Desktop Only, since Sidebar handles main nav) */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl w-fit">
        {menuItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === item.id 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" ? (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white border border-slate-100 animate-pulse" />
              ))
            ) : (
              stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight mt-1">{stat.change}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <stat.icon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Access */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Operational Hub</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">High-performance AI synthesis modules</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {quickActions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setAssistantMode(action.mode as any);
                        setActiveTab('generator');
                      }}
                      className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-600 hover:bg-white transition-all flex flex-col items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-indigo-600 transition-colors">
                        <action.icon className={cn("w-6 h-6", action.iconColor, "group-hover:text-white")} />
                      </div>
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resource List */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Recent Syntheses</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit trail of generated materials</p>
                  </div>
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">View Registry</Button>
                </div>
                <div className="space-y-2">
                  {lessonsLoading ? (
                    <div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
                  ) : (
                    lessons?.slice(0, 5).map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{lesson.title}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lesson.subject?.name || 'Academic'} • Grade {lesson.grade || 10}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Schedule / Sidebar panel */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Academic Pulse</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time schedule monitoring</p>
                </div>
                <div className="space-y-4">
                  {[
                    { time: "09:00", label: "Adv. Mathematics", room: "Sec A" },
                    { time: "11:30", label: "Organic Chemistry", room: "Sec B" },
                    { time: "14:00", label: "World History", room: "Sec A" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex flex-col items-center min-w-[40px]">
                        <span className="text-[11px] font-black text-slate-900">{item.time}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">GMT+5</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Configure Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "generator" ? (
        <AILessonPlanGeneratorTab initialMode={assistantMode} />
      ) : activeTab === "summarizer" ? (
        <LessonSummarizerTab />
      ) : activeTab === "ppt" ? (
        <PPTGeneratorTab />
      ) : activeTab === "assignments" ? (
        <AssignmentsTab />
      ) : activeTab === "exams" ? (
        <QuestionPaperTab />
      ) : activeTab === "attendance" ? (
        <AttendanceTab />
      ) : activeTab === "students" ? (
        <StudentsTab />
      ) : (
        <div className="h-64 flex items-center justify-center bg-white rounded-[2rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Module Synchronization Pending...</p>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
