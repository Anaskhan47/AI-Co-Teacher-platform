import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function AttendanceTab() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT'>>({});

    const { data: students, isLoading } = useQuery({
        queryKey: ['students-class'],
        queryFn: async () => {
            const res = await api.get('/attendance/students?grade=10&section=A');
            if (res.success) return res.data;
            return [];
        }
    });

    const markMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/attendance/mark', data);
            if (!res.success) throw new Error(res.error || "Failed to commit attendance");
            return res.data;
        },
        onSuccess: () => {
            toast.success("Attendance protocol archived.");
        }
    });

    const handleSave = () => {
        const data = {
            date,
            classId: 'class-1',
            attendanceData: Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status
            }))
        };
        markMutation.mutate(data);
    };

    const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;
    const absentCount = Object.values(attendance).filter(v => v === 'ABSENT').length;

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-6" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Entity Roster...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Attendance Registry</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-3 italic">Class 10-A • Daily Operational Record</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
                        <div className="px-4 py-2 flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">{presentCount} Present</span>
                        </div>
                        <div className="w-[1px] h-4 bg-slate-200" />
                        <div className="px-4 py-2 flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">{absentCount} Absent</span>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={markMutation.isPending || Object.keys(attendance).length === 0}
                        className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl shadow-lg shadow-indigo-600/20 border-none transition-all"
                    >
                        {markMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Archive Record
                    </Button>
                </div>
            </div>

            {/* Filter Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Calendar Date</label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Grade Level</label>
                    <div className="h-12 bg-slate-100/50 border border-slate-200 rounded-xl flex items-center px-4 text-slate-500 font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                        Class 10
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Section</label>
                    <div className="h-12 bg-slate-100/50 border border-slate-200 rounded-xl flex items-center px-4 text-slate-500 font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                        Section A
                    </div>
                </div>
                <div className="flex items-end">
                   <Button variant="outline" className="h-12 w-full rounded-xl border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50">
                       Reset Scope
                   </Button>
                </div>
            </div>

            {/* Roster Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[700px] text-left border-collapse">
                    <thead>
                        <tr className="h-14 bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-[45%]">Student Profile</th>
                            <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center w-[25%]">Current Status</th>
                            <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center w-[30%]">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students?.map((student: any, idx: number) => {
                            const status = attendance[student.id];
                            return (
                                <tr key={student.id} className="h-20 hover:bg-slate-50/30 transition-all group">
                                    <td className="px-8 align-middle">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 border border-slate-200 shadow-sm shrink-0">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user.name}`} />
                                                <AvatarFallback className="bg-slate-100 text-slate-500 font-black text-xs">{student.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-black text-slate-900 text-sm leading-tight truncate">{student.user.name}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: #0{idx + 101}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 align-middle text-center">
                                        <AnimatePresence mode="wait">
                                            {status ? (
                                                <motion.span 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={cn(
                                                        "inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                        status === 'PRESENT' 
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                            : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    )}
                                                >
                                                    {status}
                                                </motion.span>
                                            ) : (
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Pending Audit</span>
                                            )}
                                        </AnimatePresence>
                                    </td>
                                    <td className="px-8 align-middle">
                                        <div className="flex items-center justify-center">
                                            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-full max-w-[150px] shadow-sm">
                                                <button
                                                    onClick={() => setAttendance(p => ({ ...p, [student.id]: 'PRESENT' }))}
                                                    className={cn(
                                                        "flex-1 h-9 flex items-center justify-center rounded-lg transition-all",
                                                        status === 'PRESENT'
                                                            ? "bg-white text-emerald-600 shadow-md border border-emerald-100"
                                                            : "text-slate-400 hover:text-slate-600"
                                                    )}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setAttendance(p => ({ ...p, [student.id]: 'ABSENT' }))}
                                                    className={cn(
                                                        "flex-1 h-9 flex items-center justify-center rounded-lg transition-all",
                                                        status === 'ABSENT'
                                                            ? "bg-white text-rose-600 shadow-md border border-rose-100"
                                                            : "text-slate-400 hover:text-slate-600"
                                                    )}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
>
    );
}
