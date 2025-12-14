import { motion } from "framer-motion";
import { Sparkles, BarChart2, Wand2, Zap, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function LandingPage() {
    const { user, signInWithGoogle } = useAuth();

    // If already logged in, redirect to app
    if (user) {
        return <Navigate to="/app" replace />;
    }

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const features = [
        {
            icon: <Zap className="text-yellow-400" />,
            title: "Viral Deconstruction",
            desc: "Break down any short-form video into its DNA: Hook, Retention, and Payoff."
        },
        {
            icon: <BarChart2 className="text-blue-400" />,
            title: "Sentiment & Tone Map",
            desc: "Understand the emotional roller coaster. We map excitement, curiosity, and more."
        },
        {
            icon: <Wand2 className="text-purple-400" />,
            title: "AI Remix Studio",
            desc: "Don't just copy. Remix. Generate new scripts for YOUR niche using viral structures."
        }
    ];

    const pricing = [
        {
            tier: "Creator",
            price: "$0",
            period: "/month",
            desc: "Perfect for getting started.",
            features: ["3 Analyses per day", "Basic Deconstruction", "Community Support"],
            cta: "Start for Free",
            highlight: false
        },
        {
            tier: "Pro Viral",
            price: "$29",
            period: "/month",
            desc: "For serious content creators.",
            features: ["Unlimited Analysis", "Advanced Tone Mapping", "AI Remix Studio", "Priority Support"],
            cta: "Go Viral",
            highlight: true
        }
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden">

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative">
                <motion.div
                    initial={fadeIn.initial}
                    animate={fadeIn.animate}
                    transition={fadeIn.transition}
                    className="max-w-4xl w-full flex flex-col items-center gap-6 z-10"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center mb-6 shadow-xl shadow-[#C13584]/40 animate-pulse-slow" style={{ background: 'var(--insta-gradient)' }}>
                        <Sparkles className="text-white w-10 h-10" />
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
                        Crack the Code of <br /> <span className="gradient-text">Viral Content</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--md-sys-color-on-background)] opacity-80 mb-8 font-light max-w-2xl">
                        Reverse-engineer the psychology of top-performing Reels, TikToks, and Shorts using Gemini 2.5 Pro.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button onClick={signInWithGoogle} className="btn btn-primary text-lg px-8 py-4">
                            Start Analyzing for Free
                        </button>
                        <button className="btn btn-secondary text-lg px-8 py-4">
                            View Demo
                        </button>
                    </div>
                </motion.div>

                {/* Background Elements */}
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-blob"></div>
                <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-black/20 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Why Top Creators Use Us</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Stop guessing. Start engineering. Our AI-powered tools give you the data-driven edge.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 flex flex-col items-center text-center hover:bg-white/5 transition-colors duration-300"
                            >
                                <div className="p-4 bg-white/5 rounded-full mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
                        <p className="text-gray-400">Start for free, upgrade when you go viral.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {pricing.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className={`glass-panel p-8 flex flex-col relative ${plan.highlight ? 'border-[var(--insta-primary)] border-2 shadow-[0_0_30px_rgba(193,53,132,0.3)]' : ''}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                                        MOST POPULAR
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.tier}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400 text-sm">{plan.period}</span>
                                </div>
                                <p className="text-gray-400 mb-8 text-sm">{plan.desc}</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feat, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm">
                                            <Sparkles className="w-4 h-4 text-[var(--insta-accent)]" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={signInWithGoogle}
                                    className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    {plan.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact / Footer */}
            <section className="py-16 px-6 border-t border-white/10 mt-12 bg-black/40">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-8">Ready to dominate the feed?</h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                        <a href="mailto:hello@viraldeconstructor.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <Mail size={20} /> hello@viraldeconstructor.com
                        </a>
                        {/* Socials could go here */}
                    </div>

                    <p className="text-xs text-gray-600">
                        © 2024 Viral Deconstructor. All rights reserved. <br />
                        Not affiliated with Instagram, TikTok, or YouTube.
                    </p>
                </div>
            </section>
        </div>
    );
}
