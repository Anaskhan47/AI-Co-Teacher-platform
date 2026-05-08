import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, MoreVertical, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MessagesTab() {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [msgContent, setMsgContent] = useState("");
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailData, setEmailData] = useState({ subject: "", body: "" });
    const queryClient = useQueryClient();

    const { data: messages, isLoading } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const res = await api.get('/messages');
            if (res.success) return res.data;
            return [];
        }
    });

    const sendMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/messages', data);
            if (!res.success) throw new Error(res.error || "Failed to send message");
            return res.data;
        },
        onSuccess: () => {
            setMsgContent("");
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
    });

    const emailMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/messages/email', data);
            if (!res.success) throw new Error(res.error || "Failed to transmit email");
            return res.data;
        },
        onSuccess: () => {
            setEmailOpen(false);
            setEmailData({ subject: "", body: "" });
            toast.success("Transmission sent to parent network!");
        }
    });

    const contacts = messages ? Array.from(new Set(messages.map((m: any) =>
        m.senderId === api.defaults.headers.common['Authorization'] ? m.receiverId : m.senderId
    ))).map(id => {
        const msg = messages.find((m: any) => m.senderId === id || m.receiverId === id);
        return msg.senderId === id ? msg.sender : msg.receiver;
    }) : [];

    return (
        <div className="h-[calc(100vh-180px)] bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden flex shadow-2xl">
            {/* Contact Sidebar */}
            <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/50">
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-sm text-white uppercase tracking-[0.2em]">Channels</h3>
                        <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-white/10 text-indigo-400 hover:bg-indigo-600/10 hover:text-indigo-400 bg-transparent rounded-xl">
                                    <Mail className="w-3 h-3 mr-2" /> Compose
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/5 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                                <DialogHeader className="p-8 border-b border-white/5 bg-white/5">
                                    <DialogTitle className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-indigo-500" />
                                        Transmit to Parent
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Recipient</Label>
                                        <Input
                                            value={selectedUser?.name || "Select a contact first"}
                                            disabled
                                            className="h-14 bg-white/5 border-white/10 rounded-xl text-slate-400 font-bold text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject Line</Label>
                                        <Input
                                            placeholder="Regarding academic performance..."
                                            value={emailData.subject}
                                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                            className="h-14 bg-white/5 border-white/10 rounded-xl text-white font-bold text-xs placeholder:text-slate-600 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Transmission Body</Label>
                                        <Textarea
                                            placeholder="Dear Parent..."
                                            className="h-32 resize-none bg-white/5 border-white/10 rounded-xl text-white font-medium placeholder:text-slate-600 focus:ring-indigo-500/50 p-4"
                                            value={emailData.body}
                                            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="p-8 pt-0 gap-4">
                                    <Button onClick={() => setEmailOpen(false)} variant="ghost" className="h-14 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-white hover:bg-white/5">Abort</Button>
                                    <Button
                                        onClick={() => emailMutation.mutate({ parentId: selectedUser?.id, ...emailData })}
                                        disabled={!selectedUser || !emailData.subject || !emailData.body || emailMutation.isPending}
                                        className="h-14 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 border-none"
                                    >
                                        {emailMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Transmit
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <Input className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-slate-600 font-bold text-xs focus:ring-indigo-500/50" placeholder="Filter channels..." />
                    </div>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                        </div>
                    ) : contacts.map((contact: any) => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedUser(contact)}
                            className={`w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-all border-b border-white/5 ${selectedUser?.id === contact.id ? 'bg-indigo-600/10 border-r-2 border-r-indigo-500' : ''}`}
                        >
                            <Avatar className="w-12 h-12 border-2 border-indigo-500/20 shadow-lg">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} />
                                <AvatarFallback className="bg-indigo-600/20 text-indigo-400 font-black">{contact.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-left flex-1 min-w-0">
                                <h4 className="font-black text-white text-sm tracking-tight truncate">{contact.name}</h4>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Last message...</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="px-8 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-indigo-500/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} />
                                    <AvatarFallback className="bg-indigo-600/20 text-indigo-400 font-black">{selectedUser.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-black text-white tracking-tight">{selectedUser.name}</h3>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">● Active</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-500 hover:text-white hover:bg-white/5">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 p-8 overflow-auto space-y-6 custom-scrollbar">
                            {messages?.filter((m: any) => m.senderId === selectedUser.id || m.receiverId === selectedUser.id).map((m: any) => (
                                <div key={m.id} className={`flex ${m.senderId === selectedUser.id ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] px-6 py-4 rounded-[1.5rem] text-sm font-medium shadow-xl ${m.senderId === selectedUser.id
                                        ? 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                                        : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'
                                    }`}>
                                        {m.content}
                                        <div className="mt-2 text-[10px] opacity-50 flex items-center justify-end gap-1 font-black uppercase tracking-widest">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {m.senderId !== selectedUser.id && <CheckCircle2 className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-white/5 border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); sendMutation.mutate({ receiverId: selectedUser.id, content: msgContent }); }}
                                className="flex items-center gap-4"
                            >
                                <Input
                                    value={msgContent}
                                    onChange={(e) => setMsgContent(e.target.value)}
                                    className="flex-1 bg-white/5 border-white/10 rounded-2xl h-14 px-6 font-bold text-white placeholder:text-slate-600 text-sm focus:ring-indigo-500/50"
                                    placeholder="Transmit message..."
                                />
                                <Button type="submit" disabled={sendMutation.isPending} className="w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 p-0 border-none transition-all">
                                    {sendMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center shadow-2xl">
                            <Send className="w-12 h-12 text-indigo-500 opacity-30" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-black text-xl text-white tracking-tight">No Channel Selected</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Select a contact to initiate transmission</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
