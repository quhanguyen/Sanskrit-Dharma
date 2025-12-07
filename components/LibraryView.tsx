import React from 'react';
import { ChevronRight, PlusCircle } from 'lucide-react';
import { Lesson } from '../types';

interface LibraryViewProps {
    lessons: Lesson[];
    setCurrentLesson: (lesson: Lesson) => void;
    onOpenGenerator: () => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ lessons, setCurrentLesson, onOpenGenerator }) => {
    return (
        <div className="flex-1 h-full w-full pt-[60px] md:pt-0 overflow-y-auto custom-scrollbar">
            <div className="p-6 md:p-8 max-w-6xl mx-auto w-full overflow-y-auto">
                <div className="mb-8 animate-in fade-in duration-700 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-gray-100 mb-2">Thư Viện Tu Tập</h2>
                        <p className="text-slate-400">Con đường vạn dặm bắt đầu từ bước chân đầu tiên.</p>
                    </div>
                    <button
                        onClick={onOpenGenerator}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-emerald-500/20 border border-emerald-400/30 flex items-center transition-all hover:scale-105"
                    >
                        <PlusCircle size={20} className="mr-2" />
                        <span className="hidden sm:inline">Sáng Tạo Bí Kíp</span>
                        <span className="sm:hidden">Thêm</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {lessons.map((lesson, idx) => (
                        <div key={lesson.id} onClick={() => setCurrentLesson(lesson)} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${lesson.category === 'Căn Bản' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-indigo-900/20 text-indigo-400 border-indigo-800'}`}>{lesson.category}</span>
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-gray-200 mb-2 group-hover:text-indigo-300 transition-colors">{lesson.title}</h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{lesson.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LibraryView;