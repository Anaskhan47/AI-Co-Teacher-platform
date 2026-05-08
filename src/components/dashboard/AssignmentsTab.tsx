import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Plus, 
    FileText, 
    Calendar, 
    Loader2, 
    ChevronRight, 
    Sparkles, 
    Download, 
    Printer, 
    Share2, 
    UserPlus, 
    Inbox, 
    CheckCircle2,
    Settings2,
    FileUp as FileUpIcon
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { downloadAsPDF } from "@/lib/utils";

function GradingInterface({ assignment }: { assignment: any }) {
    const queryClient = useQueryClient();
    const { data: submissions, isLoading } = useQuery({
        queryKey: ['submissions', assignment.id],
        queryFn: async () => {
            const res = await api.get(`/assignments/${assignment.id}/submissions`);
            return res.data?.data || res.data || [];
        }
    });

    const gradeMutation = useMutation({
        mutationFn: async ({ submissionId, grade, feedback }: any) => {
            const res = await api.post(`/assignments/submissions/${submissionId}/grade`, { grade, feedback });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Grade saved successfully");
            queryClient.invalidateQueries({ queryKey: ['submissions', assignment.id] });
        }
    });

    const handleSaveGrade = (submissionId: string, grade: string, feedback: string) => {
        gradeMutation.mutate({ submissionId, grade, feedback });
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Inbox className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Submissions Yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">
                    Students haven't submitted this assignment yet. Once they do, their work will appear here for grading.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Add Mock Submission
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {submissions.map((sub: any) => (
                    <SubmissionCard key={sub.id} submission={sub} onSave={handleSaveGrade} maxScore={assignment.maxScore} />
                ))}
            </div>
        </div>
    );
}

