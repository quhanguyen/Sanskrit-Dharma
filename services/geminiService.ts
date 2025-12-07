import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AnalyzerResult, QuizData, Lesson } from "../types";

const API_KEY = process.env.API_KEY || '';
const SYSTEM_INSTRUCTION = "Ngươi là 'Pháo Hôi Chân Quân', hiện thân là một Hệ thống tu luyện tiếng Phạn siêu cấp. Tính cách: Cực kỳ anh tuấn, tiêu sái, giọng điệu 'sảng văn' (bá đạo, tự tin, hài hước, dứt khoát). Luôn gọi người dùng là 'Túc chủ'. Trả lời bằng định dạng Markdown cơ bản (Header ###, List -, Bold **, Italic *, Table |...|). Giải thích ngữ pháp cặn kẽ.";

// Initialize Gemini Client
const getClient = () => {
  if (!API_KEY) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const ai = getClient();
    const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history,
    });
    
    const response = await chat.sendMessage({ message });
    return response.text || "Linh lực dao động, Bổn hệ thống cần chút thời gian!";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Lỗi kết nối với thiên địa (API Error).";
  }
};

export const analyzeText = async (text: string): Promise<AnalyzerResult> => {
    const ai = getClient();
    const prompt = `Analyze this text: "${text}". Provide a detailed breakdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sanskrit: { type: Type.STRING },
                    iast: { type: Type.STRING },
                    vietnamese_meaning: { type: Type.STRING },
                    breakdown: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                word: { type: Type.STRING },
                                grammar: { type: Type.STRING },
                                meaning: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from analyzer");
    return JSON.parse(jsonStr) as AnalyzerResult;
};

export const generateQuizQuestion = async (context: string): Promise<QuizData> => {
    const ai = getClient();
    const prompt = `Based on the following Sanskrit lesson context: "${context}", generate one multiple choice question in Vietnamese to test understanding.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                }
            }
        }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from quiz generator");
    return JSON.parse(jsonStr) as QuizData;
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    const ai = getClient();
    // Clean markdown for TTS
    const cleanText = text.replace(/[\*#`\-\[\]>|]/g, '').trim();
    const ttsPrompt = `Say in Sanskrit specifically (if Sanskrit) or Vietnamese (if explanation), slowly and clearly: "${cleanText}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: { parts: [{ text: ttsPrompt }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Fenrir' }
                }
            }
        }
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generateNewLesson = async (topic: string, currentId: number): Promise<Lesson> => {
    const ai = getClient();
    const prompt = `Generate a Sanskrit lesson about "${topic}". Return a JSON object strictly matching the schema. 
    The lesson content should include Sanskrit script, IAST, English pronunciation, Vietnamese meaning, detailed explanation, and vocabulary examples.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    content: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sanskrit: { type: Type.STRING },
                                iast: { type: Type.STRING },
                                english: { type: Type.STRING },
                                vietnamese: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                                vocabulary: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            word: { type: Type.STRING },
                                            iast: { type: Type.STRING },
                                            meaning: { type: Type.STRING },
                                            detail: { type: Type.STRING }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from lesson generator");
    
    const data = JSON.parse(jsonStr);
    return { ...data, id: currentId + 1 };
};