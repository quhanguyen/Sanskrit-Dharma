import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Volume2, VolumeX, X, Send, Plus } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { Message } from '../types';
import { generateChatResponse } from '../services/geminiService';

interface ChatInterfaceProps {
    isEmbedded?: boolean;
    onCloseMobile?: () => void;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleSmartAudio: (text: string, type: 'auto' | 'system' | 'vocab', id?: string | null) => void;
    autoRead: boolean;
    setAutoRead: (val: boolean) => void;
    fontSize: 'normal' | 'large';
    setActiveTab: (tab: 'lessons' | 'tools' | 'chat' | 'settings') => void;
    setCurrentLesson: (lesson: any) => void;
    lessons: any[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    isEmbedded = false,
    onCloseMobile,
    messages,
    setMessages,
    handleSmartAudio,
    autoRead,
    setAutoRead,
    fontSize,
    setActiveTab,
    setCurrentLesson,
    lessons
}) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startNewConversation = () => {
        setMessages([{
            role: 'system',
            content: "**Pháo Hôi Chân Quân** đã tái xuất! 🙇‍♂️\n\nTâm trí đã được gột rửa. Túc chủ muốn hỏi gì?",
            quickReplies: [
                { label: "📖 Học Nguyên Âm", text: "Ta muốn học Căn bản Nguyên âm" },
                { label: "🕉️ Niệm Mantra", text: "Ta muốn tìm hiểu về Mantra" },
            ]
        }]);
    };

    const handleSendMessage = async (textOverride: string | null = null) => {
        const textToSend = typeof textOverride === 'string' ? textOverride : inputMessage;
        if (!textToSend.trim()) return;

        // Add User Message
        const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
        setMessages(newMessages);
        setInputMessage('');
        setIsLoading(true);

        const lowerText = textToSend.toLowerCase();
        if (lowerText.includes('học') || lowerText.includes('nguyên âm')) {
            setActiveTab('lessons');
            if (lessons.length > 0) setCurrentLesson(lessons[0]);
        } else if (lowerText.includes('mantra') || lowerText.includes('chú')) {
            setActiveTab('lessons');
            if (lessons.length > 1) setCurrentLesson(lessons[1]);
        } else if (lowerText.includes('soi') || lowerText.includes('kính') || lowerText.includes('tra')) {
            setActiveTab('tools');
        }

        try {
            const history = newMessages
                .filter(m => m.role !== 'system')
                .slice(0, -1)
                .map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

            const replyText = await generateChatResponse(history, textToSend);

            setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
            if (autoRead) handleSmartAudio(replyText, 'system');
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: "Linh lực tắc nghẽn, không thể hồi đáp." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-black/20 backdrop-blur-sm ${isEmbedded ? 'border-l border-white/10' : ''}`}>
            <div className={`p-4 border-b border-white/10 bg-black/40 flex items-center justify-between sticky top-0 z-10`}>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-purple-500/30 border border-white/10">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-base md:text-lg text-indigo-100 font-serif">Pháo Hôi Chân Quân</h2>
                        <p className="text-[10px] md:text-xs text-emerald-400 font-medium flex items-center">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> Hộ pháp trực tuyến
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={startNewConversation}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Cuộc trò chuyện mới"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={() => setAutoRead(!autoRead)}
                        className={`flex items-center text-xs px-3 py-1.5 rounded-full border transition-all ${autoRead ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        title="Tự động đọc tin nhắn mới"
                    >
                        {autoRead ? <Volume2 size={14} className="mr-1.5" /> : <VolumeX size={14} className="mr-1.5" />}
                        {autoRead ? "Auto" : "Tắt"}
                    </button>
                    {isEmbedded && onCloseMobile && (
                        <button onClick={onCloseMobile} className="md:hidden p-2 text-slate-400 hover:bg-white/10 rounded-full">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-transparent custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                {msg.role !== 'user' && (
                                    <div className="hidden md:flex w-8 h-8 rounded-full bg-indigo-900/50 flex-shrink-0 mr-3 items-center justify-center text-[10px] font-bold text-indigo-300 border border-indigo-500/30 shadow-sm">PH</div>
                                )}
                                <div className={`max-w-[95%] md:max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg relative group transition-all duration-300 ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-purple-500/20'
                                    : 'bg-black/60 text-slate-200 border border-white/10 rounded-tl-none pr-10 shadow-black/40 backdrop-blur-md'
                                    } ${fontSize === 'large' ? 'text-lg' : ''}`}>
                                    <MarkdownRenderer text={msg.content} isUser={msg.role === 'user'} />
                                    {msg.role === 'assistant' && (
                                        <button
                                            onClick={() => handleSmartAudio(msg.content.replace(/[*#`\-\[\]]/g, ''), 'system')}
                                            className="absolute top-2 right-2 text-slate-500 hover:text-indigo-300 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                            title="Nghe lại"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {msg.quickReplies && (
                                <div className="flex flex-wrap gap-2 mt-3 ml-2 md:ml-11 animate-in fade-in slide-in-from-bottom-3 duration-500">
                                    {msg.quickReplies.map((reply, rIdx) => (
                                        <button
                                            key={rIdx}
                                            onClick={() => handleSendMessage(reply.text)}
                                            className="text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl hover:bg-indigo-500/30 hover:border-indigo-400 hover:text-white transition-all hover:scale-105 shadow-sm active:scale-95"
                                        >
                                            {reply.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start items-center ml-12 animate-pulse">
                        <span className="text-xs text-indigo-400/70 italic flex items-center">
                            <Sparkles size={12} className="mr-1" /> Bổn hệ thống đang phân tích...
                        </span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
                <div className="flex items-center bg-white/5 rounded-full px-5 py-3 border border-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-lg">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Thỉnh giáo Chân Quân..."
                        className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500 min-w-0"
                    />
                    <button onClick={() => handleSendMessage()} disabled={isLoading || !inputMessage.trim()} className="ml-3 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-md shadow-indigo-500/30 flex-shrink-0">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;