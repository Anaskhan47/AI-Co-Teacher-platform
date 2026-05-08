import { Globe, Users, Languages } from "lucide-react";

const stats = [
    {
        icon: Globe,
        value: "100+",
        label: "Countries",
        color: "text-white",
        bgColor: "bg-white/20"
    },
    {
        icon: Users,
        value: "250,000+",
        label: "Teachers helped",
        color: "text-white",
        bgColor: "bg-white/20"
    },
    {
        icon: Languages,
        value: "40",
        label: "Languages",
        color: "text-white",
        bgColor: "bg-white/20"
    }
];

const Stats = () => {
    return (
        <section className="relative z-20 -mt-10 w-full px-6">
            <div className="container mx-auto">
                <div className="bg-white backdrop-blur-2xl shadow-sm border border-slate-200 w-full overflow-hidden relative rounded-[2rem]">

                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="px-10 py-10 flex flex-col md:flex-row justify-around items-center gap-10 md:gap-4 relative z-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-5 relative w-full md:w-auto justify-center md:justify-start">
                                <div className={`p-4 rounded-2xl bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/20`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">
                                        {stat.value}
                                    </div>
                                    <div className="text-indigo-400 font-bold text-sm uppercase tracking-widest">
                                        {stat.label}
                                    </div>
                                </div>

                                {index !== stats.length - 1 && (
                                    <div className="hidden lg:block absolute -right-24 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
