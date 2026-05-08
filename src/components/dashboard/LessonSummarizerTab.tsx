import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
    Loader2, 
    Upload, 
    FileText, 
    CheckCircle2, 
    Copy, 
    X, 
    Text, 
    Download, 
    Sparkles,
    BrainCircuit,
    Zap,
    FileSearch,
    BookMarked,
    RefreshCw,
    ChevronRight
} from "lucide-react";
import api from "@/api/client";
import { toast } from "sonner";
import { downloadAsPDF } from "@/lib/utils";

/**
 * COMPACT PREMIUM EDUCATIONAL AI WORKSPACE
 * Redesigned for maximum efficiency, tight content density, and elegant aesthetics.
 */
export function LessonSummarizerTab() {
    const [mode, setMode] = useState<"upload" | "text">("upload");
    const [file, setFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);
    const [processingStep, setProcessingStep] = useState(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const steps = [
        "Analyzing content...",
        "Extracting concepts...",
        "Structuring notes...",
        "Finalizing..."
    ];

    useEffect(() => {
        let interval: any;
        if (status === "processing") {
            setProcessingStep(0);
            interval = setInterval(() => {
                setProcessingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
            }, 1800);
        }
        return () => clearInterval(interval);
    }, [status]);

    const validateAndSetFile = (selectedFile: File) => {
        if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
            toast.error("Please upload a valid PDF.");
            return;
        }
        if (selectedFile.size > 50 * 1024 * 1024) {
            toast.error("File exceeds 50MB.");
            return;
        }
        setFile(selectedFile);
        setResult(null);
        setStatus("idle");
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (mode !== "upload") return;
        if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
    };

    const handleSummarize = async () => {
        if (mode === "upload" && !file) return toast.error("Select a PDF first.");
        if (mode === "text" && !textInput.trim()) return toast.error("Enter some text.");

        setStatus("uploading");
        setResult(null);

        try {
            let res;
            if (mode === "upload" && file) {
                const formData = new FormData();
                formData.append('file', file);
                res = await api.post('/lessons/summarize-pdf', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        if (Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)) === 100) setStatus("processing");
                    }
                });
            } else {
                setStatus("processing");
                res = await api.post('/lessons/summarize', { text: textInput });
            }

            if (res.success) {
                setResult(res.data);
                setStatus("success");
                toast.success("Synthesis complete.");
            } else {
                setStatus("error");
                toast.error(res.error || "Failed.");
            }
        } catch (error: any) {
            setStatus("error");
            toast.error(error.response?.data?.error || "Error.");
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const title = mode === "upload" && file ? file.name.replace('.pdf', '') : "Summary";
        let content = "EXECUTIVE SUMMARY:\n\n" + (result.overview || "") + "\n\n";
        downloadAsPDF(`${title.replace(/[^a-z0-9]/gi, '_')}_summary.pdf`, title, content);
        toast.success("Exported!");
    };

    const reset = () => { setFile(null); setTextInput(""); setResult(null); setStatus("idle"); };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* COMPACT HEADER */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                            <BrainCircuit className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Lesson Summarizer</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">AI Educational Workspace</p>
                        </div>
                    </div>
                    {result && (
                        <Button variant="ghost" onClick={reset} className="h-9 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600">
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Reset
                        </Button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!result && (status === "idle" || status === "error") && (
                        <motion.div 
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                        >
                            <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden border-2">
                                <CardContent className="p-6 space-y-6">
                                    {/* COMPACT TABS */}
                                    <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => setMode("upload")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === "upload" ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400"}`}
                                        >
                                            <Upload className="w-3.5 h-3.5" /> PDF
                                        </button>
                                        <button
                                            onClick={() => setMode("text")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === "text" ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400"}`}
                                        >
                                            <Text className="w-3.5 h-3.5" /> Text
                                        </button>
                                    </div>

                                    {mode === "upload" ? (
                                        <div
                                            className={`border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[220px] ${isDragOver ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200'}`}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                                            {!file ? (
                                                <>
                                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-indigo-500">
                                                        <FileSearch className="w-6 h-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-black text-slate-900">Drop PDF artifact here</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Maximum 50MB per file</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-4 w-full px-4">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg"><FileText className="w-5 h-5" /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-slate-900 truncate">{file.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Staged for processing</p>
                                                    </div>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:text-rose-600" onClick={(e) => { e.stopPropagation(); setFile(null); }}><X className="w-4 h-4" /></Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Textarea
                                            placeholder="Paste material for AI synthesis..."
                                            className="min-h-[220px] bg-slate-50 border-slate-200 rounded-2xl p-5 text-sm resize-none focus:ring-indigo-500/10 transition-all font-medium border-2"
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                        />
                                    )}

                                    <Button
                                        onClick={handleSummarize}
                                        disabled={(!file && !textInput)}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-indigo-100 transition-all gap-2"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> Generate Summary
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {(status === "uploading" || status === "processing") && (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{steps[processingStep]}</p>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                            {/* RESULTS CARD */}
                            <Card className="bg-white border-slate-200 shadow-xl rounded-[2rem] overflow-hidden border-2">
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Zap className="w-4 h-4" /></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Synthesis Complete</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 text-[9px] font-black uppercase tracking-widest rounded-lg border-slate-200 hover:bg-slate-50">
                                                <Download className="w-3 h-3 mr-2" /> PDF
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(result.overview); toast.success("Copied!"); }} className="h-8 text-[9px] font-black uppercase tracking-widest rounded-lg border-slate-200 hover:bg-slate-50">
                                                <Copy className="w-3 h-3 mr-2" /> Copy
                                            </Button>
                                        </div>
                                    </div>

                                    {/* OVERVIEW */}
                                    <div className="space-y-3">
                                        <p className="text-lg font-black text-slate-900 leading-tight tracking-tight italic">"{result.overview}"</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {/* CONCEPTS */}
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                            <h5 className="text-[9px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-indigo-500" /> Concepts</h5>
                                            <div className="flex flex-wrap gap-1.5">
                                                {result.keyConcepts?.slice(0, 5).map((c: any, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-white text-slate-600 text-[9px] font-black rounded border border-slate-100 uppercase">{c}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* VOCAB */}
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                            <h5 className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-500" /> Vocabulary</h5>
                                            <div className="space-y-2">
                                                {result.definitions?.slice(0, 2).map((d: any, i: number) => (
                                                    <p key={i} className="text-[10px] font-bold text-slate-600 leading-tight"><span className="text-slate-900 font-black uppercase">{d.term}:</span> {d.meaning}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* REVISION NOTES */}
                                    <div className="space-y-4 pt-2">
                                        <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400" /> Key Revision Points</h5>
                                        <div className="grid grid-cols-1 gap-2">
                                            {result.revisionNotes?.slice(0, 4).map((n: string, i: number) => (
                                                <div key={i} className="flex gap-3 items-start p-3 bg-white rounded-xl border border-slate-100 group transition-all hover:border-indigo-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-bold text-slate-600 leading-tight">{n}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ACTIVITIES */}
                                    <div className="pt-2">
                                        <div className="p-5 bg-slate-900 rounded-2xl space-y-4 border-2 border-indigo-500/20">
                                            <h5 className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Student Activities</h5>
                                            <div className="space-y-2">
                                                {result.activities?.slice(0, 2).map((a: string, i: number) => (
                                                    <div key={i} className="flex gap-3 items-center group">
                                                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">{i+1}</div>
                                                        <p className="text-xs font-bold text-slate-300 flex-1">{a}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
