import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Sparkles, 
    Loader2, 
    Download, 
    Printer, 
    FileText, 
    Settings2, 
    ChevronLeft,
    ScrollText,
    History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { downloadAsPDF } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function QuestionPaperTab() {
    const [formData, setFormData] = useState({
        subject: "",
        grade: "10",
        marks: "80",
        difficulty: "Moderate",
        examType: "Final Examination",
        syllabus: ""
    });
    const [paper, setPaper] = useState<any>(null);
    const [activeView, setActiveView] = useState<"paper" | "scheme">("paper");
    const [pdfText, setPdfText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: subjects } = useQuery({
        queryKey: ['curriculum', 'CBSE', formData.grade],
        queryFn: async () => {
            const res = await api.get('/curriculum/metadata', {
                params: { curriculum: "CBSE", class: formData.grade }
            });
            return res.data?.data || res.data;
        },
        enabled: !!formData.grade
    });

    const generateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/exams/generate', { ...data, pdfText });
            return res;
        },
        onSuccess: (res) => {
            if (res.success) {
                setPaper(res.data);
                toast.success("Examination paper generated successfully!");
            } else {
                toast.error(res.error || "Failed to generate paper");
            }
        }
    });

    const handleGenerate = (textOverride?: string) => {
        if (!formData.subject) {
            toast.error("Please select a subject");
            return;
        }
        generateMutation.mutate({ ...formData, pdfText: textOverride !== undefined ? textOverride : pdfText });
    };

    const handleDownload = () => {
        if (!paper) return;
        
        let content = `# ${paper.title}\n`;
        content += `Subject: ${formData.subject} | Grade: ${formData.grade}\n`;
        content += `Time: 3 Hours | Total Marks: ${paper.totalMarks}\n\n`;
        content += `Instructions:\n${paper.instructions}\n\n`;

        paper.sections.forEach((section: any) => {
            content += `\n${section.name}\n${"=".repeat(section.name.length)}\n\n`;
            section.questions.forEach((q: any, i: number) => {
                content += `${q.id || `Q${i+1}`}. ${q.q} [${q.marks} Marks]\n`;
                if (q.options) {
                    q.options.forEach((opt: string, optIdx: number) => {
                        content += `   ${String.fromCharCode(65 + optIdx)}) ${opt}\n`;
                    });
                }
                content += `\n`;
            });
        });

        if (activeView === 'scheme') {
            content += `\n\nMARKING SCHEME\n${"=".repeat(14)}\n${paper.markingScheme}`;
        }

        downloadAsPDF(`${paper.title.replace(/[^a-z0-9]/gi, '_')}.pdf`, paper.title, content);
        toast.success("Examination paper exported!");
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Examination Builder</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-3 italic">Institutional Assessment Synthesis Protocol</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => handleGenerate()}
                        disabled={!formData.subject || generateMutation.isPending}
                        className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] px-10 rounded-2xl shadow-lg shadow-indigo-600/20 border-none transition-all group"
                    >
                        {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />}
                        {generateMutation.isPending ? "Synthesizing..." : "Generate Paper"}
                    </Button>
                </div>
            </div>

            {/* Configuration Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-white border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Grade */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Grade Level</Label>
                                    <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v, subject: "" })}>
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-indigo-500/20 transition-all">
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(g => (
                                                <SelectItem key={g} value={g} className="text-xs font-bold text-slate-700">Class {g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject</Label>
                                    <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-indigo-500/20 transition-all">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            {subjects?.subjects?.map((s: string) => (
                                                <SelectItem key={s} value={s} className="text-xs font-bold text-slate-700">{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Exam Type */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Exam Category</Label>
                                    <Select value={formData.examType} onValueChange={(v) => setFormData({ ...formData, examType: v })}>
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-indigo-500/20 transition-all">
                                            <SelectValue placeholder="Exam Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            {["Unit Test", "Monthly Assessment", "Mid-Term", "Final Examination", "Mock Exam"].map(t => (
                                                <SelectItem key={t} value={t} className="text-xs font-bold text-slate-700">{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Syllabus Scope */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Syllabus Scope</Label>
                                    <Input
                                        placeholder="e.g. Chapters 1-4, Algebra & Geometry Fundamentals"
                                        value={formData.syllabus}
                                        onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold focus:ring-2 ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                {/* Context PDF */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contextual Material (Optional)</Label>
                                    <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploading(true);
                                        const formDataFile = new FormData();
                                        formDataFile.append('file', file);
                                        api.post('/upload/pdf', formDataFile).then(res => {
                                            if (res.success) {
                                                setPdfText(res.data.text);
                                                toast.success("Academic context synchronized");
                                            }
                                        }).finally(() => setIsUploading(false));
                                    }} />
                                    <Button 
                                        variant="outline" 
                                        className={cn(
                                            "w-full h-12 border-dashed rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            pdfText ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                        )}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                                        {pdfText ? 'Context Synced' : 'Attach Reference PDF'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-white border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Marks</Label>
                            <Input
                                type="number"
                                value={formData.marks}
                                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Complexity</Label>
                            <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="Easy" className="text-[10px] font-black uppercase text-emerald-600">Standard (Easy)</SelectItem>
                                    <SelectItem value="Moderate" className="text-[10px] font-black uppercase text-indigo-600">Standard (Moderate)</SelectItem>
                                    <SelectItem value="Hard" className="text-[10px] font-black uppercase text-rose-600">Standard (Hard)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Document Workspace */}
            <div className="relative pt-10 border-t border-slate-200/60">
                {paper && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <button
                                onClick={() => setActiveView("paper")}
                                className={cn(
                                    "px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeView === "paper" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-500 hover:text-indigo-600"
                                )}
                            >
                                Question Paper
                            </button>
                            <button
                                onClick={() => setActiveView("scheme")}
                                className={cn(
                                    "px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeView === "scheme" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-500 hover:text-indigo-600"
                                )}
                            >
                                Marking Scheme
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" onClick={handleDownload} className="h-12 w-12 bg-white border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all">
                                <Printer className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleDownload} className="h-12 w-12 bg-white border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all">
                                <Download className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {paper ? (
                        <motion.div
                            key="paper-view"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            className="max-w-[850px] mx-auto bg-white border border-slate-200 shadow-2xl rounded-sm p-16 min-h-[1100px] relative font-serif ring-1 ring-slate-900/5"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
                            
                            {activeView === 'paper' ? (
                                <div className="space-y-12 text-slate-900">
                                    <div className="text-center space-y-3 pb-10 border-b border-slate-900/10">
                                        <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900 font-sans">Institutional Examination</h1>
                                        <h2 className="text-base font-bold text-slate-600 uppercase font-sans tracking-widest">{paper.title}</h2>
                                        <div className="flex justify-between items-end pt-10 font-sans text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                                            <div className="text-left space-y-1.5">
                                                <p>Subject: <span className="text-slate-900">{formData.subject}</span></p>
                                                <p>Grade: <span className="text-slate-900">Class {formData.grade}</span></p>
                                            </div>
                                            <div className="text-right space-y-1.5">
                                                <p>Duration: <span className="text-slate-900">180 Minutes</span></p>
                                                <p>Max. Marks: <span className="text-slate-900">{paper.totalMarks}</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50/80 border border-slate-200/60 rounded-xl space-y-2 font-sans">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">General Instructions:</p>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                                            {paper.instructions}
                                        </p>
                                    </div>

                                    <div className="space-y-16">
                                        {paper.sections.map((section: any, idx: number) => (
                                            <div key={idx} className="space-y-8">
                                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] text-center py-4 border-y border-slate-900/5 bg-slate-50/30 font-sans">
                                                    {section.name}
                                                </h3>
                                                <div className="space-y-10">
                                                    {section.questions.map((q: any, qIdx: number) => (
                                                        <div key={qIdx} className="flex items-start justify-between gap-8 group">
                                                            <div className="flex gap-6 flex-1">
                                                                <span className="font-bold text-slate-900 text-sm min-w-[2rem] font-sans">Q{qIdx + 1}.</span>
                                                                <div className="space-y-5">
                                                                    <p className="text-[15px] text-slate-900 leading-relaxed font-serif">
                                                                        {q.q}
                                                                    </p>
                                                                    {q.options && (
                                                                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-2">
                                                                            {q.options.map((opt: string, optIdx: number) => (
                                                                                <div key={optIdx} className="text-xs text-slate-700 flex items-start gap-4 font-sans">
                                                                                    <span className="font-black text-slate-300">({String.fromCharCode(97 + optIdx)})</span>
                                                                                    <span className="font-medium">{opt}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-sans border-b-2 border-slate-900/5 pb-1 self-start">
                                                                [{q.marks}]
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-20 text-center">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">--- End of Examination Document ---</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-12 text-slate-900 font-sans">
                                    <div className="text-center pb-10 border-b border-slate-900/10">
                                        <h1 className="text-2xl font-black uppercase tracking-[0.2em]">Evaluation Guide</h1>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4">{paper.title}</p>
                                    </div>
                                    
                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 border-l-4 border-indigo-600 pl-4">Model Solutions Matrix</h3>
                                            <div className="grid gap-4">
                                                {Object.entries(paper.answerKey || {}).map(([qId, ans]: any) => (
                                                    <div key={qId} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex gap-6 items-start transition-all hover:bg-indigo-50/30">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0 text-sm shadow-sm">{qId}</div>
                                                        <div className="space-y-1.5">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected Response</p>
                                                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{ans}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-12 border-t border-slate-100">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 border-l-4 border-indigo-600 pl-4">Marking Rubrics</h3>
                                            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl">
                                                <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-loose italic">
                                                    {paper.markingScheme}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in duration-700">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-slate-200 flex items-center justify-center shadow-xl mb-8 group transition-all hover:scale-110">
                                <ScrollText className="w-10 h-10 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight uppercase">Ready for Synthesis</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 max-w-xs leading-loose">
                                Define the pedagogical scope in the configuration panel to generate institutional grade assessments
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
    );
}
