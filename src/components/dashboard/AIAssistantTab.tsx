import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { useQueryClient } from "@tanstack/react-query";
import {
    Sparkles,
    BookOpen,
    FileUp,
    Settings2,
    Send,
    Loader2,
    CheckCircle2,
    GraduationCap,
    ArrowLeft,
    Brain,
    ChevronLeft,
    ChevronRight,
    FileText,
    Library,
    HelpCircle,
    PlayCircle,
    ShieldCheck,
    FileType,
    Layers,
    Target,
    Download,
    Check,
    ChevronsUpDown,
    FileUp as FileUpIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import api from "@/api/client";
import { toast } from "sonner";
import { QuickActionDialog } from "./QuickActionDialog";
import { normalizeLessonPlan, normalizeQuiz } from "@/lib/safe-ai";
import { downloadAsFile, downloadAsPDF } from "@/lib/utils";

interface AIAssistantTabProps {
    initialMode?: "lesson" | "material" | "quiz";
    preloadedResult?: any;
}

export function AIAssistantTab({ initialMode = "lesson", preloadedResult }: AIAssistantTabProps) {
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [mode, setMode] = useState(initialMode);

    // Configuration State
    const [board, setBoard] = useState("CBSE");
    const [grade, setGrade] = useState(preloadedResult?.grade || "");
    const [subject, setSubject] = useState(preloadedResult?.subject?.name || preloadedResult?.subject || "");
    const [topic, setTopic] = useState(preloadedResult?.topic?.name || preloadedResult?.topic || "");
    const [title, setTitle] = useState(preloadedResult?.title || "");
    const [detailLevel, setDetailLevel] = useState([50]);
    const [pdfText, setPdfText] = useState("");
    const [unitDetails, setUnitDetails] = useState("");
    const [sessionDuration, setSessionDuration] = useState("60");
    const [numSessions, setNumSessions] = useState("1");
    const [instituteName, setInstituteName] = useState("");
    const [openTopic, setOpenTopic] = useState(false);
    // Quiz Config
    const [quizDifficulty, setQuizDifficulty] = useState("Mixed");
    const [quizNumQuestions, setQuizNumQuestions] = useState(5);
    const [assignmentNumQuestions, setAssignmentNumQuestions] = useState(6); // Keep state for internal use if needed, but remove from UI

    // Data State
    const [subjectsList, setSubjectsList] = useState<string[]>([]);
    const [topicsMap, setTopicsMap] = useState<Record<string, string[]>>({});

    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [result, setResult] = useState<any>(preloadedResult || null);
    const [activeActivityIndex, setActiveActivityIndex] = useState<number | null>(null);
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [showQuickAction, setShowQuickAction] = useState(false);

    const queryClient = useQueryClient();

    // Load pre-existing data if provided (from Library)
    useEffect(() => {
        if (preloadedResult) {
            setResult(preloadedResult);

            // Auto-detect mode from preloaded data
            if (preloadedResult.type === 'MATERIAL' || preloadedResult.subType) {
                setMode('material');
            } else if (preloadedResult.type === 'QUIZ') {
                setMode('quiz');
            } else {
                setMode('lesson');
            }

            setGrade(preloadedResult.grade?.toString() || "");
            setSubject(preloadedResult.subject?.name || preloadedResult.subjectName || preloadedResult.subject || "");
            setTopic(preloadedResult.topic?.name || preloadedResult.topicName || preloadedResult.topic || "");
            setTitle(preloadedResult.title || "");
        }
    }, [preloadedResult]);

    // Fetch Metadata when Board or Grade changes
    useEffect(() => {
        if (board && grade) {
            setSubject("");
            setTopic("");
            api.get('/curriculum/metadata', { params: { curriculum: board, class: grade } })
                .then(res => {
                    if (res.success) {
                        setSubjectsList(res.data.subjects || []);
                        setTopicsMap(res.data.topics || {});
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch curriculum data", err);
                    // Fallback or toast
                });
        }
    }, [board, grade]);

    // Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("[AI ASSISTANT] Selected file for context:", file.name, file.type, file.size);

        if (file.size > 50 * 1024 * 1024) {
            toast.error("File exceeds 50MB limit. Please compress your artifact.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        const loadingToast = toast.loading(`Uploading context: ${file.name}...`);

        try {
            console.log("[AI ASSISTANT] Uploading to /upload/pdf...");
            const res = await api.post('/upload/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (p) => {
                    const progress = Math.round((p.loaded * 100) / (p.total || 1));
                    console.log(`[AI ASSISTANT] Context upload: ${progress}%`);
                }
            });

            console.log("[AI ASSISTANT] Upload response:", res);

            if (res && res.success) {
                const text = res.data.text;
                setPdfText(text);
                toast.success(`Context inherited from ${file.originalname || file.name}`, { id: loadingToast });
                
                // Auto-trigger generation if required fields are present
                if (grade && subject && topic) {
                    console.log("[AI ASSISTANT] Context fields present. Auto-triggering synthesis protocol.");
                    toast.info("Auto-triggering synthesis protocol...");
                    setTimeout(() => {
                        handleGenerateWithText(text);
                    }, 500);
                }
            } else {
                toast.error(res?.error || "Context extraction failed.", { id: loadingToast });
            }
        } catch (err: any) {
            console.error("[AI ASSISTANT] CRITICAL UPLOAD ERROR:", err);
            const errorMsg = err.response?.data?.error || err.message || "Network failure during context inheritance.";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = ''; // Reset input to allow re-upload of same file if needed
        }
    };

    const handleGenerateWithText = async (textToUse?: string) => {
        if (mode !== 'quiz' && (!grade || !subject || !topic)) {
            toast.error("Please select all required fields");
            return;
        }
        
        setIsGenerating(true);
        setResult(null);

        try {
            let endpoint = '';
            const effectiveGrade = grade || "10";
            const effectiveSubject = subject || "General";

            let payload: any = {
                curriculum: board,
                grade: effectiveGrade,
                subject: effectiveSubject,
                topic,
                title,
                pdfText: textToUse !== undefined ? textToUse : pdfText,
                duration: sessionDuration,
                unitDetails,
                numSessions
            };

            if (mode === 'lesson') {
                endpoint = '/lessons';
                payload.aiAssist = true;
            } else if (mode === 'material') {
                endpoint = '/materials/generate';
                payload.type = 'NOTES';
                payload.topicId = "temp";
            } else if (mode === 'assignment') {
                endpoint = '/assignments/generate';
                payload.count = assignmentNumQuestions;
                payload.assignmentType = 'Homework';
                payload.difficultyLevel = detailLevel[0] >= 70 ? 'Advanced' : detailLevel[0] >= 40 ? 'Medium' : 'Basic';
            } else {
                endpoint = '/quizzes/generate';
                let bloomLevel = "Remember";
                if (quizDifficulty === "Intermediate") bloomLevel = "Apply";
                if (quizDifficulty === "Advanced") bloomLevel = "Evaluate";
                if (quizDifficulty === "Mixed") bloomLevel = "Mixed";

                payload.bloomLevel = bloomLevel;
                payload.count = quizNumQuestions;
                payload.questionType = "MCQ";
                payload.instituteName = instituteName;
            }

            const res = await api.post(endpoint, payload);
            
            if (!res.success) {
                throw new Error(res.error || "Synthesis logic error.");
            }
            
            const coreData = res.data;
            
            let normalizedResult;
            if (mode === 'quiz') {
                normalizedResult = normalizeQuiz(coreData);
            } else if (mode === 'assignment') {
                normalizedResult = coreData;
            } else if (mode === 'material') {
                normalizedResult = coreData;
            } else {
                normalizedResult = normalizeLessonPlan(coreData);
            }

            setResult(normalizedResult);
            toast.success("Content generated successfully!");
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.error || err.message || "Synthesis failed.";
            toast.error(`Generation error: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveToLibrary = async () => {
        if (!result?.id) return;

        setIsSaving(true);
        try {
            if (mode === 'quiz') {
                // Quizzes are already persisted at generation-time.
                queryClient.invalidateQueries({ queryKey: ['quizzes'] });
                toast.success("Saved to Library!");
                return;
            }

            let endpoint = `/lessons/${result.id}`;
            if (mode === 'assignment') endpoint = `/assignments/${result.id}`;
            
            await api.patch(endpoint, { status: 'PUBLISHED' });
            setResult({ ...result, status: 'PUBLISHED' });
            
            if (mode === 'assignment') {
                queryClient.invalidateQueries({ queryKey: ['assignments'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['lessons'] });
            }
            
            toast.success("Saved to Library!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save to library");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadImmediate = () => {
        if (!result) return;
        let content = "";
        const title = result.title || "Lesson_Output";

        if (mode === 'quiz') {
            content = `# ${title}\n\n`;
            (result.questions || []).forEach((q: any, i: number) => {
                content += `Q${i + 1}: ${q.question}\n`;
                if (q.options) {
                    q.options.forEach((opt: string, optIdx: number) => {
                        content += `${String.fromCharCode(65 + optIdx)}) ${opt}\n`;
                    });
                }
                content += `Correct Answer: ${q.correctAnswer}\n\n`;
            });
        } else if (mode === 'assignment') {
            content = `# ${title}\n\n## Questions\n`;
            (result.assignmentQuestions || []).forEach((q: string, i: number) => {
                content += `${i + 1}. ${q}\n`;
            });
            content += `\n## Activities\n`;
            (result.activityQuestions || []).forEach((q: string, i: number) => {
                content += `- ${q}\n`;
            });
        } else if (mode === 'material') {
            content = `# ${title}\n\n`;
            content += `## Explanation\n${result.explanation || result.content || ''}\n\n`;
            if (result.keyPoints?.length) {
                content += `## Key Points\n`;
                result.keyPoints.forEach((k: string) => { content += `- ${k}\n`; });
            }
            if (result.examples?.length) {
                content += `\n## Examples\n`;
                result.examples.forEach((e: string) => { content += `- ${e}\n`; });
            }
            if (result.summary) {
                content += `\n## Summary\n${result.summary}\n`;
            }
        } else {
            content = `# ${title}\n\n`;
            content += `Objective: ${Array.isArray(result.objective) ? result.objective.join(', ') : result.objective}\n\n`;
            content += `## Explanation\n${result.explanation}\n\n`;
            
            if (result.activities) {
                content += `## Activities\n`;
                (result.activities || []).forEach((act: any, i: number) => {
                    content += `${i + 1}. [${act.time}] ${act.description}\n`;
                });
            }
        }

        downloadAsPDF(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`, title, content);
        toast.success("Content exported as PDF!");
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-col bg-white min-h-screen relative animate-in fade-in duration-700">
            {/* --- COMMAND CENTER CONFIG BAR --- */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-8 py-8 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header & Utilities Row */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Pedagogical Command Center</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">Autonomous Curriculum Synthesis Engine</p>
                            </div>
                        </div>

                        {/* Secondary Action: PDF Upload */}
                        <div className="relative group shrink-0">
                            <input
                                type="file"
                                accept=".pdf"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className={cn(
                                    "h-11 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest transition-all",
                                    pdfText 
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                                        : "bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                                )}
                            >
                                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <FileUpIcon className="w-3.5 h-3.5 mr-2" />}
                                {pdfText ? 'Context Synchronized' : 'Inherit PDF Context'}
                            </Button>
                        </div>
                    </div>

                    {/* MAIN INPUT MATRIX */}
                    <div className="grid grid-cols-12 gap-6">
                        
                        {/* Type Selection */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-black">Mode</label>
                            <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                                <SelectTrigger className="w-full bg-slate-50/50 border border-slate-200 h-12 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 ring-indigo-500/20 transition-all">
                                    <SelectValue placeholder="Mode" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    <SelectItem value="lesson" className="font-bold text-xs">Lesson Architecture</SelectItem>
                                    <SelectItem value="quiz" className="font-bold text-xs">Assessment Logic</SelectItem>
                                    <SelectItem value="material" className="font-bold text-xs">Reference Material</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Curriculum Selection */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-black">Curriculum</label>
                            <Select value={board} onValueChange={setBoard}>
                                <SelectTrigger className="w-full bg-slate-50/50 border border-slate-200 h-12 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 ring-indigo-500/20 transition-all">
                                    <SelectValue placeholder="Board" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    {["CBSE", "ICSE", "SSC"].map(b => (
                                        <SelectItem key={b} value={b} className="font-bold text-xs">{b}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Grade Selection */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-2 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-black">Grade</label>
                            <Select value={grade} onValueChange={setGrade}>
                                <SelectTrigger className="w-full bg-slate-50/50 border border-slate-200 h-12 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 ring-indigo-500/20 transition-all">
                                    <SelectValue placeholder="Grade" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 max-h-64">
                                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(g => (
                                        <SelectItem key={g} value={g} className="font-bold text-xs">Class {g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subject Selection */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-4 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-black">Subject Domain</label>
                            <Select value={subject} onValueChange={setSubject} disabled={!grade}>
                                <SelectTrigger className="w-full bg-slate-50/50 border border-slate-200 h-12 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 ring-indigo-500/20 transition-all">
                                    <SelectValue placeholder="Subject Domain" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    {subjectsList.map(s => (
                                        <SelectItem key={s} value={s} className="font-bold text-xs">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Topic Input/Selection */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-6 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-black">Synthetical Topic</label>
                            <Popover open={openTopic} onOpenChange={setOpenTopic}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full h-12 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/30 px-4 text-xs font-bold text-slate-900 hover:bg-white focus:ring-2 ring-indigo-500/20 transition-all shadow-none"
                                    >
                                        <span className="truncate">{topic || "Identify specific topic for synthesis..."}</span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
                                    <Command className="bg-transparent">
                                        <CommandInput placeholder="Search domain topics..." className="h-12 border-none focus:ring-0 text-slate-900 font-bold" />
                                        <CommandList className="max-h-64 scrollbar-hide">
                                            <CommandEmpty className="p-4 text-center">
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-3">Topic not indexed.</p>
                                                <Button size="sm" variant="secondary" className="h-9 text-[9px] uppercase font-black tracking-widest px-6" onClick={() => setOpenTopic(false)}>Manual Input</Button>
                                            </CommandEmpty>
                                            <CommandGroup className="text-slate-900 p-2">
                                                {(topicsMap[subject] || []).map((t) => (
                                                    <CommandItem
                                                        key={t}
                                                        value={t}
                                                        className="text-slate-700 aria-selected:bg-indigo-50 aria-selected:text-indigo-600 cursor-pointer rounded-lg font-bold text-xs px-3 py-2"
                                                        onSelect={() => { setTopic(t); setOpenTopic(false); }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", topic === t ? "opacity-100" : "opacity-0")} />
                                                        {t}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                                            <input
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/10 placeholder:text-slate-400"
                                                placeholder="Enter custom topic..."
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && setOpenTopic(false)}
                                            />
                                        </div>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Synthesis Trigger */}
                        <div className="col-span-12 lg:col-span-6 flex items-end">
                            <Button
                                onClick={() => handleGenerateWithText()}
                                disabled={isGenerating}
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-indigo-600/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                {isGenerating ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Executing Synthesis Protocol</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-4 h-4" />
                                        <span>Commence Content Synthesis</span>
                                    </div>
                                )}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- FOCUS PARAMETERS & WORKSPACE --- */}
            <div className="max-w-7xl mx-auto px-8 py-10 w-full grid grid-cols-12 gap-10">
                
                {/* Parameters Panel (Left/Top) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {mode === 'lesson' && (
                        <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-8 space-y-10">
                            <div className="flex items-center gap-3">
                                <Target className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Synthesis Parameters</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Administrative Notes</label>
                                    <textarea
                                        className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-xs font-bold text-slate-900 placeholder:text-slate-400 min-h-[140px] focus:outline-none focus:ring-2 ring-indigo-500/10 transition-all resize-none shadow-sm"
                                        placeholder="Add pedagogical objectives, classroom context, or specific institutional constraints..."
                                        value={unitDetails}
                                        onChange={(e) => setUnitDetails(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Allocation</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {["30", "45", "60", "90"].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => setSessionDuration(d)}
                                                className={cn(
                                                    "h-11 rounded-xl border font-black text-[10px] uppercase transition-all",
                                                    sessionDuration === d 
                                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10" 
                                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                                )}
                                            >
                                                {d}m
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pedagogical Depth: {detailLevel[0]}%</label>
                                    <div className="px-2 pt-2">
                                        <Slider
                                            value={detailLevel}
                                            onValueChange={setDetailLevel}
                                            max={100}
                                            step={1}
                                            className="py-4"
                                        />
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                            <span>Baseline</span>
                                            <span>Deep Synthesis</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'quiz' && (
                        <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-8 space-y-10">
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Assessment Logic</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cognitive Depth</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create", "Mixed"].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setQuizDifficulty(lvl)}
                                                className={cn(
                                                    "h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                                                    quizDifficulty === lvl 
                                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md" 
                                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                                )}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Item Count: {quizNumQuestions}</label>
                                    <Slider
                                        value={[quizNumQuestions]}
                                        onValueChange={(v) => setQuizNumQuestions(v[0])}
                                        max={20}
                                        min={1}
                                        step={1}
                                    />
                                </div>
                                
                                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                                    <p className="text-[9px] font-black text-indigo-600 leading-loose uppercase tracking-[0.2em] italic">
                                        Logic Protocol: A balanced mix of analytical & evaluative items optimizes mastery assessment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Workspace / Result Panel (Right/Bottom) */}
                <div className="col-span-12 lg:col-span-8 min-w-0">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-200 rounded-[2rem] p-10 min-h-[600px] shadow-sm relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Synthesized Output</h4>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight truncate max-w-md uppercase tracking-tight">{result.title}</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline"
                                            onClick={handleDownloadImmediate} 
                                            className="h-10 px-6 rounded-xl border-slate-200 hover:bg-slate-50 text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export PDF
                                        </Button>
                                        <Button 
                                            onClick={handleSaveToLibrary} 
                                            disabled={isSaving} 
                                            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Library className="w-4 h-4 mr-2" />}
                                            Sync to Library
                                        </Button>
                                    </div>
                                </div>

                                <div className="prose prose-slate prose-sm max-w-none break-words font-serif">
                                    <ReactMarkdown>
                                        {mode === 'quiz' 
                                            ? `### Assessment Index\n\n${result.questions?.map((q: any, i: number) => `**Q${i+1}:** ${q.question}\n`).join('\n') || ''}` 
                                            : mode === 'assignment'
                                            ? `### Homework Assignment\n\n**Instructions:**\n${result.description || result.instructions || ''}\n\n**Core Questions:**\n${(result.assignmentQuestions || []).map((q: string, i: number) => `${i+1}. ${q}`).join('\n')}\n\n**Extension Activities:**\n${(result.activityQuestions || []).map((q: string, i: number) => `- ${q}`).join('\n')}`
                                            : mode === 'material'
                                            ? `### Reference Material\n\n**Theoretical Explanation:**\n${result.explanation || result.content || ''}\n\n**Key Educational Nodes:**\n${(result.keyPoints || []).map((k: string) => `- ${k}`).join('\n')}\n\n**Practical Demonstrations:**\n${(result.examples || []).map((e: string) => `- ${e}`).join('\n')}\n\n**Executive Summary:**\n${result.summary || ''}`
                                            : (
                                                `### Pedagogical Architecture\n\n` +
                                                `**Primary Objective:** ${Array.isArray(result.objective) ? result.objective.join(', ') : result.objective}\n\n` +
                                                `**Conceptual Framework:**\n${result.explanation || ''}\n\n` +
                                                (result.activities?.length > 0 
                                                    ? `**Operational Workflow:**\n${result.activities.map((a: any) => `- [${a.time}] ${a.description}`).join('\n')}\n\n` 
                                                    : '') +
                                                (result.questions?.length > 0
                                                    ? `**Diagnostic Assessment:**\n${result.questions.map((q: any, i: number) => `**Q${i+1}:** ${q.question}\n${q.options?.map((o: string, oi: number) => `  ${String.fromCharCode(65+oi)}) ${o}`).join('\n')}`).join('\n\n')}\n\n`
                                                    : '') +
                                                `**Extended Learning (Homework):**\n${result.homework || ''}\n\n` +
                                                `**Synthesized Summary:**\n${result.summary || ''}`
                                            )}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200/60 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/30">
                                <div className="w-20 h-20 rounded-[2rem] bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-8 animate-in fade-in zoom-in duration-1000">
                                    <Brain className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Synthesis Engine Standby</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed italic">
                                    Configure pedagogical parameters and commence synthesis to generate institutional-grade content.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Overlay Systems */}
            <QuickActionDialog open={showQuickAction} onOpenChange={setShowQuickAction} />
        </div>
    );
}
