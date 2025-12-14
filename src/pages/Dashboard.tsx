import { useState } from 'react';
import { motion } from "framer-motion";
import { Sparkles, Play, CheckCircle } from "lucide-react";
import { Navigate } from "react-router-dom";

import { useAuth } from '../contexts/AuthContext';
import { VideoUploader } from '../components/VideoUploader';
import { RemixWizard } from '../components/RemixWizard';
import { analyzeViralVideo } from '../services/gemini';
import type { AnalysisResult } from '../services/gemini';

export function Dashboard() {
    const { user, signOut } = useAuth();
    const [analyzing, setAnalyzing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    // Protect the route
    if (!user) {
        return <Navigate to="/" replace />;
    }

    const handleVideoSelect = (file: File) => {
        setSelectedFile(file);
        setResult(null);
        setError('');
    };

    const handleUrlSubmit = (_url: string) => {
        // console.log("Submitted URL:", url);
        alert("URL downloading is not yet implemented. Please upload a file for now.");
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setAnalyzing(true);
        setError('');

        try {
            const data = await analyzeViralVideo(selectedFile);
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 relative">
            {/* Header / Nav */}
            <div className="absolute top-4 right-4 flex items-center gap-4 glass-panel px-4 py-2 z-10">
                {user.photoURL && (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-white/20" />
                )}
                <button onClick={signOut} className="text-sm opacity-80 hover:opacity-100">
                    Sign Out
                </button>
            </div>

            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-panel p-8 max-w-4xl w-full flex flex-col items-center gap-6 mt-16"
            >
                {!result && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center mb-4 shadow-lg shadow-[#C13584]/40" style={{ background: 'var(--insta-gradient)' }}>
                            <Sparkles className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-bold mb-2">
                            Viral <span className="gradient-text">Deconstructor</span>
                        </h1>
                        <p className="text-xl text-[var(--md-sys-color-on-background)] opacity-80 mb-8 font-light">
                            Upload a video to analyze.
                        </p>
                    </>
                )}

                <div className="w-full flex flex-col items-center gap-6">
                    {!result && (
                        <VideoUploader onVideoSelect={handleVideoSelect} onUrlSubmit={handleUrlSubmit} />
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {!result && (
                        analyzing ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-t-[var(--insta-primary)] border-white/20 rounded-full animate-spin"></div>
                                <div className="text-sm animate-pulse text-[var(--insta-primary)] font-medium">
                                    Deconstructing viral DNA...
                                </div>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleAnalyze}
                                disabled={!selectedFile}
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Start Analysis
                            </button>
                        )
                    )}

                    {/* Result View */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
                        >
                            {/* Video Preview Placeholer */}
                            <div className="glass-panel p-4 flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-gray-300">Deconstruction</h3>

                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">The Hook</span>
                                        <p className="mt-1 text-sm">{result.hook}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                        <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Retention</span>
                                        <p className="mt-1 text-sm">{result.retention}</p>
                                    </div>
                                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                        <span className="text-xs uppercase tracking-wider text-green-400 font-bold">The Payoff</span>
                                        <p className="mt-1 text-sm">{result.payoff}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Score Card */}
                                <div className="glass-panel p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-3xl font-bold gradient-text">{result.score}/10</h3>
                                        <span className="text-sm text-gray-400">Viral Potential</span>
                                    </div>
                                    <div className="text-right flex-1 pl-4">
                                        <p className="text-sm text-gray-400 mb-2">Tone Map</p>
                                        <div className="flex flex-col gap-2">
                                            {result.tones && result.tones.map((tone: any, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <span className="w-16 text-right opacity-80">{tone.label}</span>
                                                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${tone.score * 100}%` }}
                                                            className="h-full bg-[var(--insta-primary)]"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {!result.tones && <span className="text-xs">{result.sentiment}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="glass-panel p-6 flex-1">
                                    <h3 className="text-lg font-bold text-gray-300 mb-4">Improvement Tips</h3>
                                    <ul className="space-y-3">
                                        {result.improvement_tips.map((tip, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                                <span className="opacity-90">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button onClick={() => setResult(null)} className="btn btn-secondary w-full">
                                    Analyze Another
                                </button>
                            </div>

                            {/* Remix Section (Spans full width below) */}
                            <div className="md:col-span-2">
                                <RemixWizard analysis={result} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
