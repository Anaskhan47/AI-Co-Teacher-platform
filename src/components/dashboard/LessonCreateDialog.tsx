import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import api from "@/api/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function LessonCreateDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [boards, setBoards] = useState<string[]>([]);
    const grades = Array.from({ length: 12 }, (_, i) => i + 1);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [topicsMap, setTopicsMap] = useState<Record<string, string[]>>({});

    const [formData, setFormData] = useState({
        curriculum: "",
        grade: "",
        subject: "",
        topic: "",
        title: "",
        aiAssist: true
    });

    const queryClient = useQueryClient();

    // Load boards on mount
    useEffect(() => {
        api.get("/curriculum/boards").then(res => setBoards(res.data || []));
    }, []);

    // Load subjects/topics when board+grade changes
    useEffect(() => {
        if (formData.curriculum && formData.grade) {
            api.get(`/curriculum/metadata`, { params: { curriculum: formData.curriculum, class: formData.grade } })
                .then(res => {
                    setSubjects(res.data?.subjects || []);
                    setTopicsMap(res.data?.topics || {});
                })
                .catch(() => {
                    setSubjects([]);
                    setTopicsMap({});
                });
        }
    }, [formData.curriculum, formData.grade]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/lessons", formData);
            toast.success("Lesson plan created successfully!");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
        } catch (error) {
            toast.error("Failed to create lesson plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 h-9 text-xs font-bold shadow-lg shadow-indigo-600/20 border-none transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/5 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-8 border-b border-white/5 bg-white/5">
                    <DialogTitle className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Plus className="w-5 h-5 text-indigo-500" />
                        Create Artifact
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Curriculum Framework</Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, curriculum: v, subject: "", topic: "" })}>
                            <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl text-white font-bold text-xs">
                                <SelectValue placeholder="Select Board" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                {boards.map(b => <SelectItem key={b} value={b} className="font-bold text-xs">{b}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Grade Level</Label>
                            <Select disabled={!formData.curriculum} onValueChange={(v) => setFormData({ ...formData, grade: v, subject: "", topic: "" })}>
                                <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl text-white font-bold text-xs">
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                    {grades.map(g => <SelectItem key={g} value={g.toString()} className="font-bold text-xs">{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject Area</Label>
                            <Select disabled={!formData.grade} value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v, topic: "" })}>
                                <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl text-white font-bold text-xs">
                                    <SelectValue placeholder="Subject" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                    {subjects.map(s => <SelectItem key={s} value={s} className="font-bold text-xs">{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Topic</Label>
                        <Select disabled={!formData.subject} value={formData.topic} onValueChange={(v) => setFormData({ ...formData, topic: v })}>
                            <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl text-white font-bold text-xs">
                                <SelectValue placeholder="Select Topic" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                {(formData.subject ? (topicsMap[formData.subject] || []) : []).map(t => (
                                    <SelectItem key={t} value={t} className="font-bold text-xs">{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Lesson Identity</Label>
                        <Input
                            placeholder="e.g. Introduction to Atoms"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="h-14 bg-white/5 border-white/10 rounded-xl text-white font-bold text-xs placeholder:text-slate-600"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 h-14 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 mt-4 border-none" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                        {formData.aiAssist ? "Synthesize with AI" : "Initialize Empty Plan"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
