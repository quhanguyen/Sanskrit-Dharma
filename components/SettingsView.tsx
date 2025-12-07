import React from 'react';
import { Settings, Volume2, Eye, Zap, RotateCcw } from 'lucide-react';

interface SettingsViewProps {
    autoRead: boolean;
    setAutoRead: (v: boolean) => void;
    voiceSpeed: number;
    setVoiceSpeed: (v: number) => void;
    reduceMotion: boolean;
    setReduceMotion: (v: boolean) => void;
    fontSize: 'normal' | 'large';
    setFontSize: (v: 'normal' | 'large') => void;
    resetData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
    autoRead, setAutoRead, voiceSpeed, setVoiceSpeed,
    reduceMotion, setReduceMotion, fontSize, setFontSize, resetData
}) => {
    return (
        <div className="flex flex-col h-full pt-[60px] md:pt-0 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full p-6 space-y-8 pb-20">
                <div className="text-center mb-4 animate-in fade-in duration-500">
                    <h2 className="text-3xl font-serif font-bold text-gray-100 flex items-center justify-center">
                        <Settings className="mr-3 text-indigo-400" size={32} /> Thiết Lập Động Phủ
                    </h2>
                    <p className="text-slate-400 mt-2">Tùy chỉnh không gian tu luyện của Túc chủ.</p>
                </div>

                {/* Audio Settings */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center">
                        <Volume2 className="text-indigo-400 mr-2" size={20} />
                        <h3 className="font-bold text-gray-200">Âm Luật (Audio)</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-200">Tự động niệm (Auto-read)</div>
                                <div className="text-xs text-slate-500">Chân Quân sẽ tự động đọc câu trả lời.</div>
                            </div>
                            <button
                                onClick={() => setAutoRead(!autoRead)}
                                className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${autoRead ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoRead ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <div className="text-sm font-bold text-slate-200">Tốc độ niệm (Speed)</div>
                                <div className="text-xs text-indigo-400 font-mono bg-indigo-900/30 px-2 rounded border border-indigo-500/20">{voiceSpeed}x</div>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={voiceSpeed}
                                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Chậm (0.5x)</span>
                                <span>Bình thường (1.0x)</span>
                                <span>Nhanh (2.0x)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Settings */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500 delay-200">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center">
                        <Eye className="text-purple-400 mr-2" size={20} />
                        <h3 className="font-bold text-gray-200">Nhãn Quang (Display)</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-200">Tĩnh tâm (Giảm hiệu ứng)</div>
                                <div className="text-xs text-slate-500">Tắt các tinh vân chuyển động để tiết kiệm linh lực (pin).</div>
                            </div>
                            <button
                                onClick={() => setReduceMotion(!reduceMotion)}
                                className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${reduceMotion ? 'bg-purple-600' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-200">Cỡ chữ (Font Size)</div>
                                <div className="text-xs text-slate-500">Điều chỉnh kích thước văn bản trong đoạn chat.</div>
                            </div>
                            <div className="flex space-x-2 bg-black/20 p-1 rounded-lg border border-white/10">
                                <button
                                    onClick={() => setFontSize('normal')}
                                    className={`px-3 py-1 text-xs rounded transition-all ${fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Vừa
                                </button>
                                <button
                                    onClick={() => setFontSize('large')}
                                    className={`px-3 py-1 text-xs rounded transition-all ${fontSize === 'large' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Lớn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500 delay-300">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center">
                        <Zap className="text-emerald-400 mr-2" size={20} />
                        <h3 className="font-bold text-gray-200">Hệ Thống</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-slate-300">Phiên bản</span>
                            <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-900/20 px-2 py-0.5 rounded">v10.0-COSMIC</span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm text-slate-300">Túc chủ</span>
                            <span className="text-sm font-bold text-indigo-300">Tối thượng</span>
                        </div>

                        <button
                            onClick={resetData}
                            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center justify-center space-x-2"
                        >
                            <RotateCcw size={16} />
                            <span className="font-bold text-sm">Xóa Tạp Niệm (Reset Dữ Liệu)</span>
                        </button>
                    </div>
                </div>

                <div className="text-center text-[10px] text-slate-600 pt-4">
                    Bổn hệ thống - Pháo Hôi Chân Quân © 2025
                </div>
            </div>
        </div>
    );
};

export default SettingsView;