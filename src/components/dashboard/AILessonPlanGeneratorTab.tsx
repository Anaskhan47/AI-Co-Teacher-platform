import { useState } from "react";
import { AIAssistantTab } from "./AIAssistantTab";
import { LessonsTab } from "./LessonsTab";
import { Sparkles, BookOpen } from "lucide-react";

interface AILessonPlanGeneratorTabProps {
    initialMode?: "lesson" | "material" | "quiz";
}

export function AILessonPlanGeneratorTab({ initialMode = "lesson" }: AILessonPlanGeneratorTabProps) {
    const [activeSubTab, setActiveSubTab] = useState<"generate" | "library">("generate");
    const [preloadedLesson, setPreloadedLesson] = useState<any>(null);

    const handleLessonSelect = (lesson: any) => {
        setPreloadedLesson(lesson);
        setActiveSubTab("generate");
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Curriculum Designer</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-3 italic">Autonomous Pedagogical Synthesis Engine</p>
                </div>

                {/* Modern Sub-Tab Switcher */}
                <div className="flex p-1.5 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
                    <button
                        onClick={() => {
                            setActiveSubTab("generate");
                            setPreloadedLesson(null);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeSubTab === "generate"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Synthesize New</span>
                    </button>
                    <button
                        onClick={() => setActiveSubTab("library")}
                        className={cn(
                            "flex items-center gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeSubTab === "library"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                        )}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Resource Library</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                {activeSubTab === "generate" ? (
                    <AIAssistantTab
                        initialMode={initialMode}
                        preloadedResult={preloadedLesson}
                    />
                ) : (
                    <LessonsTab onLessonSelect={handleLessonSelect} />
                )}
            </div>
        </div>
    );
}
