import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles, Settings } from 'lucide-react';
import CosmicBackground from './components/CosmicBackground';
import { SAMPLE_LESSONS } from './constants';
import { Lesson, Message, QuizData } from './types';
import { generateQuizQuestion, generateNewLesson } from './services/geminiService';
import { useTTS } from './hooks/useTTS';

// Components
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import LibraryView from './components/LibraryView';
import LessonView from './components/LessonView';
import ToolsView from './components/ToolsView';
import SettingsView from './components/SettingsView';
import QuizModal from './components/QuizModal';
import LessonGeneratorModal from './components/LessonGeneratorModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'tools' | 'chat' | 'settings'>('lessons');
  
  // State Persistence for Lessons
  const [lessons, setLessons] = useState<Lesson[]>(() => {
      try {
          const saved = localStorage.getItem('sanskrit_lessons');
          return saved ? JSON.parse(saved) : SAMPLE_LESSONS;
      } catch {
          return SAMPLE_LESSONS;
      }
  });

  useEffect(() => {
      localStorage.setItem('sanskrit_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  // Settings
  const [autoRead, setAutoRead] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // UI State
  const [isZenMode, setIsZenMode] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showLessonGenModal, setShowLessonGenModal] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: "**Pháo Hôi Chân Quân** đã thượng tuyến! 🙇‍♂️\n\nTúc chủ muốn bắt đầu tu luyện thần công nào?",
      quickReplies: [
        { label: "📖 Học Nguyên Âm", text: "Ta muốn học Căn bản Nguyên âm" },
        { label: "🕉️ Niệm Mantra", text: "Ta muốn tìm hiểu về Mantra" },
        { label: "⚔️ Lôi Đài", text: "Ta muốn thử thách Lôi Đài" },
        { label: "🔍 Soi Kính", text: "Ta muốn dùng Kính Chiếu Yêu" }
      ]
    }
  ]);

  // Quiz State
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Custom Hook for Audio
  const { isPlaying, playingBrowserId, stop, handleSmartAudio } = useTTS(voiceSpeed);

  const resetData = () => {
      if (confirm("Túc chủ có chắc muốn xóa hết tạp niệm (reset dữ liệu)?")) {
          localStorage.removeItem('sanskrit_lessons');
          setLessons(SAMPLE_LESSONS);
          setCurrentLesson(null);
          setMessages([messages[0]]);
          alert("Tâm đã tịnh. Dữ liệu đã được xóa.");
      }
  };

  const handleLessonGeneration = async (topic: string) => {
      setIsGeneratingLesson(true);
      try {
          const newLesson = await generateNewLesson(topic, lessons.length);
          setLessons(prev => [...prev, newLesson]);
          setCurrentLesson(newLesson);
          setShowLessonGenModal(false);
      } catch (error) {
          alert("Tâm ma quấy nhiễu, không thể sáng tạo bí kíp lúc này.");
      } finally {
          setIsGeneratingLesson(false);
      }
  };

  const generateQuiz = async (lessonContext: Lesson | null = null) => {
      const targetLesson = lessonContext || currentLesson;
      if (!targetLesson) return;
      
      setQuizLoading(true);
      setSelectedAnswer(null);
      setShowQuizModal(true);
      const context = targetLesson.content.map(c => c.sanskrit + " (" + c.vietnamese + ")").join(". ");
      try {
          const data = await generateQuizQuestion(context);
          setQuizData(data);
      } catch (error) {
        alert("Không thể thiết lập Lôi Đài lúc này.");
        setShowQuizModal(false);
      } finally {
        setQuizLoading(false);
      }
  };

  return (
    <div className="flex h-screen w-full bg-black font-sans text-gray-100 overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <CosmicBackground reduceMotion={reduceMotion} />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setCurrentLesson={setCurrentLesson} 
        setIsZenMode={setIsZenMode}
        isZenMode={isZenMode}
        hasCurrentLesson={!!currentLesson}
      />

      {/* Mobile Header */}
      {!currentLesson && (
        <div className="md:hidden fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-white/10 px-4 py-3 flex justify-between items-center shadow-lg">
           <h1 className="text-xl font-serif font-bold text-indigo-400 flex items-center"><span className="text-2xl mr-2">ॐ</span> Sanskrit</h1>
           <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-400">TC</div>
        </div>
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        {activeTab === 'lessons' ? (
           currentLesson ? (
             <div className="flex h-full w-full relative overflow-hidden">
                <LessonView 
                    lesson={currentLesson}
                    onClose={() => { setCurrentLesson(null); stop(); setIsZenMode(false); }}
                    isZenMode={isZenMode}
                    setIsZenMode={setIsZenMode}
                    onOpenQuiz={() => generateQuiz()}
                    onOpenMobileChat={() => setIsMobileChatOpen(true)}
                    handleSmartAudio={handleSmartAudio}
                    isPlaying={isPlaying}
                    playingBrowserId={playingBrowserId}
                />

                {/* Embedded Chat Panel */}
                <div className={`${isZenMode ? 'hidden' : 'hidden md:flex'} w-96 flex-col border-l border-white/10 bg-black/40 shadow-2xl z-20`}>
                    <ChatInterface 
                        isEmbedded={true}
                        messages={messages}
                        setMessages={setMessages}
                        handleSmartAudio={handleSmartAudio}
                        autoRead={autoRead}
                        setAutoRead={setAutoRead}
                        fontSize={fontSize}
                        setActiveTab={setActiveTab}
                        setCurrentLesson={setCurrentLesson}
                        lessons={lessons}
                    />
                </div>
             </div>
           ) : (
             <LibraryView 
                lessons={lessons} 
                setCurrentLesson={setCurrentLesson} 
                onOpenGenerator={() => setShowLessonGenModal(true)} 
             />
           )
        ) : null}

        {activeTab === 'chat' && (
            <div className="flex-1 h-full pt-[60px] md:pt-0">
                <ChatInterface 
                    messages={messages}
                    setMessages={setMessages}
                    handleSmartAudio={handleSmartAudio}
                    autoRead={autoRead}
                    setAutoRead={setAutoRead}
                    fontSize={fontSize}
                    setActiveTab={setActiveTab}
                    setCurrentLesson={setCurrentLesson}
                    lessons={lessons}
                />
            </div>
        )}

        {activeTab === 'tools' && (
            <ToolsView handleSmartAudio={handleSmartAudio} />
        )}

        {activeTab === 'settings' && (
            <SettingsView 
                autoRead={autoRead} setAutoRead={setAutoRead}
                voiceSpeed={voiceSpeed} setVoiceSpeed={setVoiceSpeed}
                reduceMotion={reduceMotion} setReduceMotion={setReduceMotion}
                fontSize={fontSize} setFontSize={setFontSize}
                resetData={resetData}
            />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {!currentLesson && (
        <nav className="md:hidden bg-black/80 backdrop-blur-md border-t border-white/10 px-6 py-2 flex justify-between items-center text-xs font-medium text-slate-500 safe-area-bottom z-50 fixed bottom-0 w-full">
          <button onClick={() => { setActiveTab('lessons'); setCurrentLesson(null); }} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'lessons' ? 'text-indigo-400' : ''}`}><BookOpen size={24} className="mb-1" /><span>Kinh Văn</span></button>
          <button onClick={() => { setActiveTab('tools'); setCurrentLesson(null); }} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'tools' ? 'text-indigo-400' : ''}`}><Search size={24} className="mb-1" /><span>Soi Rọi</span></button>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'chat' ? 'text-indigo-400' : ''}`}><Sparkles size={24} className="mb-1" /><span>Chân Quân</span></button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'text-indigo-400' : ''}`}><Settings size={24} className="mb-1" /><span>Thiết lập</span></button>
        </nav>
      )}

      {/* Modals */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex flex-col">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileChatOpen(false)}></div>
            <div className="absolute bottom-0 left-0 right-0 h-[85vh] bg-[#050508] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-white/10">
                <ChatInterface 
                    isEmbedded={true} 
                    onCloseMobile={() => setIsMobileChatOpen(false)} 
                    messages={messages}
                    setMessages={setMessages}
                    handleSmartAudio={handleSmartAudio}
                    autoRead={autoRead}
                    setAutoRead={setAutoRead}
                    fontSize={fontSize}
                    setActiveTab={setActiveTab}
                    setCurrentLesson={setCurrentLesson}
                    lessons={lessons}
                />
            </div>
        </div>
      )}

      {showQuizModal && (
          <QuizModal 
             quizData={quizData} 
             loading={quizLoading} 
             onClose={() => setShowQuizModal(false)} 
             onGenerate={() => generateQuiz()}
             selectedAnswer={selectedAnswer}
             setSelectedAnswer={setSelectedAnswer}
          />
      )}

      {showLessonGenModal && (
          <LessonGeneratorModal 
            onClose={() => setShowLessonGenModal(false)}
            onGenerate={handleLessonGeneration}
            isGenerating={isGeneratingLesson}
          />
      )}
    </div>
  );
}