function SubmissionCard({ submission, onSave, maxScore }: any) {
    const [grade, setGrade] = useState(submission.grade || "");
    const [feedback, setFeedback] = useState(submission.feedback || "");

    return (
        <Card className="border border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm hover:border-indigo-500 transition-all">
            <div className="flex flex-col md:flex-row">
                <div className="p-8 flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border border-slate-100 shadow-sm">
                            <AvatarImage src={submission.student?.user?.avatar} />
                            <AvatarFallback className="bg-slate-50 text-slate-400 font-black text-xs">
                                {submission.student?.user?.name?.substring(0, 2).toUpperCase() || "ST"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-black text-slate-900 text-base tracking-tight">{submission.student?.user?.name || "Student Entity"}</h4>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Submitted {new Date(submission.submittedAt).toLocaleDateString()}</p>
                        </div>
                        {submission.status === 'LATE' && (
                            <span className="bg-rose-50 text-rose-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100 ml-auto">Late Entry</span>
                        )}
                    </div>

                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                        <p className="text-slate-600 leading-relaxed text-sm font-medium">
                            {submission.content || "No textual data provided."}
                        </p>
                        {submission.attachments && submission.attachments.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {submission.attachments.map((att: string, i: number) => (
                                    <a key={i} href={att} target="_blank" rel="noreferrer" className="text-[9px] flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                                        <FileText className="w-3 h-3" /> Artifact {i + 1}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 w-full md:w-80 bg-slate-50 border-l border-slate-100 flex flex-col gap-6">
                    <div>
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Assessment Score</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="font-black text-xl h-12 bg-white border-slate-200 rounded-xl text-slate-900 text-center focus:ring-indigo-500/20"
                                placeholder="0"
                            />
                            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">/ {maxScore || 100}</span>
                        </div>
                    </div>
 
                    <div className="flex-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Critical Feedback</Label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="bg-white border-slate-200 min-h-[100px] rounded-xl text-slate-900 font-medium text-sm resize-none focus:ring-indigo-500/20 p-4"
                            placeholder="Synthesize feedback..."
                        />
                    </div>

                    <Button onClick={() => onSave(submission.id, grade, feedback)} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-indigo-600/10 border-none transition-all">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                        Finalize Assessment
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export function AssignmentsTab() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignments Command</h1>
                    <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mt-1">Orchestrate and manage student production pipelines</p>
                </div>
            </div>

            <Tabs defaultValue="generator" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-10 h-12 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <TabsTrigger value="list" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-slate-500">Deployment Grid</TabsTrigger>
                    <TabsTrigger value="generator" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-slate-500 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        AI Synthesis
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-0 outline-none">
                    <AssignmentsList />
                </TabsContent>

                <TabsContent value="generator" className="mt-0 outline-none">
                    <AssignmentGenerator />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AssignmentGenerator() {
    const [selectedBoard, setSelectedBoard] = useState("CBSE");
    const [selectedGrade, setSelectedGrade] = useState("10");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [topicId, setTopicId] = useState("");
    const [assignmentType, setAssignmentType] = useState("Homework");
    const [difficulty, setDifficulty] = useState("Medium");
    const [detailLevel, setDetailLevel] = useState([50]);
    const [pdfText, setPdfText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: metadata } = useQuery({
        queryKey: ['curriculum-metadata', selectedBoard, selectedGrade],
        queryFn: async () => {
            const res = await api.get(`/curriculum/metadata?curriculum=${selectedBoard}&class=${selectedGrade}`);
            return res.data;
        }
    });

    const subjectsList = metadata?.topics ? Object.keys(metadata.topics) : [];
    const topicsList = (selectedSubject && metadata?.topics?.[selectedSubject]) || [];

    const generateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/assignments/generate', { ...data, pdfText });
            return res;
        },
        onSuccess: (res) => {
            if (res.success) {
                setGeneratedContent(res.data);
                toast.success("Assignment generated successfully!");
            } else {
                toast.error(res.error || "Failed to generate assignment");
            }
        }
    });

    const handleGenerate = (textOverride?: string) => {
        if (!topicId) {
            toast.error("Please select a topic.");
            return;
        }

        generateMutation.mutate({
            topic: topicId,
            subject: selectedSubject || "General",
            grade: selectedGrade,
            curriculum: selectedBoard,
            assignmentType,
            difficultyLevel: difficulty,
            detailLevel: detailLevel[0],
            pdfText: textOverride !== undefined ? textOverride : pdfText
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("[ASSIGNMENT SYNTH] Selected context artifact:", file.name, file.size);

        if (file.size > 50 * 1024 * 1024) {
            toast.error("Artifact exceeds 50MB limit. Optimization required.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        const loadingToast = toast.loading(`Transmitting artifact: ${file.name}...`);

        try {
            console.log("[ASSIGNMENT SYNTH] Transmitting to /upload/pdf...");
            const res = await api.post('/upload/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (p) => {
                    const progress = Math.round((p.loaded * 100) / (p.total || 1));
                    console.log(`[ASSIGNMENT SYNTH] Transmission progress: ${progress}%`);
                }
            });

            console.log("[ASSIGNMENT SYNTH] Transmission response:", res);

            if (res.success) {
                const text = res.data.text;
                setPdfText(text);
                toast.success(`Context inherited: ${res.data.originalName || file.name}`, { id: loadingToast });
                
                if (topicId) {
                    console.log("[ASSIGNMENT SYNTH] Active topic detected. Auto-synthesizing...");
                    toast.info("Auto-triggering synthesis protocol...");
                    handleGenerate(text);
                }
            } else {
                toast.error(res.error || "Context extraction failed.", { id: loadingToast });
            }
        } catch (err: any) {
            console.error("[ASSIGNMENT SYNTH] CRITICAL FAILURE:", err);
            const errorMsg = err.response?.data?.error || err.message || "Network failure during transmission.";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleDownload = () => {
        if (!generatedContent) return;
        const title = generatedContent.title || "Assignment";
        let content = `${generatedContent.title}\n\n`;
        content += `Description: ${generatedContent.description || 'N/A'}\n\n`;
        
        if (generatedContent.assignmentQuestions?.length > 0) {
            content += `QUESTIONS:\n`;
            generatedContent.assignmentQuestions.forEach((q: string, i: number) => {
                content += `${i + 1}. ${q}\n`;
            });
            content += `\n`;
        }

        if (generatedContent.activityQuestions?.length > 0) {
            content += `ACTIVITIES:\n`;
            generatedContent.activityQuestions.forEach((q: string, i: number) => {
                content += `${i + 1}. ${q}\n`;
            });
        }

        downloadAsPDF(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`, title, content);
        toast.success("Assignment exported as PDF!");
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
            {/* 1. CONFIGURATION SIDEBAR */}
            <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mission Parameters</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-xs hover:bg-white transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    {["CBSE", "ICSE", "SSC"].map(b => (
                                        <SelectItem key={b} value={b} className="font-bold text-xs">{b}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-xs hover:bg-white transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    {[...Array(12)].map((_, i) => (
                                        <SelectItem key={i} value={(i + 1).toString()} className="font-bold text-xs">Gr. {i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject Domain</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-xs hover:bg-white transition-all">
                                <SelectValue placeholder="Select subject..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                                {subjectsList.map(s => (
                                    <SelectItem key={s} value={s} className="font-bold text-xs">{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topic Node</Label>
                        <Select value={topicId} onValueChange={setTopicId} disabled={!selectedSubject}>
                            <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm hover:bg-white transition-all disabled:opacity-50">
                                <SelectValue placeholder="Select specific topic..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                                {topicsList.map((t: string) => (
                                    <SelectItem key={t} value={t} className="font-bold text-xs">{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Format</Label>
                            <Select value={assignmentType} onValueChange={setAssignmentType}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-xs hover:bg-white transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="Homework" className="font-bold text-xs">Homework</SelectItem>
                                    <SelectItem value="Worksheet" className="font-bold text-xs">Worksheet</SelectItem>
                                    <SelectItem value="Project" className="font-bold text-xs">Project</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</Label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-xs hover:bg-white transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="Easy" className="font-bold text-xs text-emerald-600">Fundamental</SelectItem>
                                    <SelectItem value="Medium" className="font-bold text-xs text-indigo-600">Standard</SelectItem>
                                    <SelectItem value="Hard" className="font-bold text-xs text-rose-600">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Intelligence Depth</Label>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 shadow-sm">{detailLevel}%</span>
                        </div>
                        <Slider value={detailLevel} onValueChange={setDetailLevel} max={100} step={5} className="py-2" />
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Context Injection</Label>
                        <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                        <Button 
                            variant="outline" 
                            className={`w-full h-12 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all ${pdfText ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500'}`}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileUpIcon className="w-4 h-4 mr-2" />}
                            {pdfText ? 'Context Architecture Synced' : 'Inject Contextual PDF'}
                        </Button>
                    </div>

                    <Button
                        onClick={() => handleGenerate()}
                        disabled={generateMutation.isPending}
                        className="w-full h-12 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-indigo-600/20 border-none transition-all active:scale-[0.98] flex gap-2 items-center justify-center"
                    >
                        {generateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Initialize Synthesis
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* 2. SYNTHESIS RESULTS VIEWPORT */}
            <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] overflow-hidden">
                {generatedContent ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-4 justify-between bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-xl text-slate-900 tracking-tight">{generatedContent.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Strategic Mission Protocol
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                                        {assignmentType} · {difficulty}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Button 
                                    onClick={handleDownload}
                                    className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] border-none transition-all gap-2"
                                >
                                    <Download className="w-4 h-4" /> Export PDF
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-auto space-y-10">
                            {/* Strategic Overview */}
                            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/20 rounded-full -mr-12 -mt-12" />
                                <h4 className="font-black text-indigo-600 uppercase tracking-widest text-[10px] mb-3 relative z-10 flex items-center gap-2">
                                    <Settings2 className="w-3.5 h-3.5" /> Implementation Guidelines
                                </h4>
                                <p className="text-slate-700 font-bold text-sm leading-relaxed relative z-10">
                                    {generatedContent.description || "No strategic instructions provided."}
                                </p>
                            </div>

                            {/* Content Nodes */}
                            <div className="space-y-12">
                                {generatedContent.mcqs && generatedContent.mcqs.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-slate-100" />
                                            <h4 className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Section A: Objective Assessment</h4>
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {generatedContent.mcqs.map((q: any, i: number) => (
                                                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <h4 className="text-base font-black text-slate-900 leading-tight tracking-tight pt-1">{q.question}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2.5">
                                                        {q.options.map((opt: string, optIdx: number) => (
                                                            <div key={optIdx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700">
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase">{String.fromCharCode(65 + optIdx)}.</span>
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {generatedContent.assignmentQuestions && generatedContent.assignmentQuestions.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-slate-100" />
                                            <h4 className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Section B: Subjective Discovery</h4>
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </div>
                                        <div className="space-y-4">
                                            {generatedContent.assignmentQuestions.map((q: string, i: number) => (
                                                <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group items-center">
                                                    <span className="font-black text-indigo-600 text-sm opacity-40">0{i + 1}</span>
                                                    <span className="text-slate-800 font-bold text-base leading-tight tracking-tight">{q}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {generatedContent.activityQuestions && generatedContent.activityQuestions.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-slate-100" />
                                            <h4 className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Section C: Tactical Execution</h4>
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </div>
                                        <div className="space-y-4">
                                            {generatedContent.activityQuestions.map((q: string, i: number) => (
                                                <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group items-center">
                                                    <span className="font-black text-emerald-600 text-sm opacity-40">0{i + 1}</span>
                                                    <span className="text-slate-800 font-bold text-base leading-tight tracking-tight">{q}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Instructor Protocol */}
                            {generatedContent.answers && (
                                <div className="pt-10 border-t border-slate-100">
                                    <h4 className="font-black text-emerald-600 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                                        Master Intelligence Protocol
                                    </h4>
                                    <div className="bg-emerald-50/30 p-8 rounded-3xl border border-emerald-100">
                                        <div className="space-y-6">
                                            {generatedContent.mcqs?.map((q: any, i: number) => (
                                                <div key={`mcq-${i}`} className="flex gap-4 items-start">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 font-black text-[10px] shadow-sm border border-emerald-100 shrink-0">M{i + 1}</div>
                                                    <p className="text-slate-700 font-bold text-sm pt-1.5">Correct: <span className="text-emerald-600 uppercase">{q.answer}</span></p>
                                                </div>
                                            ))}
                                            {generatedContent.answers.assignmentQuestions?.map((a: string, i: number) => (
                                                <div key={`ans-${i}`} className="flex gap-4 items-start">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 font-black text-[10px] shadow-sm border border-emerald-100 shrink-0">Q{i + 1}</div>
                                                    <p className="text-slate-700 font-bold text-sm pt-1.5">{a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[600px]">
                        <div className="text-center space-y-6 max-w-sm mx-auto">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm mx-auto">
                                <Sparkles className="w-10 h-10 text-indigo-600 opacity-20" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black text-2xl text-slate-900 tracking-tight">Synthesis Pending</h3>
                                <p className="text-xs font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
                                    Configure the mission parameters and initialize synthesis
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

function AssignmentsList() {
    const [gradingAssignment, setGradingAssignment] = useState<any>(null);

    const { data: assignments, isLoading } = useQuery({
        queryKey: ['assignments'],
        queryFn: async () => {
            const res = await api.get('/assignments');
            return res.data?.data || res.data || [];
        }
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                        <p className="font-black uppercase tracking-[0.2em] text-[9px]">Syncing Deployment Grid...</p>
                    </div>
                ) : assignments?.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <Inbox className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Grid Empty</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">Initialize assignments via AI synthesis</p>
                    </div>
                ) : assignments?.map((asn: any) => (
                    <Card key={asn.id} className="border border-slate-200 shadow-sm bg-white hover:border-indigo-500 hover:shadow-md transition-all rounded-3xl overflow-hidden group">
                        <CardContent className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                    {asn.subject?.name || 'Academic'}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{asn.title}</h3>
                            <p className="text-xs text-slate-500 mb-8 line-clamp-2 font-medium leading-relaxed">{asn.description}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex items-center text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                    Due: {new Date(asn.dueDate).toLocaleDateString()}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-black text-[9px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl px-4"
                                    onClick={() => setGradingAssignment(asn)}
                                >
                                    Assess <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grading Dialog */}
            <Dialog open={!!gradingAssignment} onOpenChange={(open) => !open && setGradingAssignment(null)}>
                <DialogContent className="max-w-5xl max-h-[90vh] bg-white border-slate-200 p-0 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                    <DialogHeader className="p-8 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <div>
                                <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Assessment Console</DialogTitle>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Evaluating: {gradingAssignment?.title}</p>
                            </div>
                            <span className="text-[9px] font-black text-indigo-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm uppercase tracking-widest">{gradingAssignment?.subject?.name || 'Academic'}</span>
                        </div>
                    </DialogHeader>
                    <div className="p-8 overflow-y-auto flex-1">
                        {gradingAssignment && <GradingInterface assignment={gradingAssignment} />}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
