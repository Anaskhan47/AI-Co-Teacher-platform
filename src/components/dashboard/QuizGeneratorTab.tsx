import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Save, Send, Trash2, CheckCircle2, ChevronRight, Trophy, Clock, Zap, Target } from "lucide-react";
import { toast } from "sonner";
import { downloadAsPDF } from "@/lib/utils";

export function QuizGeneratorTab() {
    const [selectedGrade, setSelectedGrade] = useState("10");
    const [topicId, setTopicId] = useState("");
    const [questionType, setQuestionType] = useState("MCQ");
    const [questions, setQuestions] = useState<any[]>([]);

    const [instituteName, setInstituteName] = useState("");
    const [quizTitle, setQuizTitle] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("Beginner");
    const [numQuestions, setNumQuestions] = useState(5);
    const [showPreview, setShowPreview] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    
    const [pdfText, setPdfText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: subjects } = useQuery({
        queryKey: ['curriculum', 'CBSE', selectedGrade],
        queryFn: async () => {
            const res = await api.get('/curriculum/metadata', {
                params: { curriculum: "CBSE", class: selectedGrade }
            });
            return res.data?.data || res.data;
        },
        enabled: !!selectedGrade
    });

    const queryClient = useQueryClient();

    const generateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/quizzes/generate', { ...data, pdfText });
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                setQuestions(res.data.questions);
                setIsReviewMode(false);
                setShowPreview(false);
                toast.success(`Synthesized ${res.data.questions.length} intelligence nodes!`);
            } else {
                toast.error(res.error || "Failed to generate quiz");
            }
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/quizzes/save', data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Intelligence protocol archived.");
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        }
    });

    const handleGenerate = (textOverride?: string) => {
        if (!topicId) {
            toast.error("Enter topic protocol first.");
            return;
        }

        let bloomLevel = "Remember";
        if (difficultyLevel === "Intermediate") bloomLevel = "Apply";
        if (difficultyLevel === "Advanced") bloomLevel = "Evaluate";
        if (difficultyLevel === "Mixed") bloomLevel = "Mixed";

        generateMutation.mutate({
            topic: topicId,
            subject: "General",
            grade: selectedGrade,
            curriculum: "CBSE",
            count: numQuestions,
            questionType,
            bloomLevel,
            instituteName,
            quizTitle,
            pdfText: textOverride !== undefined ? textOverride : pdfText
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("[QUIZ SYNTH] Selected context artifact:", file.name, file.size);

        if (file.size > 50 * 1024 * 1024) {
            toast.error("Artifact exceeds 50MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        const loadingToast = toast.loading(`Transmitting artifact: ${file.name}...`);

        try {
            console.log("[QUIZ SYNTH] Transmitting to /upload/pdf...");
            const res = await api.post('/upload/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (p) => {
                    const progress = Math.round((p.loaded * 100) / (p.total || 1));
                    console.log(`[QUIZ SYNTH] Transmission progress: ${progress}%`);
                }
            });

            console.log("[QUIZ SYNTH] Transmission response:", res);

            if (res.success) {
                const text = res.data.text;
                setPdfText(text);
                toast.success(`Context inherited: ${res.data.originalName || file.name}`, { id: loadingToast });
                
                if (topicId) {
                    console.log("[QUIZ SYNTH] Active topic detected. Auto-synthesizing...");
                    toast.info("Auto-triggering synthesis protocol...");
                    handleGenerate(text);
                }
            } else {
                toast.error(res.error || "Context extraction failed.", { id: loadingToast });
            }
        } catch (err: any) {
            console.error("[QUIZ SYNTH] CRITICAL FAILURE:", err);
            const errorMsg = err.response?.data?.error || err.message || "Network failure during transmission.";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, optIndex: number, value: string) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        const oldValue = newOptions[optIndex];

        if (newQuestions[qIndex].correctAnswer === oldValue) {
            newQuestions[qIndex].correctAnswer = value;
        }

        newOptions[optIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setQuestions(newQuestions);
    };

    const handleDownload = () => {
        if (questions.length === 0) return;
        const title = quizTitle || `Quiz_${topicId || 'General'}`;
        let content = `${instituteName ? instituteName.toUpperCase() + '\n' : ''}${title.toUpperCase()}\n\n`;
        
        questions.forEach((q, i) => {
            content += `Q${i + 1}: ${q.question}\n`;
            if (q.options) {
                q.options.forEach((opt: string, optIdx: number) => {
                    content += `   ${String.fromCharCode(65 + optIdx)}) ${opt}\n`;
                });
            }
            content += `Correct Answer: ${q.correctAnswer}\n\n`;
        });

        downloadAsPDF(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`, title, content);
        toast.success("Quiz exported as PDF!");
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    // 1. Play Mode (KBC)
    if (showPreview) {
        return <QuizPreview questions={questions} topic={topicId || 'General Intelligence'} onClose={() => setShowPreview(false)} />;
    }

    // 2. Quiz Generated - Selection Screen
    if (questions.length > 0 && !isReviewMode) {
        return (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 py-12">
                <Button variant="ghost" onClick={() => setQuestions([])} className="font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-white transition-colors">
                    ← Terminate Current Session
                </Button>

                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] border border-indigo-500/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-600/20">
                        <CheckCircle2 className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter">Synthesis Complete</h2>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Quiz on <span className="text-indigo-400 font-black uppercase tracking-widest">{topicId}</span> is ready for review.
                        Select execution protocol:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card
                        className="group bg-white/5 border border-white/10 rounded-[3rem] hover:border-indigo-500/30 cursor-pointer transition-all hover:scale-[1.02] shadow-2xl"
                        onClick={() => setIsReviewMode(true)}
                    >
                        <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600/20 transition-all border border-white/5">
                                <Trash2 className="w-8 h-8 text-slate-500 group-hover:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Review Editor</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">Modify intelligence nodes and refine options</p>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-transparent text-white font-black uppercase tracking-widest text-[10px] group-hover:bg-white/5">
                                Open Console
                            </Button>
                        </CardContent>
                    </Card>

                    <Card
                        className="group bg-indigo-600 border border-indigo-500/50 rounded-[3rem] cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_50px_rgba(79,70,229,0.3)] relative overflow-hidden"
                        onClick={() => setShowPreview(true)}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                        <CardContent className="p-12 flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Execute Simulation</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100 mt-2">Elite student interface with real-time feedback</p>
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-white text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 shadow-xl">
                                Launch Simulation 🚀
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // 3. Initial Form
    if (questions.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Quiz Synthesizer</h1>
                    <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mt-1">Generate high-fidelity interactive assessments instantly</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
                    {/* CONFIGURATION SIDEBAR */}
                    <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Institute Name</Label>
                                <Input
                                    placeholder="e.g. Elite Academy..."
                                    value={instituteName}
                                    onChange={(e) => setInstituteName(e.target.value)}
                                    className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz Title</Label>
                                <Input
                                    placeholder="e.g. Advanced Thermodynamics..."
                                    value={quizTitle}
                                    onChange={(e) => setQuizTitle(e.target.value)}
                                    className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topic Protocol</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. Nuclear Fission..."
                                        value={topicId}
                                        onChange={(e) => setTopicId(e.target.value)}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20 flex-1"
                                    />
                                    <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        className={`h-12 w-12 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-2xl shrink-0 transition-all ${pdfText ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500'}`}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    </Button>
                                </div>
                                {pdfText && <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Context Inherited ✓</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Intelligence Format</Label>
                                <Select value={questionType} onValueChange={setQuestionType}>
                                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                        <SelectItem value="MCQ" className="font-bold text-xs">MCQ (Multiple Choice)</SelectItem>
                                        <SelectItem value="True/False" className="font-bold text-xs">True/False Logic</SelectItem>
                                        <SelectItem value="Short Answer" className="font-bold text-xs">Short Text Probe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty Gradient</Label>
                                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                        <SelectItem value="Beginner" className="font-bold text-xs">Level 01: Beginner</SelectItem>
                                        <SelectItem value="Intermediate" className="font-bold text-xs">Level 02: Intermediate</SelectItem>
                                        <SelectItem value="Advanced" className="font-bold text-xs">Level 03: Advanced</SelectItem>
                                        <SelectItem value="Mixed" className="font-bold text-xs">Layered: Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Node Volume</Label>
                                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setNumQuestions(prev => Math.max(1, prev - 1))}
                                        className="h-10 w-10 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                                    >
                                        <span className="text-lg font-black">-</span>
                                    </Button>
                                    <div className="flex-1 text-center font-black text-lg text-indigo-600 tracking-tighter">
                                        {numQuestions} Nodes
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setNumQuestions(prev => Math.min(20, prev + 1))}
                                        className="h-10 w-10 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                                    >
                                        <span className="text-lg font-black">+</span>
                                    </Button>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleGenerate()}
                                disabled={generateMutation.isPending}
                                className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl w-full shadow-lg shadow-indigo-600/20 border-none transition-all mt-4"
                            >
                                {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {generateMutation.isPending ? "Generating..." : "Initiate Synthesis"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* PREVIEW VIEWPORT */}
                    <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex items-center justify-center p-8">
                        <div className="text-center space-y-6 max-w-sm mx-auto">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm mx-auto">
                                <Target className="w-10 h-10 text-indigo-600 opacity-20" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black text-2xl text-slate-900 tracking-tight">System Ready</h3>
                                <p className="text-xs font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
                                    Configure your intelligence protocol to synthesize an interactive quiz
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // 4. Editor / Review Mode
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <Button variant="ghost" onClick={() => setIsReviewMode(false)} className="font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 p-0 mb-2">
                        ← Back to selection
                    </Button>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Intelligence Editor</h1>
                    <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mt-1">Manual refinement of synthesized nodes</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className="h-11 px-6 rounded-xl border-slate-200 bg-white text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                    <Button
                        className="h-11 px-6 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
                        onClick={() => setShowPreview(true)}
                    >
                        <Send className="w-4 h-4 mr-2" /> Simulation
                    </Button>
                    <Button
                        onClick={() => saveMutation.mutate({ title: quizTitle || "Archived Quiz", topicId, questions })}
                        className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] border-none transition-all"
                        disabled={saveMutation.isPending}
                    >
                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Archive
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-4xl">
                {questions.map((q, idx) => (
                    <Card key={idx} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group relative transition-all hover:border-indigo-200">
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={() => removeQuestion(idx)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Node {idx + 1} — {q.type || 'MCQ'}</Label>
                                <Textarea
                                    value={q.question}
                                    onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                                    className="font-black text-slate-900 bg-transparent border-none shadow-none focus-visible:ring-0 p-0 resize-none min-h-[60px] text-lg md:text-xl tracking-tight leading-snug placeholder:text-slate-300"
                                    placeholder="Enter intelligence query..."
                                />
                            </div>

                            {(q.type === 'MCQ' || !q.type) && q.options && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] border transition-all ${opt === q.correctAnswer ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <Input
                                                value={opt}
                                                onChange={(e) => updateOption(idx, i, e.target.value)}
                                                className={`h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:ring-indigo-500/20 ${opt === q.correctAnswer ? 'ring-2 ring-indigo-500/50 border-indigo-200' : ''}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                
                <Button variant="outline" className="w-full h-20 border-slate-200 border-dashed bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-[2rem] hover:bg-white hover:text-slate-600 transition-all gap-4">
                    <Plus className="w-5 h-5" /> Append Intelligence Node
                </Button>
            </div>
        </div>
    );
}

function QuizPreview({ questions, topic, onClose }: { questions: any[], topic: string, onClose: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
    const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
    const [hintText, setHintText] = useState("");

    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const topRef = useRef<HTMLDivElement>(null);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    useEffect(() => {
        if (showResult || isLocked) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) { clearInterval(timer); handleTimeUp(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentIndex, showResult, isLocked]);

    useEffect(() => {
        setIsLocked(false);
        setShowFeedback(false);
        setSelectedOption(null);
        setTimeLeft(30);
        setHiddenOptions([]);
        setHintText("");
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentIndex]);

    const handleTimeUp = () => {
        setIsLocked(true);
        setShowFeedback(true);
        setTimeout(() => nextQuestion(), 2000);
    };

    const handleOptionSelect = (option: string) => {
        if (isLocked) return;
        setSelectedOption(option);
    };

    const submitAnswer = () => {
        if (!selectedOption || isLocked) return;
        setIsLocked(true);
        setTimeout(() => {
            const isCorrect = selectedOption === currentQuestion.correctAnswer;
            if (isCorrect) setScore(prev => prev + 1);
            setUserAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));
            setShowFeedback(true);
            setTimeout(() => nextQuestion(), 2000);
        }, 800);
    };

    const nextQuestion = () => {
        if (isLastQuestion) {
            generateAISuggestions();
            setShowResult(true);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const useFiftyFifty = () => {
        if (fiftyFiftyUsed || isLocked) return;
        const correctIndex = currentQuestion.options.findIndex((opt: string) => opt === currentQuestion.correctAnswer);
        const wrongIndices = currentQuestion.options.map((_: any, idx: number) => idx).filter((idx: number) => idx !== correctIndex);
        const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
        setHiddenOptions(toHide);
        setFiftyFiftyUsed(true);
    };

    const useHint = () => {
        if (hintText || isLocked) return;
        const hints = [
            "Use foundational reasoning: focus on the core subject logic.",
            "Analyzing topic nodes: The answer aligns with standard curriculum parameters.",
            "Eliminating static noise: Focus on the primary directive mentioned in the query.",
            "Data parity check: Recall the fundamental laws governing this intelligence layer."
        ];
        setHintText(hints[Math.floor(Math.random() * hints.length)]);
    };

    const generateAISuggestions = () => {
        const percentage = (score / questions.length) * 100;
        const suggestions = percentage >= 80 
            ? [`Peak intelligence parity: ${score}/${questions.length} nodes verified.`, "Strengths: Perfect logic execution across complex queries.", "Command: Initiate Grade 11 advanced protocols."]
            : percentage >= 50
            ? [`Standard parity achieved: ${score}/${questions.length} nodes verified.`, "Weaknesses: Minority logic gaps in application layers.", "Command: Refine knowledge graph in Chapter 4."]
            : [`Critical failure: Only ${score}/${questions.length} nodes verified.`, "Weaknesses: Fundamental intelligence nodes disconnected.", "Command: Re-initiate baseline educational modules."];
        setAiSuggestions(suggestions);
    };

    if (showResult) {
        return (
            <div ref={topRef} className="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-700">
                <Card className="bg-slate-950 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col justify-center ring-1 ring-white/5">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-emerald-600/10 pointer-events-none opacity-50" />
                    
                    <CardContent className="p-16 text-center relative z-10">
                        <div className="mb-12">
                            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Quiz Summary</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-4">Simulation Transmission Result</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {[
                                { label: 'Verification', val: `${score}/${questions.length}`, color: 'text-indigo-400' },
                                { label: 'Parity Rate', val: `${Math.round((score / questions.length) * 100)}%`, color: 'text-emerald-400' },
                                { label: 'Class Rank', val: 'Elite', color: 'text-violet-400' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</div>
                                    <div className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 text-left relative overflow-hidden mb-12">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                            <h3 className="flex items-center gap-3 text-xl font-black text-white uppercase tracking-tight mb-8">
                                <Sparkles className="w-6 h-6 text-indigo-400" /> AI Quiz Report
                            </h3>
                            <ul className="space-y-6">
                                {aiSuggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                        <span className="font-medium text-lg leading-relaxed">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            <Button
                                onClick={() => { setCurrentIndex(0); setUserAnswers({}); setScore(0); setFiftyFiftyUsed(false); setShowResult(false); }}
                                className="h-14 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl shadow-indigo-600/20"
                            >
                                Re-Execute Simulation
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="h-14 px-12 border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10"
                            >
                                Terminate Console
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div ref={topRef} className="max-w-5xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
            {/* Simulation Header */}
            <div className="flex items-center justify-between bg-slate-950 border border-white/10 p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" onClick={onClose} className="w-12 h-12 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 p-0">
                        <XIcon className="w-6 h-6" />
                    </Button>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Target Node</div>
                        <div className="font-black text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{topic}</div>
                    </div>
                </div>

                <div className="flex items-center gap-12">
                    <div className="text-center">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Verification</div>
                        <div className="font-black text-2xl text-white tracking-tighter">{currentIndex + 1}<span className="text-slate-600 text-sm ml-1">/ {questions.length}</span></div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Parity</div>
                        <div className="font-black text-2xl text-emerald-400 tracking-tighter">{score}</div>
                    </div>
                </div>
            </div>

            {/* Simulation Progress */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <motion.div
                    className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>

            {/* Query Card */}
            <div className="flex-1 flex flex-col justify-center py-6">
                <Card className="border border-white/10 bg-white/5 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-xl mb-10 ring-1 ring-white/5">
                    <CardContent className="p-16 text-center">
                        <h3 className="text-3xl font-black text-white leading-tight tracking-tight uppercase">
                            {currentQuestion.question}
                        </h3>
                    </CardContent>
                </Card>

                {/* AI Intervention */}
                <AnimatePresence>
                    {hintText && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-10 max-w-2xl mx-auto w-full"
                        >
                            <div className="bg-indigo-600 rounded-[2rem] p-6 shadow-2xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-6 relative">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-100 opacity-70 mb-1">AI Recommendation</div>
                                    <p className="text-white font-black text-sm uppercase tracking-wider">{hintText}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setHintText("")} className="text-white/50 hover:text-white rounded-full">
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Option Nodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentQuestion.options?.map((opt: string, i: number) => {
                        if (hiddenOptions.includes(i)) return <div key={i} className="invisible" />;
                        const isSelected = selectedOption === opt;
                        const isCorrect = opt === currentQuestion.correctAnswer;
                        const label = String.fromCharCode(65 + i);

                        let style = "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20";
                        let badgeStyle = "bg-slate-900 text-slate-500 border-white/10";

                        if (isLocked) {
                            if (showFeedback) {
                                if (isCorrect) { style = "bg-emerald-600 border-emerald-500 text-white shadow-2xl shadow-emerald-600/30 scale-[1.02]"; badgeStyle = "bg-white/20 text-white border-white/20"; }
                                else if (isSelected) { style = "bg-rose-600 border-rose-500 text-white shadow-2xl shadow-rose-600/30"; badgeStyle = "bg-white/20 text-white border-white/20"; }
                                else { style = "bg-white/5 border-white/5 text-slate-700 opacity-30"; }
                            } else if (isSelected) {
                                style = "bg-indigo-500 border-indigo-400 text-white shadow-2xl shadow-indigo-500/30 animate-pulse";
                                badgeStyle = "bg-white/20 text-white border-white/20";
                            } else { style = "bg-white/5 border-white/5 text-slate-700 opacity-30"; }
                        } else if (isSelected) {
                            style = "bg-indigo-600/20 border-indigo-500/50 text-white ring-1 ring-indigo-500/50";
                            badgeStyle = "bg-indigo-600 text-white border-indigo-500";
                        }

                        return (
                            <button
                                key={i}
                                disabled={isLocked}
                                onClick={() => handleOptionSelect(opt)}
                                className={`group w-full text-left p-8 rounded-[2rem] font-black text-lg transition-all duration-300 flex items-center gap-6 border ${style} uppercase tracking-tight`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border transition-all ${badgeStyle}`}>
                                    {label}
                                </div>
                                <span className="leading-tight">{opt}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sim Controls */}
            <div className="flex items-center justify-between pt-6">
                <div className="flex gap-4">
                    <Button
                        disabled={fiftyFiftyUsed || isLocked}
                        onClick={useFiftyFifty}
                        variant="outline"
                        className={`h-14 px-8 border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${fiftyFiftyUsed ? 'opacity-30 grayscale' : 'hover:border-indigo-500/30 text-slate-400 hover:text-white hover:bg-indigo-600/10'}`}
                    >
                        <Zap className="w-4 h-4 mr-2" /> 50:50 Parity
                    </Button>
                    <Button
                        disabled={!!hintText || isLocked}
                        onClick={useHint}
                        variant="outline"
                        className={`h-14 px-8 border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${!!hintText ? 'opacity-30 grayscale' : 'hover:border-indigo-500/30 text-slate-400 hover:text-white hover:bg-indigo-600/10'}`}
                    >
                        <Target className="w-4 h-4 mr-2" /> Learning Hint
                    </Button>
                </div>

                {!isLocked && selectedOption && (
                    <Button
                        onClick={submitAnswer}
                        className="h-14 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl shadow-indigo-600/40 animate-in zoom-in duration-300"
                    >
                        Lock Intelligence 🔒
                    </Button>
                )}

                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-black text-xl uppercase tracking-widest"
                    >
                        {userAnswers[currentIndex] === currentQuestion.correctAnswer ? (
                            <span className="text-emerald-400">Parity Verified ✓</span>
                        ) : (
                            <span className="text-rose-400">Logic Error ✗</span>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function XIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    )
}
