import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Timer,
    CheckCircle2,
    AlertCircle,
    X,
    Sparkles,
    Brain,
    Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/api/client";

export default function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${id}`);
                const found = res.data;
                if (found) {
                    const questions = typeof found.questions === 'string' ? JSON.parse(found.questions) : found.questions;
                    setQuiz({ ...found, questions });
                } else {
                    toast.error("Quiz not found");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load quiz");
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted && !isLoading) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted, isLoading]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (option: string) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: option
        }));
    };

    const handleSubmit = () => {
        if (isSubmitted) return;
        setIsSubmitted(true);
        toast.success("Quiz completed!");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] pointer-events-none" />
                <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-[2rem] border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                        <Brain className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-white font-black text-2xl tracking-tighter uppercase">Analyzing Curriculum</p>
                        <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase animate-pulse">Fetching smart assessments...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || !quiz.questions) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-600/5 blur-[120px] pointer-events-none" />
                <div className="bg-slate-900/50 backdrop-blur-3xl p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-white/10 relative z-10">
                    <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Quiz Not Found</h2>
                    <p className="text-slate-400 font-medium mb-10">This assessment is no longer available or was moved.</p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs border-none shadow-2xl shadow-indigo-600/20">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[150px]" />
            </div>

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-3xl border-b border-white/5 transition-all">
                <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/dashboard')}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1.5">{quiz.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{quiz.subjectName || 'General Knowledge'}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                            <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`} />
                            <span className={`font-mono text-2xl font-black tracking-tighter ${timeLeft < 60 ? 'text-rose-400' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        {!isSubmitted && (
                            <Button
                                onClick={handleSubmit}
                                className="h-14 px-8 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/20 border-none uppercase tracking-widest text-[10px] hidden sm:flex"
                            >
                                Submit Assessment
                            </Button>
                        )}
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 w-full bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full max-w-4xl"
                    >
                        {/* Question Card */}
                        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
                            {/* Decorative elements inside card */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors duration-700" />
                            
                            <div className="relative z-10">
                                <div className="mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                        <Brain className="w-3.5 h-3.5" />
                                        Inquiry Mode
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.1]">
                                        {currentQuestion.question}
                                    </h2>
                                </div>

                                <div className="grid gap-5">
                                    {currentQuestion.options.map((option: string, index: number) => {
                                        const isSelected = userAnswers[currentQuestionIndex] === option;
                                        const isCorrect = isSubmitted && option === currentQuestion.correctAnswer;
                                        const isWrong = isSubmitted && isSelected && option !== currentQuestion.correctAnswer;

                                        return (
                                            <motion.button
                                                key={index}
                                                whileHover={!isSubmitted ? { scale: 1.01, x: 10 } : {}}
                                                whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                                                onClick={() => handleOptionSelect(option)}
                                                disabled={isSubmitted}
                                                className={`
                                                    group relative w-full p-6 md:p-8 rounded-[2rem] border-2 text-left transition-all duration-400 flex items-center gap-6 overflow-hidden
                                                    ${isSelected ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}
                                                    ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/50' : ''}
                                                    ${isWrong ? 'bg-rose-500/10 border-rose-500/50' : ''}
                                                `}
                                            >
                                                {/* Selection Indicator Background */}
                                                {isSelected && <div className="absolute inset-0 bg-indigo-600/5 animate-pulse" />}
                                                
                                                <div className={`
                                                    w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all border-2 shrink-0 z-10
                                                    ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/40' : 'bg-slate-950 text-slate-500 border-white/10 group-hover:border-indigo-500/50 group-hover:text-indigo-400'}
                                                    ${isCorrect ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/40' : ''}
                                                    ${isWrong ? 'bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-500/40' : ''}
                                                `}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                
                                                <span className={`text-xl md:text-2xl font-bold transition-all z-10 leading-snug ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'} ${isCorrect ? 'text-emerald-400' : ''} ${isWrong ? 'text-rose-400' : ''}`}>
                                                    {option}
                                                </span>
                                                
                                                {(isSelected || isCorrect || isWrong) && (
                                                    <div className="ml-auto z-10">
                                                        {isCorrect ? <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"><CheckCircle2 className="w-6 h-6 text-emerald-400" /></div> :
                                                            isWrong ? <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-400 text-lg font-black">✕</div> :
                                                                <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]" />}
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Controls */}
            <footer className="sticky bottom-0 bg-slate-950/80 backdrop-blur-3xl border-t border-white/5 p-6 md:p-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-20">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
                    <Button
                        variant="ghost"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        className="h-16 px-8 rounded-2xl font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-4 uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft className="w-6 h-6" /> <span className="hidden sm:inline">Back</span>
                    </Button>

                    <div className="hidden md:flex gap-3">
                        {quiz.questions.map((_: any, i: number) => (
                            <div
                                key={i}
                                onClick={() => setCurrentQuestionIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === currentQuestionIndex ? 'w-12 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                                        userAnswers[i] ? 'w-4 bg-indigo-500/30' : 'w-4 bg-white/10 hover:bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-4">
                        {currentQuestionIndex === quiz.questions.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitted}
                                className="h-16 px-12 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/40 border-none uppercase tracking-widest text-[10px] flex items-center gap-3"
                            >
                                <Trophy className="w-5 h-5" /> {isSubmitted ? 'Result Computed' : 'Finalize Exam'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="h-16 px-8 md:px-12 rounded-2xl font-black bg-white/5 border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all flex items-center gap-4 uppercase tracking-widest text-[10px] group shadow-2xl"
                            >
                                <span className="hidden sm:inline">Next</span> <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
