import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2, ChevronRight, X } from "lucide-react";
import api from '@/api/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contentToProcess?: string;
}

export function QuickActionDialog({ open, onOpenChange, contentToProcess }: QuickActionDialogProps) {
    const [action, setAction] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAction = async (value: string) => {
        setAction(value);
        if (value === 'summarize') {
            await performSummarize();
        }
    };

    const performSummarize = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const res = await api.post('/lessons/summarize', { text: contentToProcess });
            setResult(res.data);
            toast.success("Summary generated!");
        } catch (error) {
            toast.error("Failed to process content");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-slate-950 border-white/5 text-white p-0 overflow-hidden shadow-2xl rounded-[2.5rem]">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <DialogTitle className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                            <Sparkles className="w-5 h-5 text-indigo-500" /> AI Accelerator
                        </DialogTitle>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl" onClick={() => onOpenChange(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Directive</label>
                        <Select value={action} onValueChange={handleAction}>
                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-indigo-500/50 h-14 rounded-xl font-bold text-xs">
                                <SelectValue placeholder="Command selection..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                <SelectItem value="summarize" className="font-bold text-xs">Summarize Content</SelectItem>
                                <SelectItem value="vocab" disabled className="font-bold text-xs">Extract Lexicon (Beta)</SelectItem>
                                <SelectItem value="quiz" disabled className="font-bold text-xs">Generate Assessment (Beta)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-950/50 border-t border-slate-800/50 p-6 flex flex-col items-center justify-center text-center"
                        >
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                            <p className="text-sm text-slate-400 animate-pulse">Analyzing content...</p>
                        </motion.div>
                    )}

                    {result && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border-t border-white/5 p-8 max-h-[60vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="mb-8">
                                <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Executive Summary</h4>
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <p className="text-slate-300 text-sm font-medium leading-relaxed">{result.overview}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Key Intel</h4>
                                <ul className="space-y-3">
                                    {(result.keyPoints || []).map((pt: string, i: number) => (
                                        <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300 font-medium">
                                            <span className="text-emerald-500 font-black">#</span>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {result.actionItems && (
                                <div>
                                    <h4 className="text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Directives</h4>
                                    <ul className="space-y-3">
                                        {(result.actionItems || []).map((pt: string, i: number) => (
                                            <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300 font-medium">
                                                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
