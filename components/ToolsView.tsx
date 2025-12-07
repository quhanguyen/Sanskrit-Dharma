import React, { useState } from 'react';
import { Search, Sparkles, Volume2, BrainCircuit } from 'lucide-react';
import { analyzeText } from '../services/geminiService';
import { AnalyzerResult } from '../types';

interface ToolsViewProps {
    handleSmartAudio: (text: string, type: 'auto' | 'system' | 'vocab') => void;
}

const ToolsView: React.FC<ToolsViewProps> = ({ handleSmartAudio }) => {
    const [analyzerInput, setAnalyzerInput] = useState('');
    const [analyzerResult, setAnalyzerResult] = useState<AnalyzerResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const callAnalyzer = async () => {
        if (!analyzerInput.trim()) return;
        setIsAnalyzing(true);
        setAnalyzerResult(null);
        try {
            const result = await analyzeText(analyzerInput);
            setAnalyzerResult(result);
        } catch (error) {
            alert("Kính Chiếu Yêu bị mờ, không soi được (Lỗi API).");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col h-full pt-[60px] md:pt-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full p-6 space-y-8">
                <div className="text-center mb-8 animate-in fade-in zoom-in duration-500">
                    <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-400 flex items-center justify-center mb-3">
                        <Search className="mr-3 text-indigo-400" size={36} /> Kính Chiếu Yêu
                    </h2>
                    <p className="text-slate-400">Nhập câu chú (Việt/Anh/Phạn), Bổn hệ thống sẽ soi rọi tận gốc rễ.</p>
                </div>

                <div className="bg-white/5 p-2 rounded-2xl shadow-xl border border-white/10 flex backdrop-blur-md">
                    <input
                        type="text"
                        value={analyzerInput}
                        onChange={(e) => setAnalyzerInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && callAnalyzer()}
                        placeholder="Nhập văn bản cần soi (Ví dụ: Xin chào, Namaste...)"
                        className="flex-1 p-4 outline-none text-lg bg-transparent text-white placeholder-slate-500"
                    />
                    <button
                        onClick={callAnalyzer}
                        disabled={isAnalyzing || !analyzerInput}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center"
                    >
                        {isAnalyzing ? <span className="animate-spin mr-2">ॐ</span> : <Sparkles className="mr-2" size={20} />}
                        Soi
                    </button>
                </div>

                {analyzerResult && (
                    <div className="bg-black/60 rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-in slide-in-from-bottom-8 duration-500 backdrop-blur-md">
                        <div className="bg-gradient-to-b from-white/10 to-transparent p-8 text-center border-b border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                            <h3 className="text-5xl font-serif text-indigo-100 mb-4 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]" style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>
                                {analyzerResult.sanskrit}
                            </h3>
                            <p className="text-indigo-400 font-mono text-xl mb-2">{analyzerResult.iast}</p>
                            <p className="text-slate-300 italic text-lg">"{analyzerResult.vietnamese_meaning}"</p>
                            <button onClick={() => handleSmartAudio(analyzerResult.sanskrit, 'auto')} className="mt-6 px-4 py-2 bg-white/5 rounded-full text-indigo-300 hover:bg-white/10 hover:text-white transition-all border border-white/10 inline-flex items-center space-x-2">
                                <Volume2 size={18} /> <span>Niệm</span>
                            </button>
                        </div>
                        <div className="p-8">
                            <h4 className="font-bold text-slate-300 mb-6 flex items-center"><BrainCircuit size={20} className="mr-2 text-indigo-400" /> Phân Tích Cấu Trúc</h4>
                            <div className="grid gap-4">
                                {analyzerResult.breakdown.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            <span className="font-serif font-bold text-indigo-200 text-lg w-32">{item.word}</span>
                                            <span className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded border border-indigo-500/30">{item.grammar}</span>
                                        </div>
                                        <span className="text-slate-300 font-medium">{item.meaning}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToolsView;