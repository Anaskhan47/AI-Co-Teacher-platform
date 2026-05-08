import { useState, useRef } from 'react';
import { Upload, FileText, BarChart3, Users, MessageSquare, AlertCircle, Loader2, Sparkles, X, FileSpreadsheet, ChevronDown, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/client';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DataAnalysisTab = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysisType, setAnalysisType] = useState<string>("class_performance");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedDetailSubject, setSelectedDetailSubject] = useState<string>("");
    const [selectedImprovementSubject, setSelectedImprovementSubject] = useState<string>("");
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Chat State for "Ask Questions"
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const validExtensions = ['.csv', '.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            toast.error("Please upload a CSV or Excel file.");
            return;
        }
        setFile(file);
        setResult(null);
        toast.success(`File ${file.name} ready for analysis.`);
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast({
                title: "No file selected",
                description: "Please upload a file first.",
                variant: "destructive"
            });
            return;
        }

        setIsAnalyzing(true);

        try {
            let csvData = "";
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            if (fileExtension === '.csv') {
                // Handle CSV
                csvData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = (e) => reject(e);
                    reader.readAsText(file);
                });
            } else {
                // Handle Excel
                csvData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = e.target?.result;
                            if (!data) throw new Error("File reading failed");

                            // Use read with array type for robustness
                            const workbook = XLSX.read(data, { type: 'array' });

                            if (!workbook.SheetNames.length) throw new Error("No sheets found in Excel file");
                            const sheetName = workbook.SheetNames[0];
                            const sheet = workbook.Sheets[sheetName];

                            // Convert to CSV
                            const csv = XLSX.utils.sheet_to_csv(sheet);
                            if (!csv.trim()) throw new Error("Excel sheet appears empty");

                            resolve(csv);
                        } catch (err) {
                            console.error("Excel Parsing Error:", err);
                            reject(err instanceof Error ? err : new Error("Failed to parse Excel file"));
                        }
                    };
                    reader.onerror = (e) => {
                        console.error("FileReader Error:", e);
                        reject(new Error("Failed to read file"));
                    };
                    reader.readAsArrayBuffer(file);
                });
            }

            // Call AI endpoint

            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    title: "Session Expired",
                    description: "Please login again to continue.",
                    variant: "destructive"
                });
                setIsAnalyzing(false);
                return;
            }

            const res = await api.post('/ai/analyze-data', {
                csvData,
                analysisType
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.success) {
                setResult(res.data);
                toast.success("Analysis generated successfully!");
            } else {
                toast.error(res.error || "Failed to process data analysis.");
            }

        } catch (error: any) {
            console.error("Analysis error:", error);
            const errorMessage = error.response?.data?.error || error.message || "Something went wrong while processing the file.";
            toast.error(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Helper to get subjects list
    const getSubjects = () => result?.subjectInsights ? Object.keys(result.subjectInsights) : [];

    // Auto-select first subject when results load
    if (result && result.subjectInsights && !selectedDetailSubject) {
        const subjects = Object.keys(result.subjectInsights);
        if (subjects.length > 0) {
            if (!selectedDetailSubject) setSelectedDetailSubject(subjects[0]);
            if (!selectedImprovementSubject) setSelectedImprovementSubject(subjects[0]);
        }
    }

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            {/* Left Sidebar for Analysis Type */}
            <div className="w-80 bg-[#1e293b] p-6 flex flex-col gap-8 rounded-r-3xl my-4 text-white shadow-xl">
                <div>
                    <h3 className="text-xl font-bold mb-6 font-display">What would you like to do?</h3>
                    <div className="relative">
                        <select
                            className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 font-bold text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                            value="Perform Analysis" // Static for now as per image logic
                            onChange={() => { }}
                        >
                            <option>Perform Analysis</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Choose Analysis Type:</h4>
                    <div className="space-y-3">
                        {[
                            { id: "class_performance", label: "Class Wide Performance Analysis", icon: BarChart3 },
                            { id: "student_performance", label: "Student Wise Performance Analysis", icon: Users },
                            { id: "attendance_analysis", label: "Attendance Analysis", icon: FileText },
                            { id: "ask_questions", label: "Ask Questions To The Data", icon: MessageSquare },
                        ].map((type) => (
                            <label
                                key={type.id}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${analysisType === type.id ? 'bg-indigo-600 shadow-lg shadow-indigo-900/20' : 'hover:bg-slate-800'}`}
                            >
                                <input
                                    type="radio"
                                    name="analysisType"
                                    value={type.id}
                                    checked={analysisType === type.id}
                                    onChange={(e) => {
                                        setAnalysisType(e.target.value);
                                        setResult(null);
                                    }}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${analysisType === type.id ? 'border-white' : 'border-slate-500'}`}>
                                    {analysisType === type.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span className={`text-sm font-bold ${analysisType === type.id ? 'text-white' : 'text-slate-300'}`}>{type.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black text-slate-900 text-center mb-12 font-display">AI Assistant For Teachers</h2>

                    {!result && (
                        <div className="space-y-6">
                            {/* Upload Area */}
                            <div className="bg-[#1e293b] rounded-3xl p-8 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                <h3 className="text-white font-bold mb-4">Upload CSV file with student data</h3>

                                <div
                                    className={`border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center gap-4 transition-all ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-800/50'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".csv, .xlsx, .xls"
                                        className="hidden"
                                        onChange={handleChange}
                                    />

                                    {!file ? (
                                        <>
                                            <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-slate-300 font-bold text-lg">Drag and drop file here</p>
                                                <p className="text-slate-500 text-sm mt-1">Limit 200MB per file • CSV, Excel</p>
                                            </div>
                                            <Button
                                                onClick={() => fileInputRef.current?.click()}
                                                variant="outline"
                                                className="bg-transparent border-slate-500 text-white hover:bg-slate-700 hover:text-white font-bold"
                                            >
                                                Browse files
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <FileSpreadsheet className="w-8 h-8" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-bold text-lg">{file.name}</p>
                                                <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                            <Button
                                                onClick={() => setFile(null)}
                                                variant="ghost"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                            >
                                                <X className="w-4 h-4 mr-2" /> Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Instruction Box */}
                            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <p className="text-rose-700 text-sm font-medium leading-relaxed">
                                    Please upload a CSV or Excel file with the following columns: <span className="font-bold">Roll No, Name, Attendance</span>, and at least one <span className="font-bold">subject column</span> (e.g., Math, Science) to perform accurate analysis.
                                </p>
                            </div>

                            {file && (
                                <div className="flex justify-center pt-4">
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-md shadow-lg shadow-indigo-200"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                Bzzt Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5 mr-2" />
                                                Generate Analysis
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1e293b] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <Button onClick={() => setResult(null)} variant="ghost" className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Fallback for simple markdown response */}
                            {result.analysis && typeof result.analysis === 'string' ? (
                                <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                                    {result.analysis}
                                </div>
                            ) : (
                                <>
                                    {/* Result Rendering Based on Type */}
                                    <div className="space-y-8">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 border-b border-slate-700 pb-6">
                                            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
                                            <span className="font-mono text-slate-400">{file?.name}</span>
                                            <span className="text-slate-600 text-sm">{(file?.size || 0) / 1024 > 1024 ? ((file?.size || 0) / 1024 / 1024).toFixed(2) + ' MB' : ((file?.size || 0) / 1024).toFixed(2) + ' KB'}</span>
                                        </div>

                                        {/* 1. Student Wise Performance Analysis */}
                                        {(analysisType === "student_performance") && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                                <h2 className="text-3xl font-bold font-serif mb-4">Student Performance Report</h2>

                                                {/* Toppers Cards */}
                                                <div>
                                                    <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Top Performers</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {result.toppers?.map((student: any, idx: number) => (
                                                            <div key={idx} className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden">
                                                                <div className="absolute top-2 right-2 text-6xl font-black text-emerald-500/10">#{student.rank || idx + 1}</div>
                                                                <p className="text-emerald-300 font-bold text-lg mb-1">{student.name}</p>
                                                                <p className="text-3xl font-black text-white">{student.percentage}%</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Struggling Students */}
                                                <div>
                                                    <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Needs Attention</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {result.struggling?.map((student: any, idx: number) => (
                                                            <div key={idx} className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white font-bold">{student.name}</p>
                                                                    <p className="text-rose-300 text-sm">Needs help in: {student.needsHelpIn}</p>
                                                                </div>
                                                                <div className="text-2xl font-black text-rose-500">{student.percentage}%</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* All Students Table */}
                                                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                                    <h3 className="text-xl font-bold text-white mb-4">All Students</h3>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left text-sm text-slate-300">
                                                            <thead className="text-xs uppercase bg-slate-700/50 text-slate-400 font-bold">
                                                                <tr>
                                                                    <th className="px-4 py-3 rounded-l-lg">Name</th>
                                                                    <th className="px-4 py-3">Total Marks</th>
                                                                    <th className="px-4 py-3">Percentage</th>
                                                                    <th className="px-4 py-3">Grade</th>
                                                                    <th className="px-4 py-3 rounded-r-lg">Remarks</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-700">
                                                                {result.allStudents?.map((student: any, idx: number) => (
                                                                    <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                                                        <td className="px-4 py-3 font-bold text-white">{student.name}</td>
                                                                        <td className="px-4 py-3">{student.total}</td>
                                                                        <td className={`px-4 py-3 font-bold ${student.percentage >= 75 ? 'text-emerald-400' : student.percentage < 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                                                                            {student.percentage}%
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <span className={`px-2 py-1 rounded-md text-xs font-black ${student.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700'}`}>
                                                                                {student.grade}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3 italic opacity-80">{student.remarks}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. Attendance Analysis */}
                                        {(analysisType === "attendance_analysis") && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                                <h2 className="text-3xl font-bold font-serif mb-4">Attendance Analysis</h2>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-indigo-900/30 border border-indigo-500/30 p-8 rounded-3xl text-center">
                                                        <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm mb-2">Overall Class Attendance</p>
                                                        <p className="text-5xl font-black text-white">{result.overallAttendance}%</p>
                                                    </div>
                                                    <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl flex items-center justify-center">
                                                        <p className="text-slate-300 font-medium italic text-center">"{result.correlation}"</p>
                                                    </div>
                                                </div>

                                                {/* Low Attendance List */}
                                                <div className="bg-rose-900/10 border border-rose-500/20 rounded-2xl p-6">
                                                    <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Critical Low Attendance ({'<'}75%)</h3>
                                                    <div className="space-y-3">
                                                        {result.lowAttendanceList?.length > 0 ? (
                                                            result.lowAttendanceList.map((student: any, idx: number) => (
                                                                <div key={idx} className="flex items-center justify-between p-3 bg-rose-900/20 rounded-xl border border-rose-500/10">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-black text-xs">!</div>
                                                                        <span className="font-bold text-white">{student.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="text-rose-300 font-bold">{student.attendance}%</span>
                                                                        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{student.performanceStatus}</span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-emerald-400 font-medium py-4 text-center">No students have critically low attendance! 🎉</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Insights */}
                                                <div className="bg-slate-800/50 p-6 rounded-2xl">
                                                    <h3 className="font-bold text-white mb-4">Key Insights</h3>
                                                    <ul className="space-y-2">
                                                        {result.insights?.map((insight: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" />
                                                                {insight}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Ask Questions (Chat) */}
                                        {(analysisType === "ask_questions") && (
                                            <div className="h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4">
                                                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-900/50 rounded-2xl mb-4 border border-slate-700">
                                                    {/* Initial Context Summary */}
                                                    {result.summary && (
                                                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl mb-4">
                                                            <p className="text-indigo-200 text-sm font-medium"><Sparkles className="w-4 h-4 inline mr-2" />AI Data Context:</p>
                                                            <p className="text-slate-300 text-sm mt-1">{result.summary}</p>
                                                        </div>
                                                    )}

                                                    {chatMessages.map((msg, idx) => (
                                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                                                                <p className="text-sm font-medium">{msg.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {isChatLoading && (
                                                        <div className="flex justify-start">
                                                            <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
                                                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                                                <span className="text-xs text-slate-400">Thinking...</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-800 border-none rounded-xl py-4 pl-6 pr-14 text-white font-medium focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Ask a question about your data..."
                                                        value={chatInput}
                                                        onChange={(e) => setChatInput(e.target.value)}
                                                        onKeyDown={async (e) => {
                                                            if (e.key === 'Enter' && chatInput.trim()) {
                                                                const question = chatInput;
                                                                setChatInput("");
                                                                setChatMessages(prev => [...prev, { role: 'user', content: question }]);
                                                                setIsChatLoading(true);
                                                                try {
                                                                    // Mocking chat response for now as endpoint needs adjustment for streaming/context
                                                                    // In real imp: await api.post('/ai/chat-data', { question, context: result.summary });
                                                                    await new Promise(r => setTimeout(r, 1500));
                                                                    setChatMessages(prev => [...prev, { role: 'assistant', content: `I analyzed the data regarding "${question}". Based on the loaded dataset, here are the insights... (This is a simulated response as the chat endpoint is being integrated).` }]);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                } finally {
                                                                    setIsChatLoading(false);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Button size="icon" className="h-10 w-10 rounded-lg bg-indigo-600 hover:bg-indigo-700">
                                                            <Sparkles className="w-5 h-5 text-white" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. Class Performance (Default Fallback) */}
                                        {((analysisType === "class_performance" || (!["student_performance", "attendance_analysis", "ask_questions"].includes(analysisType))) && result.subjectInsights) && (
                                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                                {/* 1. Subjects Analysis */}
                                                <div>
                                                    <h2 className="text-3xl font-bold font-serif mb-8">Class-wide Analysis</h2>

                                                    <h3 className="text-xl font-bold text-slate-200 font-serif mb-4">Subjects Analysis</h3>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <p className="text-emerald-400 font-medium mb-3">Subjects where students are performing well:</p>
                                                            <ul className="space-y-2">
                                                                {result.summary?.performingWell?.map((item: any, idx: number) => (
                                                                    <li key={idx} className="flex items-center gap-2 text-slate-300">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                                        {item.subject}: <span className="text-white font-bold">{item.score}/100</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <p className="text-rose-400 font-medium mb-3">Subjects where students are struggling:</p>
                                                            <ul className="space-y-2">
                                                                {result.summary?.struggling?.map((item: any, idx: number) => (
                                                                    <li key={idx} className="flex items-center gap-2 text-slate-300">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                                        {item.subject}: <span className="text-white font-bold">{item.score}/100</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. Class Subject Performance */}
                                                <div>
                                                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                            <h3 className="text-xl font-bold text-slate-200">
                                                                {selectedImprovementSubject ? `${selectedImprovementSubject} Performance` : "Class Subject Performance"}
                                                            </h3>
                                                            <div className="relative min-w-[250px]">
                                                                <select
                                                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 px-4 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                                                                    value={selectedImprovementSubject}
                                                                    onChange={(e) => setSelectedImprovementSubject(e.target.value)}
                                                                >
                                                                    <option value="">Overall Class Average</option>
                                                                    {getSubjects().map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                                            <div className="bg-white text-slate-900 rounded-xl p-6 text-center shadow-lg">
                                                                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Average</p>
                                                                <p className="text-4xl font-black">
                                                                    {selectedImprovementSubject && result.subjectInsights?.[selectedImprovementSubject]
                                                                        ? result.subjectInsights[selectedImprovementSubject].average
                                                                        : result.overallStats?.average}
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-600 text-white rounded-xl p-6 text-center shadow-lg">
                                                                <p className="text-slate-300 font-bold text-sm uppercase tracking-wider mb-2">Highest</p>
                                                                <p className="text-4xl font-black">
                                                                    {selectedImprovementSubject && result.subjectInsights?.[selectedImprovementSubject]
                                                                        ? result.subjectInsights[selectedImprovementSubject].highest
                                                                        : result.overallStats?.highest?.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white text-slate-900 rounded-xl p-6 text-center shadow-lg">
                                                                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Lowest</p>
                                                                <p className="text-4xl font-black">
                                                                    {selectedImprovementSubject && result.subjectInsights?.[selectedImprovementSubject]
                                                                        ? result.subjectInsights[selectedImprovementSubject].lowest
                                                                        : result.overallStats?.lowest?.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {selectedImprovementSubject && result.subjectInsights?.[selectedImprovementSubject] && (
                                                            <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-slate-700">
                                                                <h4 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                                                    <Sparkles className="w-4 h-4" />
                                                                    Suggestions to Improve Performance in {selectedImprovementSubject}:
                                                                </h4>
                                                                <ul className="space-y-3">
                                                                    {result.subjectInsights[selectedImprovementSubject].suggestions.map((suggestion: string, idx: number) => (
                                                                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                                                            <span className="leading-relaxed">{suggestion}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>


                                                {/* 3. Subject-wise Detailed Analysis */}
                                                <div className="pt-8 border-t border-slate-700">
                                                    <h3 className="text-2xl font-bold font-serif mb-6">Subject-wise Performance Analysis</h3>

                                                    <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-2">
                                                        <p className="text-slate-400 font-bold text-sm">Select a subject to analyze:</p>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                                        <div className="relative w-full md:w-full">
                                                            <select
                                                                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg py-3 px-4 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 font-bold"
                                                                value={selectedDetailSubject}
                                                                onChange={(e) => setSelectedDetailSubject(e.target.value)}
                                                            >
                                                                {getSubjects().map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    {selectedDetailSubject && result.subjectInsights?.[selectedDetailSubject] && (
                                                        <>
                                                            <p className="text-slate-400 font-medium mb-6">
                                                                Class Average for {selectedDetailSubject}: <span className="text-white font-bold">{result.subjectInsights[selectedDetailSubject].average}/100</span>
                                                            </p>

                                                            <div className="bg-white rounded-2xl p-6 text-slate-900 mb-8">
                                                                <h4 className="text-lg font-bold text-center mb-6">Distribution of Marks in {selectedDetailSubject}</h4>

                                                                <div className="h-[300px] w-full">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <BarChart data={result.subjectInsights[selectedDetailSubject].distribution}>
                                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                                            <XAxis dataKey="range" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                                            <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                                            <Tooltip
                                                                                cursor={{ fill: '#f1f5f9' }}
                                                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                                            />
                                                                            <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={50} activeBar={{ fill: '#9333ea' }} />
                                                                        </BarChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                            </div>

                                                            {/* Bottom Stats for Subject */}
                                                            <div className="space-y-6">
                                                                <p className="text-slate-300 font-medium">
                                                                    Number of students needing improvement in {selectedDetailSubject}: <span className="text-white font-bold">{
                                                                        result.subjectInsights[selectedDetailSubject].distribution
                                                                            .filter((d: any) => ['0-20', '21-40', '41-60'].some(r => d.range.includes(r)))
                                                                            .reduce((acc: number, curr: any) => acc + curr.count, 0)
                                                                    }</span>
                                                                </p>

                                                                <h4 className="text-2xl font-bold text-white font-serif">{selectedDetailSubject} Performance Summary</h4>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="bg-slate-500/50 text-white rounded-xl p-8 text-center border border-slate-500">
                                                                        <p className="text-slate-200 font-bold text-sm uppercase tracking-wider mb-2">Average</p>
                                                                        <p className="text-4xl font-black">{result.subjectInsights[selectedDetailSubject].average}</p>
                                                                    </div>
                                                                    <div className="bg-slate-200 text-slate-900 rounded-xl p-8 text-center">
                                                                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Highest</p>
                                                                        <p className="text-4xl font-black">{result.subjectInsights[selectedDetailSubject].highest}</p>
                                                                    </div>
                                                                    <div className="bg-white text-slate-900 rounded-xl p-8 text-center">
                                                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Lowest</p>
                                                                        <p className="text-4xl font-black">{result.subjectInsights[selectedDetailSubject].lowest}</p>
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    className="bg-[#1e293b] border border-slate-600 hover:bg-slate-800 text-white px-6 py-6 h-auto rounded-xl font-bold text-lg"
                                                                    onClick={() => {
                                                                        const blob = new Blob([JSON.stringify(result.subjectInsights[selectedDetailSubject], null, 2)], { type: 'application/json' });
                                                                        const url = URL.createObjectURL(blob);
                                                                        const a = document.createElement('a');
                                                                        a.href = url;
                                                                        a.download = `${selectedDetailSubject}_insights.json`;
                                                                        document.body.appendChild(a);
                                                                        a.click();
                                                                        document.body.removeChild(a);
                                                                        URL.revokeObjectURL(url);
                                                                    }}
                                                                >
                                                                    Download {selectedDetailSubject} Insights
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* 4. Overall Plan (Moved to Bottom) */}
                                                <div className="pt-8 border-t border-slate-700">
                                                    <h3 className="text-2xl font-bold font-serif mb-6">Overall Class Improvement Plan</h3>
                                                    <ul className="space-y-4 mb-8">
                                                        {result.improvementPlan?.map((plan: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-3 text-slate-300">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                                                                <span className="text-lg leading-relaxed">{plan}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <Button
                                                        onClick={() => {
                                                            const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `${file?.name.split('.')[0]}_analysis_report.json`;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            document.body.removeChild(a);
                                                            URL.revokeObjectURL(url);
                                                        }}
                                                        className="bg-[#1e293b] border border-slate-600 hover:bg-slate-800 text-white px-6 py-6 h-auto rounded-xl font-bold text-lg"
                                                    >
                                                        <Download className="w-5 h-5 mr-3" />
                                                        Download Class Insights
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div >
    );
};
