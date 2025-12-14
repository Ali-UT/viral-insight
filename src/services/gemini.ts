import { functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

export interface AnalysisResult {
    hook: string;
    retention: string;
    payoff: string;
    sentiment: string;
    tones: { label: string; score: number }[];
    score: number;
    improvement_tips: string[];
}

export interface RemixVariables {
    niche: string;
    product: string;
    audience: string;
    tone: string;
}

/**
 * Converts a File object to a Base64 string.
 */
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function analyzeViralVideo(videoFile: File): Promise<AnalysisResult> {
    try {
        const videoData = await fileToBase64(videoFile);
        const analyzeVideoFn = httpsCallable(functions, 'analyzeVideo');

        const result = await analyzeVideoFn({
            videoData,
            mimeType: videoFile.type
        });

        return result.data as AnalysisResult;
    } catch (error) {
        console.error("Cloud Function Analysis Failed:", error);
        throw new Error("Analysis failed on server.");
    }
}

export async function generateRemixScript(analysis: AnalysisResult, variables: RemixVariables): Promise<string> {
    try {
        const remixScriptFn = httpsCallable(functions, 'remixScript');
        const result = await remixScriptFn({ analysis, variables });
        return (result.data as any).script;
    } catch (error) {
        console.error("Cloud Function Remix Failed:", error);
        throw new Error("Remix generation failed on server.");
    }
}
