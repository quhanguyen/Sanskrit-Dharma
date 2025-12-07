import React from 'react';
import { X, BrainCircuit, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { QuizData } from '../types';

interface QuizModalProps {
    quizData: QuizData | null;
    loading: boolean;
    onClose: () => void;
    onGenerate: () => void;
    selectedAnswer: number | null;
    setSelectedAnswer: (idx: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quizData, loading, onClose, onGenerate, selectedAnswer, setSelectedAnswer }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-[#0F1018] rounded-3xl shadow-2xl shadow-purple-900/20 w-full max-w-lg relative z-10 overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"><X size={24} /></button>
                    <BrainCircuit size={48} className="mx-auto mb-2 text-white/90 drop-shadow-md" />
                    <h3 className="text-2xl font-bold font-serif">Lôi Đài Tu Tập</h3>
                    <p className="text-indigo-100 text-sm opacity-90">Thử thách kiến thức bài học hiện tại</p>
                </div>

                <div className="p-6 md:p-8 min-h-[300px] flex flex-col justify-center bg-black/40">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-400 font-medium">Bổn hệ thống đang soạn đề...</p>
                        </div>
                    ) : quizData ? (
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-gray-100 text-center leading-relaxed">
                                {quizData.question}
                            </h4>

                            <div className="grid gap-3">
                                {quizData.options.map((option, idx) => {
                                    let btnClass = "w-full p-4 rounded-xl text-left border transition-all font-medium text-gray-300 ";
                                    if (selectedAnswer === null) {
                                        btnClass += "border-white/10 bg-white/5 hover:border-indigo-500 hover:bg-white/10";
                                    } else if (idx === quizData.correctIndex) {
                                        btnClass += "border-emerald-500/50 bg-emerald-900/20 text-emerald-300";
                                    } else if (selectedAnswer === idx) {
                                        btnClass += "border-red-500/50 bg-red-900/20 text-red-300";
                                    } else {
                                        btnClass += "border-white/5 bg-transparent opacity-50";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !selectedAnswer && setSelectedAnswer(idx)}
                                            disabled={selectedAnswer !== null}
                                            className={btnClass}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{option}</span>
                                                {selectedAnswer !== null && idx === quizData.correctIndex && <CheckCircle className="text-emerald-500" size={20} />}
                                                {selectedAnswer === idx && idx !== quizData.correctIndex && <XCircle className="text-red-500" size={20} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedAnswer !== null && (
                                <div className={`p-4 rounded-xl text-sm border ${selectedAnswer === quizData.correctIndex ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300' : 'bg-red-900/20 border-red-800 text-red-300'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <p className="font-bold mb-1">{selectedAnswer === quizData.correctIndex ? "Chính xác! Đạo hạnh tăng tiến!" : "Chưa chính xác! Tâm tĩnh lại nào."}</p>
                                    <p className="opacity-90">{quizData.explanation}</p>
                                    <button onClick={onGenerate} className="mt-3 text-xs font-bold underline flex items-center hover:opacity-80">Câu tiếp theo <ArrowRight size={12} className="ml-1" /></button>
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="text-center text-red-400">Không có dữ liệu câu hỏi.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizModal;