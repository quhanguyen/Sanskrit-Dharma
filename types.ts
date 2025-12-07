export interface Vocabulary {
  word: string;
  iast: string;
  meaning: string;
  detail: string;
}

export interface LessonContent {
  sanskrit: string;
  iast: string;
  english: string;
  vietnamese: string;
  explanation: string;
  vocabulary?: Vocabulary[];
}

export interface Lesson {
  id: number;
  title: string;
  category: string;
  description: string;
  content: LessonContent[];
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  quickReplies?: { label: string; text: string }[];
}

export interface AnalyzerBreakdown {
  word: string;
  grammar: string;
  meaning: string;
}

export interface AnalyzerResult {
  sanskrit: string;
  iast: string;
  vietnamese_meaning: string;
  breakdown: AnalyzerBreakdown[];
}

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AudioState {
    isPlaying: boolean;
    browserId: string | null;
}