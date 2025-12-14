import React, { useState, useCallback } from 'react';
import { Upload, Link as LinkIcon, FileVideo, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoUploaderProps {
    onVideoSelect: (file: File) => void;
    onUrlSubmit: (url: string) => void;
}

export function VideoUploader({ onVideoSelect, onUrlSubmit }: VideoUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [url, setUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setSelectedFile(file);
                onVideoSelect(file);
            }
        }
    }, [onVideoSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('video/')) {
                setSelectedFile(file);
                onVideoSelect(file);
            }
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
    };

    return (
        <div className="w-full max-w-xl">
            {/* URL Input */}
            <div className="glass-panel p-2 mb-6 flex items-center gap-2">
                <div className="p-2 text-[var(--insta-secondary)]">
                    <LinkIcon size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Paste Reel, TikTok, or Short URL..."
                    className="bg-transparent border-none outline-none flex-1 text-white placeholder-white/30"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && url) onUrlSubmit(url);
                    }}
                />
                <button
                    disabled={!url}
                    onClick={() => onUrlSubmit(url)}
                    className="bg-[var(--md-sys-color-surface-container-high)] hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Fetch
                </button>
            </div>

            <div className="flex items-center justify-center w-full relative">
                <AnimatePresence mode="wait">
                    {!selectedFile ? (
                        <motion.label
                            key="upload-zone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            htmlFor="dropzone-file"
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[28px] cursor-pointer transition-colors ${dragActive ? 'border-[var(--insta-primary)] bg-[var(--insta-primary)]/10' : 'border-gray-600 hover:border-gray-500 bg-[var(--md-sys-color-surface-container)] hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-[var(--insta-primary)]' : 'text-gray-400'}`} />
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">MP4, MOV</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept="video/*" onChange={handleChange} />
                        </motion.label>
                    ) : (
                        <motion.div
                            key="file-preview"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full h-64 glass-panel flex flex-col items-center justify-center relative"
                        >
                            <button onClick={clearFile} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                            <FileVideo className="w-16 h-16 text-[var(--insta-accent)] mb-4" />
                            <p className="text-lg font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
