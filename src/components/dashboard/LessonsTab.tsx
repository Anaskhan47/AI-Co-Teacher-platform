import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, MoreVertical, Loader2, Search, Filter, Clock, FileText, HelpCircle, GraduationCap, Download } from "lucide-react";
import { downloadAsFile } from "@/lib/utils";

interface LessonsTabProps {
    onLessonSelect?: (lesson: any) => void;
}

export function LessonsTab({ onLessonSelect }: LessonsTabProps) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month">("all");
    const { data: lessons, isLoading } = useQuery({
        queryKey: ['lessons'],
        queryFn: async () => {
            try {
                const res = await api.get('/lessons');
                return res.data?.data || res.data || [];
            } catch (err) {
                console.warn("Using local emergency fallback data.");
                return [
                    { id: 'm1', title: 'Emergency Protocol: Physics', type: 'MATERIAL', subject: { name: 'Physics' }, topic: { name: 'Quantum' }, grade: 12 },
                    { id: 'm2', title: 'Emergency Protocol: Algebra', type: 'QUIZ', subject: { name: 'Math' }, topic: { name: 'Algebra' }, grade: 10 }
                ];
            }
        },
        retry: 0, // KILL THE INFINITE LOOP
        refetchOnWindowFocus: false
    });

    const filteredLessons = lessons?.filter((lesson: any) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = (
            lesson.title?.toLowerCase().includes(search) ||
            lesson.subject?.name?.toLowerCase().includes(search) ||
            lesson.subject?.toLowerCase?.().includes(search) ||
            lesson.topic?.name?.toLowerCase().includes(search) ||
            lesson.topic?.toLowerCase?.().includes(search)
        );

        if (!matchesSearch) return false;

        if (timeFilter === "all") return true;

        const lessonDate = new Date(lesson.createdAt || lesson.updatedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lessonDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === "today") return diffDays <= 1;
        if (timeFilter === "week") return diffDays <= 7;
        if (timeFilter === "month") return diffDays <= 30;

        return true;
    });

    const handleDownload = (lesson: any) => {
        let content = "";
        const title = lesson.title || "Untitled";
        
        if (lesson.type === 'QUIZ' || lesson.questions) {
            const questions = typeof lesson.questions === 'string' ? JSON.parse(lesson.questions) : (lesson.questions || []);
            content = `# ${title}\n\n`;
            questions.forEach((q: any, i: number) => {
                content += `Q${i + 1}: ${q.question}\n`;
                if (q.options) {
                    q.options.forEach((opt: string, optIdx: number) => {
                        content += `${String.fromCharCode(65 + optIdx)}) ${opt}\n`;
                    });
                }
                content += `Correct Answer: ${q.correctAnswer}\n\n`;
            });
        } else {
            content = `# ${title}\n\n`;
            content += `Objective: ${lesson.objective}\n\n`;
            content += `Duration: ${lesson.duration} mins\n\n`;
            
            if (lesson.activities) {
                content += `## Activities\n`;
                const activities = typeof lesson.activities === 'string' ? JSON.parse(lesson.activities) : lesson.activities;
                activities.forEach((act: any, i: number) => {
                    content += `${i + 1}. [${act.time}] ${act.description}\n`;
                    if (act.tip) content += `   Tip: ${act.tip}\n`;
                });
                content += `\n`;
            }
            
            if (lesson.homework) content += `## Homework\n${lesson.homework}\n\n`;
            if (lesson.resources) content += `## Resources\n${lesson.resources}\n\n`;
        }

        downloadAsFile(`${title.replace(/[^a-z0-9]/gi, '_')}.md`, content);
        toast.success("Download started!");
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">My Library</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage and deploy your AI-generated curriculum</p>
                </div>

                <div className="flex flex-1 items-center justify-end gap-4 max-w-2xl">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search lessons, subjects or topics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-indigo-500 text-white placeholder:text-slate-600 shadow-xl"
                        />
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`h-14 px-6 rounded-2xl border-white/10 font-bold bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 ${timeFilter !== 'all' ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' : ''}`}>
                                    <Filter className="w-4 h-4 mr-2" />
                                    {timeFilter === 'all' ? 'Filter' :
                                        timeFilter === 'today' ? 'Today' :
                                            timeFilter === 'week' ? 'Last Week' : 'Last Month'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10 rounded-xl p-2 text-white">
                                <DropdownMenuItem onClick={() => setTimeFilter("all")} className="rounded-lg font-medium">All Time</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimeFilter("today")} className="rounded-lg font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Today
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimeFilter("week")} className="rounded-lg font-medium">Last Week</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimeFilter("month")} className="rounded-lg font-medium">Last Month</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : filteredLessons?.length === 0 ? (
                    <div className="text-center p-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-20" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                            {searchTerm || timeFilter !== 'all' ? `No archives found matching filters` : "Your archive is empty. Synthesize your first lesson."}
                        </p>
                    </div>
                ) : (
                    filteredLessons?.map((lesson: any) => (
                        <Card
                            key={lesson.id}
                            onClick={() => onLessonSelect?.(lesson)}
                            className="border border-white/5 shadow-xl bg-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer group active:scale-[0.99] rounded-[2rem] overflow-hidden"
                        >
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500 ${lesson.type === 'QUIZ' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                                            lesson.type === 'MATERIAL' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                                lesson.type === 'ASSIGNMENT' ? 'bg-indigo-600 text-white shadow-indigo-600/20' :
                                                    'bg-blue-600 text-white shadow-blue-600/20'
                                            }`}>
                                            {lesson.type === 'QUIZ' ? <HelpCircle className="w-8 h-8" /> :
                                                lesson.type === 'MATERIAL' ? <BookOpen className="w-8 h-8" /> :
                                                    lesson.type === 'ASSIGNMENT' ? <FileText className="w-8 h-8" /> :
                                                        <GraduationCap className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors leading-none tracking-tight">{String(lesson.title || "Untitled")}</h3>
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border ${lesson.type === 'QUIZ' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    lesson.type === 'MATERIAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        lesson.type === 'ASSIGNMENT' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {String(lesson.type || 'LESSON')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{String(lesson.subject?.name || lesson.subjectName || 'General')}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{String(lesson.topic?.name || lesson.topicName || 'Intro')}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Class {String(lesson.grade || 10)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {lesson.type === 'QUIZ' && (
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/quiz/${lesson.id}`);
                                                }}
                                                className="h-10 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-white shadow-xl shadow-amber-500/20 transition-all uppercase tracking-widest"
                                            >
                                                Deploy
                                            </Button>
                                        )}
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] border ${lesson.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                                            {lesson.status}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button 
                                                    className="p-2 text-slate-600 hover:text-white transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10 text-white rounded-xl p-2">
                                                <DropdownMenuItem 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(lesson);
                                                    }}
                                                    className="rounded-lg flex items-center gap-2 font-bold uppercase tracking-widest text-[9px] py-3 cursor-pointer"
                                                >
                                                    <Download className="w-4 h-4 text-indigo-400" />
                                                    Download Artifact
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Placeholder for delete
                                                        toast.info("Delete protocol initiated (Simulation)");
                                                    }}
                                                    className="rounded-lg flex items-center gap-2 font-bold uppercase tracking-widest text-[9px] py-3 cursor-pointer text-rose-400 hover:text-rose-300"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Archive Record
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
