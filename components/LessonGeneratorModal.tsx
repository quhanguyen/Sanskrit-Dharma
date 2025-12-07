import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface LessonGeneratorModalProps {
    onClose: () => void;
    onGenerate: (topic: string) => Promise<void>;
    isGenerating: boolean;
}

const LessonGeneratorModal: React.FC<LessonGeneratorModalProps> = ({ onClose, onGenerate, isGenerating }) => {
    const [lessonTopic, setLessonTopic] = useState('');

    const handleGenerate = () => {
        if (lessonTopic.trim()) {
            onGenerate(lessonTopic);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-[#0F1018] rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-white/10 p-6 animate-in zoom-in-95">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Sparkles className="mr-2 text-emerald-400" /> Sáng Tạo Bài Học Mới</h3>
                <p className="text-slate-400 text-sm mb-4">Túc chủ muốn tu luyện về chủ đề gì? (Ví dụ: Số đếm, Động vật, Chào hỏi...)</p>
                <input
                    type="text"
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    placeholder="Nhập chủ đề..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-4 focus:border-emerald-500 outline-none"
                    disabled={isGenerating}
                />
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} disabled={isGenerating} className="px-4 py-2 text-slate-400 hover:text-white">Hủy</button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !lessonTopic.trim()}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                        {isGenerating ? "Đang viết..." : "Tạo Bí Kíp"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonGeneratorModal;