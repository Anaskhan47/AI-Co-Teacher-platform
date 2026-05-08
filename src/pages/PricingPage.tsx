import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, HelpCircle, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PricingPage = () => {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

    const plans = [
        {
            name: "Core",
            price: "$0",
            period: "forever",
            description: "Essential synthesis for individual nodes",
            icon: Globe,
            features: [
                "Create 5 neural assets every week",
                "Basic activity synthesis",
                "No credit card required",
                "Export to standard formats"
            ],
            cta: "Initialize Core",
            variant: "outline"
        },
        {
            name: "Elite",
            price: billingPeriod === "monthly" ? "$19" : "$190",
            period: billingPeriod === "monthly" ? "month" : "year",
            description: "Full-spectrum tools for high-performance units",
            icon: Zap,
            features: [
                "Unlimited premium synthesis",
                "Full curriculum & standards sync",
                "Advanced specialist AI models",
                "Assets up to 50 content nodes",
                "Custom 'Create' terminal access",
                "Network stream integration"
            ],
            cta: "Access Elite",
            variant: "primary",
            highlight: true
        },
        {
            name: "Registry",
            price: "Custom",
            period: "license",
            description: "Scale impact across your entire collective",
            icon: Shield,
            features: [
                "Centralized command dashboard",
                "Bulk unit management",
                "Institutional growth analytics",
                "Priority 24/7 technical uplink"
            ],
            cta: "Connect Agency",
            variant: "outline"
        }
    ];

    const faqs = [
        {
            question: "Can I recalibrate or terminate my subscription?",
            answer: "Affirmative. You can upgrade, downgrade, or terminate your node sync at any time from your command settings. No latent fees or fixed-term protocols."
        },
        {
            question: "What transaction protocols are supported?",
            answer: "We support all major credit-tier cards (Visa, Mastercard, American Express) and encrypted neural payment gateways."
        },
        {
            question: "What is the capacity of the Core interface?",
            answer: "The Core interface allows you to synthesize up to 5 complete instructional assets per weekly cycle. This recalibrates every Monday at 00:00 GMT."
        },
        {
            question: "Are assets persistent after protocol termination?",
            answer: "You retain full ownership and access to all synthesized assets. However, advanced neural features will be restricted to read-only mode."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 overflow-x-hidden">
            <Navbar />

            <main className="flex-1 pt-48 pb-40 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto px-10 relative z-10">
                    {/* Header */}
                    <div className="max-w-5xl mx-auto text-center mb-32">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            License Setup
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter uppercase leading-none"
                        >
                            Calibrate your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 italic">Instructional Tier.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-500 font-black max-w-3xl mx-auto leading-relaxed uppercase tracking-tighter"
                        >
                            A high-performance framework to reclaim your focus. Save <span className="text-white italic">hundreds</span> of hours through automated neural synthesis.
                        </motion.p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-24">
                        <Tabs defaultValue="monthly" onValueChange={(v) => setBillingPeriod(v as any)} className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-white/10 p-2 h-16 rounded-[1.5rem] shadow-2xl backdrop-blur-3xl">
                                <TabsTrigger value="monthly" className="rounded-xl text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all shadow-xl">Monthly</TabsTrigger>
                                <TabsTrigger value="yearly" className="rounded-xl text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all shadow-xl relative">
                                    Yearly 
                                    <span className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg border border-emerald-400/20">Save 20%</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1400px] mx-auto mb-48 px-4">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className={`relative flex flex-col p-12 rounded-[3.5rem] transition-all duration-700 group
                                    ${plan.highlight
                                        ? "bg-indigo-600 text-white shadow-[0_40px_100px_rgba(79,70,229,0.25)] scale-105 z-10 border-2 border-white/30"
                                        : "bg-slate-900/50 backdrop-blur-3xl border border-white/5 text-white hover:border-indigo-500/50 hover:bg-slate-900/80 shadow-2xl"
                                    }
                                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl ring-4 ring-orange-500/20">
                                        Elite Choice
                                    </div>
                                )}

                                <div className="mb-14">
                                    <div className={`w-16 h-16 rounded-[1.5rem] mb-10 flex items-center justify-center border shadow-xl transition-all duration-500 group-hover:rotate-12 ${plan.highlight ? "bg-white/20 border-white/20" : "bg-white/5 border-white/10"}`}>
                                        <plan.icon className={`w-8 h-8 ${plan.highlight ? "text-white" : "text-indigo-400"}`} />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">{plan.name}</h3>
                                    <p className={`text-[9px] font-black mb-10 uppercase tracking-[0.3em] leading-relaxed ${plan.highlight ? "text-indigo-100" : "text-slate-500"}`}>
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-7xl font-black tracking-tighter leading-none">{plan.price}</span>
                                        {plan.price !== "Custom" && (
                                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${plan.highlight ? "text-indigo-100" : "text-slate-500"}`}>
                                                /{plan.period}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-8 mb-20 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-5 group/item">
                                            <div className={`mt-0.5 rounded-xl p-2 border transition-all ${plan.highlight ? "bg-white/20 border-white/20 text-white shadow-lg" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"}`}>
                                                <Check className="w-5 h-5 stroke-[4]" />
                                            </div>
                                            <span className={`text-xs font-black uppercase tracking-widest leading-relaxed ${plan.highlight ? "text-white" : "text-slate-400"}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    className={`h-20 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] w-full transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] shadow-2xl
                                        ${plan.highlight
                                            ? "bg-white text-indigo-600 hover:bg-slate-100"
                                            : "bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-indigo-600 text-white"
                                        }
                                    `}
                                >
                                    <Link to="/signup">{plan.cta}</Link>
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-6 mb-12 ml-4">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl">
                                <HelpCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-1">
                                    FAQ Terminal
                                </h3>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational Query Resolution</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-[4rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 backdrop-blur-3xl">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="border-b-white/5 last:border-0 px-4">
                                        <AccordionTrigger className="text-left font-black text-white hover:text-indigo-400 text-xl py-10 transition-all uppercase tracking-tighter">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-500 font-black uppercase tracking-widest text-[10px] pb-12 leading-relaxed opacity-80">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PricingPage;
