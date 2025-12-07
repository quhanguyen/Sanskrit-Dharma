import React from 'react';
import { Pause, Volume2, Info, GraduationCap, BrainCircuit, Maximize2, Minimize2, MessageCircle, Volume1 } from 'lucide-react';
import { Lesson } from '../types';

interface LessonViewProps {
    lesson: Lesson;
    onClose: () => void;
    isZenMode: boolean;
    setIsZenMode: (v: boolean) => void;
    onOpenQuiz: () => void;
    onOpenMobileChat: () => void;
    handleSmartAudio: (text: string, type: 'auto' | 'system' | 'vocab', id?: string | null) => void;
    isPlaying: boolean;
    playingBrowserId: string | null;
}

const LessonView: React.FC<LessonViewProps> = ({ 
    lesson, onClose, isZenMode, setIsZenMode, onOpenQuiz, onOpenMobileChat, 
    handleSmartAudio, isPlaying, playingBrowserId 
}) => {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="bg-black/60 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 border-b border-white/10 flex items-center justify-between shadow-lg z-20 relative">
                <div className="flex items-center overflow-hidden">
                    <button onClick={onClose} className="mr-3 p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors flex-shrink-0">←</button>
                    <div className="min-w-0">
                        <h2 className="font-serif font-bold text-lg md:text-xl text-gray-200 truncate">{lesson.title}</h2>
                        <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide truncate">{lesson.category}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsZenMode(!isZenMode)}
                        className={`hidden md:flex items-center justify-center w-9 h-9 rounded-full border transition-all ${isZenMode ? 'bg-purple-900/40 border-purple-500/50 text-purple-300' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                        title={isZenMode ? "Hiện Hệ Thống" : "Ẩn Hệ Thống"}
                    >
                        {isZenMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>

                    <button onClick={onOpenQuiz} className="flex items-center space-x-1 bg-red-900/20 text-red-400 px-3 py-1.5 rounded-full border border-red-500/30 hover:bg-red-900/40 transition-colors shadow-sm text-xs font-bold">
                        <BrainCircuit size={16} /> <span className="hidden sm:inline">Lôi Đài</span>
                    </button>
                    <button onClick={onOpenMobileChat} className="md:hidden flex items-center space-x-1 bg-indigo-900/20 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/30 shadow-sm text-xs font-bold">
                        <MessageCircle size={16} /> <span>Hỏi Chân Quân</span>
                    </button>
                </div>
            </div>
            <div className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-24 md:pb-8 custom-scrollbar transition-all duration-500 ${isZenMode ? 'md:px-24' : ''}`}>
                {lesson.content.map((block, idx) => (
                    <div key={idx} className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="p-6 md:p-8 relative">
                            <div className="absolute top-4 right-4 text-white/5 font-serif text-6xl select-none pointer-events-none">ॐ</div>
                            <div className="text-center mb-8 relative z-10">
                                <p className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-relaxed py-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>{block.sanskrit}</p>
                                <p className="text-indigo-400 font-medium font-mono text-xl md:text-2xl tracking-wide mt-2">{block.iast}</p>
                            </div>
                            <div className="space-y-4 bg-black/40 rounded-xl p-5 mb-6 border border-white/5">
                                <div><h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">English Pronunciation</h4><p className="text-slate-300 italic text-sm">"{block.english}"</p></div>
                                <div className="border-t border-white/10 pt-3"><h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Tiếng Việt</h4><p className="text-indigo-100 font-bold text-base">"{block.vietnamese}"</p></div>
                                <div className="border-t border-white/10 pt-3"><div className="flex items-start text-xs text-indigo-300/80"><Info size={14} className="mr-2 mt-0.5 flex-shrink-0" /><p>{block.explanation}</p></div></div>
                            </div>
                            {block.vocabulary && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-emerald-400 text-sm flex items-center mb-3 border-b border-emerald-900/30 pb-2"><GraduationCap size={16} className="mr-2" />Ví dụ thực tế</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {block.vocabulary.map((vocab, vIdx) => (
                                            <div key={vIdx} className="bg-emerald-900/10 p-3 rounded-lg border border-emerald-900/30 text-sm flex justify-between items-center group hover:bg-emerald-900/20 transition-colors">
                                                <div>
                                                    <div className="flex justify-between items-baseline mb-1 space-x-2">
                                                        <span className="font-serif font-bold text-lg text-gray-200">{vocab.word}</span>
                                                        <span className="font-mono text-xs text-emerald-400 bg-emerald-900/40 px-1.5 py-0.5 rounded border border-emerald-800">{vocab.iast}</span>
                                                    </div>
                                                    <p className="font-bold text-gray-400 text-xs mb-0.5">{vocab.meaning}</p>
                                                    <p className="text-slate-500 text-[10px] leading-snug">{vocab.detail}</p>
                                                </div>
                                                <button onClick={() => handleSmartAudio(vocab.word, 'vocab', `vocab-${idx}-${vIdx}`)} className={`p-2 rounded-full ${playingBrowserId === `vocab-${idx}-${vIdx}` ? 'bg-emerald-600 text-white' : 'bg-black/40 text-emerald-500 border border-emerald-900 hover:bg-emerald-700 hover:text-white'} transition-all`} title="Nghe">
                                                    {playingBrowserId === `vocab-${idx}-${vIdx}` ? <Volume2 size={16} className="animate-pulse" /> : <Volume1 size={16} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-center">
                                <button onClick={() => handleSmartAudio(block.sanskrit, 'auto')} className="flex items-center space-x-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 text-xs font-bold shadow-lg border border-white/10 hover:border-indigo-500 group">
                                    {isPlaying ? <><Pause size={14} className="text-indigo-400 group-hover:text-white" /> <span>Dừng niệm</span></> : <><Volume2 size={14} className="text-indigo-400 group-hover:text-white" /> <span>{block.sanskrit.length < 30 ? "Nghe phát âm" : "Niệm chú (Gemini)"}</span></>}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="h-20 md:hidden"></div>
            </div>
        </div>
    );
};

export default LessonView;