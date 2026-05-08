import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, Share2, Plus, Sparkles, Wand2, Layers, Presentation, BookOpen, GraduationCap, Clock, Upload } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/client";
import pptxgen from "pptxgenjs";

export function PPTGeneratorTab() {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [numSlides, setNumSlides] = useState('5');
    const [curriculum, setCurriculum] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPPT, setGeneratedPPT] = useState<any>(null);
    const [pdfText, setPdfText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async (textOverride?: string) => {
        if (!topic || !grade || !curriculum) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsGenerating(true);
        const loadingToast = toast.loading("Synthesizing educational intelligence...");

        try {
            const res = await api.post('/materials/generate-ppt', {
                topic,
                grade,
                curriculum,
                slideCount: parseInt(numSlides),
                pdfText: textOverride || pdfText
            });

            if (res.success) {
                setGeneratedPPT(res.data);
                toast.success("Presentation synthesized successfully!", { id: loadingToast });
            } else {
                toast.error(res.error || "Synthesis failed.", { id: loadingToast });
            }
        } catch (err: any) {
            toast.error("Network failure during synthesis.", { id: loadingToast });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            toast.error("Artifact exceeds 50MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        const loadingToast = toast.loading(`Transmitting artifact...`);

        try {
            const res = await api.post('/upload/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.success) {
                setPdfText(res.data.text);
                toast.success(`Context inherited: ${file.name}`, { id: loadingToast });
                if (topic && grade && curriculum) handleGenerate(res.data.text);
            } else {
                toast.error(res.error || "Extraction failed.", { id: loadingToast });
            }
        } catch (err: any) {
            toast.error("Network failure during transmission.", { id: loadingToast });
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleDownload = async () => {
        if (!generatedPPT) return;

        const pres = new pptxgen();
        pres.title = generatedPPT.title;

        generatedPPT.slides.forEach((slide: any) => {
            const pptSlide = pres.addSlide();
            
            if (slide.layout === 'organic_title') {
                pptSlide.background = { color: '0F172A' };
                pptSlide.addText(slide.title, { 
                    x: 1, y: 1.5, w: '80%', h: 1.5, 
                    fontSize: 44, bold: true, color: 'FFFFFF', 
                    align: pres.AlignH.center, transform: { uppercase: true } 
                });
                pptSlide.addText(slide.subtitle_1, { 
                    x: 1, y: 3.2, w: '80%', 
                    fontSize: 14, color: '818CF8', 
                    align: pres.AlignH.center, bold: true 
                });
                pptSlide.addText(slide.subtitle_2, { 
                    x: 1, y: 3.5, w: '80%', 
                    fontSize: 10, color: '64748B', 
                    align: pres.AlignH.center 
                });
            } else if (slide.layout === 'timeline_process') {
                pptSlide.background = { color: '0F172A' };
                pptSlide.addText(slide.title, { 
                    x: 0.5, y: 0.5, w: '90%', 
                    fontSize: 32, bold: true, color: 'FFFFFF', transform: { uppercase: true } 
                });
                
                (slide.content || []).forEach((point: string, i: number) => {
                    pptSlide.addText(`0${i+1} ${point}`, { 
                        x: 0.8, y: 1.5 + (i * 0.8), w: '85%', 
                        fontSize: 18, color: '94A3B8', 
                        bullet: true 
                    });
                });
            } else {
                pptSlide.background = { color: '0F172A' };
                pptSlide.addText("End of Transmission", { 
                    x: 1, y: 2, w: '80%', 
                    fontSize: 48, bold: true, color: 'FFFFFF', align: pres.AlignH.center 
                });
            }
        });

        pres.writeFile({ fileName: `${topic.replace(/\s+/g, '_')}_Presentation.pptx` })
            .then(() => toast.success("PowerPoint artifact synthesized and downloaded!"))
            .catch(() => toast.error("Failed to compile PowerPoint artifact."));
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
            {/* SaaS Header Alignment */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Presentation Synthesis</h1>
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs mt-1">Generate classroom-ready educational artifacts instantly</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
                {/* 1. CONFIGURATION SIDEBAR */}
                <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Presentation Topic</Label>
                            <Input
                                placeholder="e.g. Solar System, Photosynthesis..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Curriculum Standard</Label>
                            <Select value={curriculum} onValueChange={setCurriculum}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20">
                                    <SelectValue placeholder="Select Template..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    <SelectItem value="cbse" className="font-bold text-xs">CBSE (Central Board)</SelectItem>
                                    <SelectItem value="icse" className="font-bold text-xs">ICSE (In-Depth)</SelectItem>
                                    <SelectItem value="igcse" className="font-bold text-xs">IGCSE (International)</SelectItem>
                                    <SelectItem value="ib" className="font-bold text-xs">IB (Bilingual)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target Grade Level</Label>
                            <Select value={grade} onValueChange={setGrade}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20">
                                    <SelectValue placeholder="Select Grade..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    {[6, 7, 8, 9, 10, 11, 12].map(g => (
                                        <SelectItem key={g} value={g.toString()} className="font-bold text-xs">Grade {g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Presentation Length</Label>
                            <Select value={numSlides} onValueChange={setNumSlides}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20">
                                    <SelectValue placeholder="5 Nodes" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    <SelectItem value="3" className="font-bold text-xs">3 Slides (Summary)</SelectItem>
                                    <SelectItem value="5" className="font-bold text-xs">5 Slides (Standard)</SelectItem>
                                    <SelectItem value="8" className="font-bold text-xs">8 Slides (Detailed)</SelectItem>
                                    <SelectItem value="10" className="font-bold text-xs">10 Slides (Comprehensive)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Context Inheritance</Label>
                            <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                            <Button 
                                variant="outline" 
                                className={`w-full h-12 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all ${pdfText ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500'}`}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                {pdfText ? 'Context Inherited' : 'Add Context (PDF)'}
                            </Button>
                        </div>

                        <Button
                            onClick={() => handleGenerate()}
                            disabled={isGenerating}
                            className="w-full h-12 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-indigo-600/20 border-none transition-all gap-3"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            {isGenerating ? "Synthesizing..." : "Generate Presentation"}
                        </Button>
                    </CardContent>
                </Card>

                {/* 2. SYNTHESIS VIEWPORT */}
                <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {generatedPPT ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 space-y-10"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Synthesized Artifact</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{generatedPPT.title}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            onClick={handleDownload}
                                            className="h-11 px-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-800 transition-all gap-2 border-none"
                                        >
                                            <Download className="w-4 h-4" /> Export .PPTX
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-12 pb-10">
                                    {generatedPPT.slides.map((slide: any, idx: number) => (
                                        <div key={idx} className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-px flex-1 bg-slate-100" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Slide {idx + 1}</span>
                                                <div className="h-px flex-1 bg-slate-100" />
                                            </div>
                                            <Card className="bg-slate-900 rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl flex flex-col relative border-none mx-auto w-full">
                                                <div className="absolute inset-0 z-0">
                                                    <img src={slide.image} alt="Background" className="w-full h-full object-cover opacity-20" />
                                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-transparent" />
                                                </div>

                                                <div className="relative z-10 flex flex-col h-full p-8 md:p-12">
                                                    {slide.layout === 'organic_title' ? (
                                                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                                                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase mb-6">{slide.title}</h2>
                                                            <div className="w-16 h-1.5 bg-indigo-500 rounded-full mb-8 shadow-lg shadow-indigo-500/50" />
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">{slide.subtitle_1}</p>
                                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">{slide.subtitle_2}</p>
                                                            </div>
                                                        </div>
                                                    ) : slide.layout === 'timeline_process' ? (
                                                        <div className="flex flex-col h-full">
                                                            <div className="mb-6">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                                                    {slide.tag || "Core Concept"}
                                                                </span>
                                                                <h2 className="text-xl md:text-3xl font-black text-white mt-4 uppercase leading-tight">{slide.title}</h2>
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-center space-y-3">
                                                                {(slide.content || []).map((point: string, i: number) => (
                                                                    <div key={i} className="flex gap-4 items-start group">
                                                                        <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-indigo-400">
                                                                            {i + 1}
                                                                        </div>
                                                                        <p className="text-slate-300 font-medium text-sm leading-relaxed pt-1.5">{point}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                                                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6">Conclusion</h2>
                                                            <div className="w-20 h-1.5 bg-indigo-500 rounded-full" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[600px]">
                                <div className="text-center space-y-6 max-w-sm mx-auto">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm mx-auto">
                                        <Presentation className="w-10 h-10 text-indigo-600 opacity-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">No Artifact Generated</h3>
                                        <p className="text-xs font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
                                            Configure the panel and synthesize your classroom presentation
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </div>
    );
}
