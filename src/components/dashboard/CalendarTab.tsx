import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, MapPin, Users, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export function CalendarTab() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const events = [
        { id: 1, title: "Mathematics Class - 8A", time: "09:00 AM - 10:30 AM", type: "class", accent: "indigo", location: "Room 302", attendees: 32 },
        { id: 2, title: "Science Quiz Preparation", time: "11:30 AM - 12:45 PM", type: "class", accent: "emerald", location: "Lab 2", attendees: 28 },
        { id: 3, title: "Staff Meeting", time: "02:00 PM - 03:00 PM", type: "meeting", accent: "violet", location: "Conference Hall", attendees: 15 },
        { id: 4, title: "Parent-Teacher Conference", time: "04:00 PM - 05:30 PM", type: "meeting", accent: "amber", location: "Meeting Room 1", attendees: 4 },
    ];

    const accentMap: Record<string, { pill: string; dot: string; event: string }> = {
        indigo: { pill: 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-500', event: 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' },
        emerald: { pill: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500', event: 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' },
        violet: { pill: 'bg-violet-600/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-500', event: 'bg-violet-600/10 border-violet-500/20 text-violet-400' },
        amber: { pill: 'bg-amber-600/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-500', event: 'bg-amber-600/10 border-amber-500/20 text-amber-400' },
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Schedule Matrix</h1>
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mt-1">Manage your temporal workflow and events</p>
                </div>
                <Button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-indigo-600/20 border-none transition-all gap-3">
                    <Plus className="w-4 h-4" /> Schedule Event
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Calendar Grid */}
                <div className="lg:col-span-8">
                    <Card className="border border-white/5 bg-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
                        <CardContent className="p-8">
                            {/* Month Nav */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-black text-white tracking-tight">September 2026</h2>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-1 p-1.5 bg-white/5 rounded-xl border border-white/5">
                                    {["Day", "Week", "Month"].map((v, i) => (
                                        <Button key={v} variant="ghost" size="sm" className={`h-9 px-5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all ${i === 2 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                                            {v}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                    <div key={day} className="bg-slate-950/50 p-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {day}
                                    </div>
                                ))}
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const isToday = i === 14;
                                    return (
                                        <div key={i} className={`bg-slate-950/30 min-h-[90px] p-3 hover:bg-white/5 transition-colors group relative ${isToday ? 'ring-1 ring-inset ring-indigo-500/30' : ''}`}>
                                            <span className={`text-sm font-black inline-flex items-center justify-center w-8 h-8 rounded-xl mb-2 ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                                {i < 30 ? i + 1 : ""}
                                            </span>
                                            {i === 8 && (
                                                <div className="px-2 py-1 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 truncate uppercase tracking-widest">
                                                    Math 101
                                                </div>
                                            )}
                                            {i === 14 && (
                                                <>
                                                    <div className="px-2 py-1 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 truncate uppercase tracking-widest mb-1">
                                                        Science Lab
                                                    </div>
                                                    <div className="px-2 py-1 rounded-lg bg-violet-600/10 border border-violet-500/20 text-[9px] font-black text-violet-400 truncate uppercase tracking-widest">
                                                        Staff Meet
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Panel */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Mini Calendar */}
                    <Card className="border border-white/5 bg-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <CardContent className="p-4">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-xl border-none mx-auto [&_button]:text-white [&_button]:font-black [&_[aria-selected]]:bg-indigo-600 [&_[aria-selected]]:text-white [&_button:hover]:bg-white/10"
                            />
                        </CardContent>
                    </Card>

                    {/* Events List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-white text-sm uppercase tracking-widest">Upcoming Events</h3>
                            <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-indigo-400 hover:bg-indigo-600/10 rounded-xl">View All</Button>
                        </div>

                        {events.map((event, idx) => {
                            const a = accentMap[event.accent];
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${a.pill}`}>
                                            {event.type}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-600 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/5 transition-all">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <h4 className="font-black text-white text-sm tracking-tight mb-3 group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                                    <div className="space-y-2">
                                        {[
                                            { icon: Clock, text: event.time },
                                            { icon: MapPin, text: event.location },
                                            { icon: Users, text: `${event.attendees} Entities` },
                                        ].map(({ icon: Icon, text }, j) => (
                                            <div key={j} className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                <Icon className="w-3.5 h-3.5" /> {text}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
