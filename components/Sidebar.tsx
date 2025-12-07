import React from 'react';
import { BookOpen, Search, Sparkles, Settings } from 'lucide-react';
import { Lesson } from '../types';

interface SidebarProps {
    activeTab: 'lessons' | 'tools' | 'chat' | 'settings';
    setActiveTab: (tab: 'lessons' | 'tools' | 'chat' | 'settings') => void;
    setCurrentLesson: (lesson: Lesson | null) => void;
    setIsZenMode: (isZenMode: boolean) => void;
    isZenMode: boolean;
    hasCurrentLesson: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, setCurrentLesson, setIsZenMode, isZenMode, hasCurrentLesson }) => {
    return (
        <aside className={`${isZenMode && activeTab === 'lessons' && hasCurrentLesson ? 'hidden' : 'hidden md:flex'} w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-md flex-shrink-0 z-10 transition-all duration-300`}>
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300 flex items-center">
                    <span className="text-3xl mr-2 text-indigo-500">ॐ</span> Sanskrit
                </h1>
                <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase ml-1">Dharma</p>
            </div>
            <div className="flex-1 p-4 space-y-2">
                {[
                    { id: 'lessons', icon: BookOpen, label: "Thư Viện" },
                    { id: 'tools', icon: Search, label: "Kính Chiếu Yêu" },
                    { id: 'chat', icon: Sparkles, label: "Đàm Đạo Riêng" },
                    { id: 'settings', icon: Settings, label: "Thiết Lập" }
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setCurrentLesson(null); setIsZenMode(false); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 text-indigo-300 font-bold shadow-md shadow-indigo-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    >
                        <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} /> <span>{item.label}</span>
                    </button>
                ))}
            </div>
            <div className="p-4 border-t border-white/10 bg-black/20 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">TC</div>
                <div className="ml-3"><p className="text-xs font-bold text-gray-300">Túc chủ Tối thượng</p></div>
            </div>
        </aside>
    );
};

export default Sidebar;