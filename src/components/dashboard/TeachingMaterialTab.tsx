import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Sparkles, Loader2, BookOpen, Presentation, ClipboardList, Upload } from "lucide-react";
import { toast } from "sonner";
import { downloadAsFile, downloadAsPDF } from "@/lib/utils";

export function TeachingMaterialTab() {
    const [board, setBoard] = useState("CBSE");
    const [grade, setGrade] = useState("10");
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState("");
    const [type, setType] = useState("NOTES");
    const [generatedContent, setGeneratedContent] = useState<any>(null);

    const { data: curriculumMeta } = useQuery({
        queryKey: ['material-curriculum-meta', board, grade],
        queryFn: async () => {
            const res = await api.get('/curriculum/metadata', { params: { curriculum: board, class: grade } });
            return res.success ? res.data : { subjects: [], topics: {} };
        }
    });

    const [pdfText, setPdfText] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const generateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/materials/generate', { ...data, pdfText });
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                setGeneratedContent(res.data);
                toast.success(`${type} synthesized successfully!`);
            } else {
                toast.error(res.error || `Failed to generate ${type}`);
            }
        }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = (textOverride?: string) => {
        if (!subject || !topic) return;
        generateMutation.mutate({ 
            type, 
            curriculum: board, 
            grade, 
            subject, 
            topic,
            pdfText: textOverride !== undefined ? textOverride : pdfText
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("[TEACHING MATERIAL] Staging artifact:", file.name, file.size);

        if (file.size > 50 * 1024 * 1024) {
            toast.error("Artifact exceeds 50MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        const loadingToast = toast.loading(`Uploading context: ${file.name}...`);

        try {
            console.log("[TEACHING MATERIAL] Transmitting to /upload/pdf...");
            const res = await api.post('/upload/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (p) => {
                    const progress = Math.round((p.loaded * 100) / (p.total || 1));
                    console.log(`[TEACHING MATERIAL] Upload progress: ${progress}%`);
                }
            });

            console.log("[TEACHING MATERIAL] Response received:", res);

            if (res.success) {
                const extractedText = res.data.text;
                setPdfText(extractedText);
                toast.success(`Context inherited: ${res.data.originalName || file.name}`, { id: loadingToast });
                
                // Auto-trigger generation if topic is already selected
                if (subject && topic) {
                    console.log("[TEACHING MATERIAL] Subject/Topic detected. Auto-synthesizing...");
                    toast.info("Auto-triggering synthesis protocol...");
                    handleGenerate(extractedText);
                }
            } else {
                toast.error(res.error || "Context extraction failed.", { id: loadingToast });
            }
        } catch (err: any) {
            console.error("[TEACHING MATERIAL] CRITICAL ERROR:", err);
            const errorMsg = err.response?.data?.error || err.message || "Network failure during transmission.";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const materialTypes = [
        { id: 'NOTES', label: 'Study Notes', icon: BookOpen, accent: 'indigo', activeClasses: 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' },
        { id: 'WORKSHEET', label: 'Worksheet', icon: ClipboardList, accent: 'violet', activeClasses: 'bg-violet-600/10 border-violet-500/30 text-violet-400' },
        { id: 'PPT', label: 'PPT Outline', icon: Presentation, accent: 'amber', activeClasses: 'bg-amber-600/10 border-amber-500/30 text-indigo-400' },
    ];

    const activeType = materialTypes.find(t => t.id === type);

    const handleDownload = () => {
        if (!generatedContent) return;
        const title = generatedContent.title || "Untitled_Material";
        const content = `# ${title}\n\n${generatedContent.content}`;
        downloadAsPDF(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`, title, generatedContent.content);
        toast.success("Artifact exported as PDF!");
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Material Synthesis</h1>
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mt-1">Generate professional teaching resources with one command</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
                {/* CONFIGURATION SIDEBAR */}
                <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        {/* Material Type Selector */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Material Format</Label>
                            <div className="space-y-2">
                                {materialTypes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${type === t.id
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                                            : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${type === t.id ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
                                            <t.icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-black text-xs uppercase tracking-widest">{t.label}</span>
                                        {type === t.id && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500 shadow-sm" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject + Topic */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</Label>
                            <Select value={subject} onValueChange={(v) => { setSubject(v); setTopic(""); }}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20">
                                    <SelectValue placeholder="Select Subject..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    {curriculumMeta?.subjects?.map((s: any) => (
                                        <SelectItem key={s} value={s} className="font-bold text-xs">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topic</Label>
                            <Select value={topic} onValueChange={setTopic} disabled={!subject}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20 disabled:opacity-50">
                                    <SelectValue placeholder="Select Topic..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    {(subject ? (curriculumMeta?.topics?.[subject] || []) : []).map((t: any) => (
                                        <SelectItem key={t} value={t} className="font-bold text-xs">{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* PDF Context */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Context Inheritance</Label>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                            <Button
                                variant="outline"
                                className={`w-full h-12 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all ${pdfText ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500'}`}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                {pdfText ? 'Context Inherited ✓' : 'Upload PDF Context'}
                            </Button>
                        </div>

                        <Button
                            className="w-full h-12 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-indigo-600/20 border-none transition-all"
                            disabled={!subject || !topic || generateMutation.isPending}
                            onClick={() => handleGenerate()}
                        >
                            {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            {generateMutation.isPending ? 'Synthesizing...' : 'Generate Material'}
                        </Button>
                    </CardContent>
                </Card>

                {/* RESULT VIEWPORT */}
                <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] overflow-hidden">
                    {generatedContent ? (
                        <div className="flex flex-col h-full">
                            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                <div>
                                    <h3 className="font-black text-xl text-slate-900 tracking-tight">{generatedContent.title}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                                        {generatedContent.subjectName} · {generatedContent.topicName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600">
                                        {activeType?.label}
                                    </span>
                                    <Button 
                                        onClick={handleDownload}
                                        className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] border-none transition-all gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Export PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 p-8 overflow-auto">
                                <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm font-medium">
                                    {generatedContent.content}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[600px]">
                            <div className="text-center space-y-6 max-w-sm mx-auto">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm mx-auto">
                                    <FileText className="w-10 h-10 text-indigo-600 opacity-20" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">Synthesis Pending</h3>
                                    <p className="text-xs font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
                                        Select a format & topic to generate your teaching material
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
