import { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { generateRemixScript } from '../services/gemini';
import type { AnalysisResult, RemixVariables } from '../services/gemini';

interface RemixWizardProps {
    analysis: AnalysisResult;
}

export function RemixWizard({ analysis }: RemixWizardProps) {
    const [variables, setVariables] = useState<RemixVariables>({
        niche: '',
        product: '',
        audience: '',
        tone: 'Persuasive'
    });
    const [script, setScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRemix = async () => {
        if (!variables.niche || !variables.product) return;
        setLoading(true);
        try {
            // API Key is handled on server
            const generatedScript = await generateRemixScript(analysis, variables);
            setScript(generatedScript);
        } catch (error) {
            console.error(error);
            alert("Failed to generate remix");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-panel p-6 w-full text-left mt-6 border-t border-white/10">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Wand2 className="text-[var(--insta-accent)]" /> Remix Studio
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 block">Your Niche</label>
                        <input
                            type="text"
                            placeholder="e.g., Real Estate, Fitness, Coding"
                            className="w-full bg-[var(--md-sys-color-surface-container)] p-3 rounded-lg text-white"
                            value={variables.niche}
                            onChange={(e) => setVariables({ ...variables, niche: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 block">Topic / Product</label>
                        <input
                            type="text"
                            placeholder="e.g., New Course, Market Update"
                            className="w-full bg-[var(--md-sys-color-surface-container)] p-3 rounded-lg text-white"
                            value={variables.product}
                            onChange={(e) => setVariables({ ...variables, product: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 block">Audience</label>
                            <input
                                type="text"
                                placeholder="e.g., Beginners"
                                className="w-full bg-[var(--md-sys-color-surface-container)] p-3 rounded-lg text-white"
                                value={variables.audience}
                                onChange={(e) => setVariables({ ...variables, audience: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 block">Tone</label>
                            <select
                                className="w-full bg-[var(--md-sys-color-surface-container)] p-3 rounded-lg text-white"
                                value={variables.tone}
                                onChange={(e) => setVariables({ ...variables, tone: e.target.value })}
                            >
                                <option>Persuasive</option>
                                <option>Funny</option>
                                <option>Educational</option>
                                <option>Controversial</option>
                                <option>Inspirational</option>
                            </select>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary mt-2"
                        onClick={handleRemix}
                        disabled={loading || !variables.niche}
                    >
                        {loading ? 'Generating Magic...' : 'Generate Remix'}
                    </button>
                </div>

                {/* Script Output */}
                <div className="bg-[var(--md-sys-color-surface-container)] rounded-xl p-4 relative min-h-[300px]">
                    {script ? (
                        <>
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                            </button>
                            <pre className="whitespace-pre-wrap font-sans text-sm opacity-90 leading-relaxed">
                                {script}
                            </pre>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                            <Wand2 size={48} className="mb-4" />
                            <p>Enter variables to generate a script</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
