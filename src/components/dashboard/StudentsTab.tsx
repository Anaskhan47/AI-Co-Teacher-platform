import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreVertical, Loader2, TrendingUp, TrendingDown, Mail, Plus, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function StudentsTab() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", grade: "", section: "", rollNo: "" });
    const queryClient = useQueryClient();

    const { data: students, isLoading } = useQuery({
        queryKey: ['students-roster'],
        queryFn: async () => {
            const res = await api.get('/students/roster');
            if (res.success) return res.data;
            return [];
        }
    });

    const addStudentMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/students', data);
            return res.data;
        },
        onSuccess: () => {
            setIsAddOpen(false);
            setNewStudent({ name: "", email: "", grade: "", section: "", rollNo: "" });
            queryClient.invalidateQueries({ queryKey: ['students-roster'] });
            toast.success("Student enrolled successfully");
        }
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Architecture */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Student Roster</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-3 italic">Autonomous Academic Lifecycle Management</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                        <Input 
                            className="pl-11 h-12 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-bold text-xs w-full sm:w-72 focus:ring-2 ring-indigo-500/20 transition-all" 
                            placeholder="Search students..." 
                        />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 shadow-lg shadow-indigo-600/20 border-none transition-all">
                                <Plus className="w-4 h-4 mr-2" />
                                Enroll Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] bg-white border-slate-200 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                            <DialogHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                    Institutional Enrollment
                                </DialogTitle>
                            </DialogHeader>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                                        <Input
                                            value={newStudent.name}
                                            onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                            placeholder="Legal Name"
                                            className="h-12 bg-slate-50/50 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                                        <Input
                                            value={newStudent.email}
                                            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                            placeholder="student@institute.edu"
                                            className="h-12 bg-slate-50/50 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 ring-indigo-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Grade</Label>
                                        <Input
                                            value={newStudent.grade}
                                            onChange={e => setNewStudent({ ...newStudent, grade: e.target.value })}
                                            placeholder="10"
                                            type="number"
                                            className="h-12 bg-slate-50/50 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Section</Label>
                                        <Input
                                            value={newStudent.section}
                                            onChange={e => setNewStudent({ ...newStudent, section: e.target.value })}
                                            placeholder="A"
                                            className="h-12 bg-slate-50/50 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Roll No</Label>
                                        <Input
                                            value={newStudent.rollNo}
                                            onChange={e => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                                            placeholder="101"
                                            type="number"
                                            className="h-12 bg-slate-50/50 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 ring-indigo-500/20"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="p-8 bg-slate-50/30 border-t border-slate-100 gap-4">
                                <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="h-12 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-slate-900">Discard</Button>
                                <Button
                                    onClick={() => addStudentMutation.mutate(newStudent)}
                                    disabled={!newStudent.name || !newStudent.grade || addStudentMutation.isPending}
                                    className="h-12 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20 border-none transition-all"
                                >
                                    {addStudentMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Finalize Enrollment
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Roster Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-24 text-slate-400">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-6" />
                        <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Lifecycle Data...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="h-14 bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-[35%]">Student Identity</th>
                                <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-[15%]">Allocation</th>
                                <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-[20%]">Performance Index</th>
                                <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-[15%]">Daily Status</th>
                                <th className="px-8 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-right w-[15%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students?.map((student: any) => (
                                <tr key={student.id} className="h-20 hover:bg-slate-50/30 transition-all group">
                                    <td className="px-8 align-middle">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-11 w-11 border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs">{student.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-black text-slate-900 text-sm leading-tight truncate group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{student.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 align-middle">
                                        <span className="font-black text-slate-500 text-[9px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                            Class {student.grade}-{student.section}
                                        </span>
                                    </td>
                                    <td className="px-8 align-middle">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-black text-base ${student.avgPerformance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {student.avgPerformance}%
                                            </span>
                                            {student.avgPerformance >= 80 ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 align-middle">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            student.lastAttendance === 'PRESENT'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                        )}>
                                            {student.lastAttendance}
                                        </span>
                                    </td>
                                    <td className="px-8 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
    );
}
