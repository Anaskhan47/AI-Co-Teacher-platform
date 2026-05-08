import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Loader2, Users, BookOpen, Clock, FileCheck, Sparkles, LayoutDashboard } from "lucide-react";
import { DataAnalysisTab } from "./DataAnalysisTab";

export function AnalyticsTab() {
    const [mode, setMode] = useState<'overview' | 'ai'>('overview');

    const { data: stats, isLoading } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000));
            return {
                performanceTrend: [
                    { name: 'Jan', avg: 65 }, { name: 'Feb', avg: 72 }, { name: 'Mar', avg: 68 },
                    { name: 'Apr', avg: 75 }, { name: 'May', avg: 82 }, { name: 'Jun', avg: 85 }
                ],
                attendanceDist: [
                    { name: 'Present', value: 85, color: '#10B981' },
                    { name: 'Absent', value: 10, color: '#EF4444' },
                    { name: 'Late', value: 5, color: '#F59E0B' }
                ],
                topicMastery: [
                    { subject: 'Math', score: 88 },
                    { subject: 'Physics', score: 76 },
                    { subject: 'Chemistry', score: 82 },
                    { subject: 'Biology', score: 90 },
                    { subject: 'English', score: 95 }
                ],
                studentEngagement: [
                    { day: 'Mon', active: 45 }, { day: 'Tue', active: 52 }, { day: 'Wed', active: 48 },
                    { day: 'Thu', active: 60 }, { day: 'Fri', active: 55 }
                ],
                overview: { totalStudents: 120, completedLessons: 45, totalHours: 128, assignmentsGraded: 350 }
            };
        }
    });

    const overviewCards = [
        { label: 'Total Entities', value: stats?.overview.totalStudents, icon: Users, color: 'indigo', glow: 'shadow-indigo-500/20', bg: 'bg-indigo-600/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
        { label: 'Lessons Deployed', value: stats?.overview.completedLessons, icon: BookOpen, color: 'emerald', glow: 'shadow-emerald-500/20', bg: 'bg-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
        { label: 'Teaching Hours', value: `${stats?.overview.totalHours}h`, icon: Clock, color: 'amber', glow: 'shadow-amber-500/20', bg: 'bg-amber-600/10', border: 'border-amber-500/20', text: 'text-amber-400' },
        { label: 'Graded Artifacts', value: stats?.overview.assignmentsGraded, icon: FileCheck, color: 'blue', glow: 'shadow-blue-500/20', bg: 'bg-blue-600/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    ];

    const chartTooltipStyle = {
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        fontSize: '12px',
        fontWeight: 700
    };

    if (isLoading) return (
        <div className="flex flex-col h-[400px] items-center justify-center gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 animate-pulse">Loading Intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Analytics Command</h2>
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mt-1">Monitor performance metrics and generate AI insights</p>
                </div>

                <div className="flex p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5 shadow-inner backdrop-blur-md">
                    <button
                        onClick={() => setMode('overview')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'overview'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button
                        onClick={() => setMode('ai')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'ai'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <Sparkles className="w-4 h-4" /> AI Analysis
                    </button>
                </div>
            </div>

            {mode === 'ai' ? (
                <DataAnalysisTab />
            ) : (
                <>
                    {/* Overview Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {overviewCards.map((card, i) => (
                            <Card key={i} className={`border ${card.border} bg-white/5 rounded-[2rem] shadow-2xl ${card.glow} hover:scale-[1.02] transition-all group`}>
                                <CardContent className="p-8 flex items-center gap-6">
                                    <div className={`w-16 h-16 ${card.bg} border ${card.border} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                                        <card.icon className={`w-7 h-7 ${card.text}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{card.label}</p>
                                        <h3 className={`text-3xl font-black ${card.text} mt-1 tracking-tight`}>{card.value}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border border-white/5 bg-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Performance Trend</CardTitle>
                                <p className="text-xl font-black text-white tracking-tight mt-1">Academic Trajectory</p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats?.performanceTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                                            <Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 2 }} />
                                            <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 5, stroke: '#0f172a' }} activeDot={{ r: 7, fill: '#818cf8' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-white/5 bg-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Subject Intelligence</CardTitle>
                                <p className="text-xl font-black text-white tracking-tight mt-1">Domain Mastery Index</p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats?.topicMastery} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 700, fontSize: 11 }} width={80} />
                                            <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                            <Bar dataKey="score" fill="#10B981" radius={[0, 8, 8, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="border border-white/5 bg-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Attendance Status</CardTitle>
                                <p className="text-xl font-black text-white tracking-tight mt-1">Presence Distribution</p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[220px] w-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={stats?.attendanceDist} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" strokeWidth={0}>
                                                {stats?.attendanceDist.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={chartTooltipStyle} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-6 mt-2">
                                    {stats?.attendanceDist.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-white/5 bg-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden lg:col-span-2">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Engagement Insights</CardTitle>
                                <p className="text-xl font-black text-white tracking-tight mt-1">Weekly Activity Index</p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats?.studentEngagement}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 700, fontSize: 11 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 700, fontSize: 11 }} />
                                            <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                            <Bar dataKey="active" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
