import { useState, useRef, useEffect, useCallback } from 'react';
import { generateSpeech } from '../services/geminiService';
import { pcmToWav } from '../utils/audioUtils';

export const useTTS = (voiceSpeed: number) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingBrowserId, setPlayingBrowserId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playbackIdRef = useRef<number>(0);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
    }, []);

    const stop = useCallback(() => {
        playbackIdRef.current += 1; // Invalidate current sequence
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = "";
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setPlayingBrowserId(null);
    }, []);

    const playBrowser = useCallback((text: string, id: string = 'temp') => {
        stop();
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'hi-IN';
            utterance.rate = voiceSpeed;
            utterance.onstart = () => setPlayingBrowserId(id);
            utterance.onend = () => setPlayingBrowserId(null);
            utterance.onerror = () => setPlayingBrowserId(null);
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Trình duyệt không hỗ trợ.");
        }
    }, [stop, voiceSpeed]);

    const playGemini = useCallback(async (text: string) => {
        stop();
        setIsPlaying(true);
        const currentPlaybackId = playbackIdRef.current;

        try {
            // Clean Text
            let cleanText = text.replace(/\*\*|###|##|-|`|>/g, '').trim();
            cleanText = cleanText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

            const sentences = cleanText.match(/[^.!?\n]+[.!?\n]*/g) || [cleanText];
            const chunks: string[] = [];
            let currentChunk = "";
            const MAX_CHUNK_LENGTH = 500;

            for (const sentence of sentences) {
                if ((currentChunk + sentence).length > MAX_CHUNK_LENGTH) {
                    if (currentChunk.trim()) chunks.push(currentChunk.trim());
                    currentChunk = sentence;
                } else {
                    currentChunk += sentence;
                }
            }
            if (currentChunk.trim()) chunks.push(currentChunk.trim());

            if (chunks.length === 0) {
                setIsPlaying(false);
                return;
            }

            const playNextChunk = async (index: number) => {
                if (index >= chunks.length || playbackIdRef.current !== currentPlaybackId) {
                    setIsPlaying(false);
                    return;
                }

                try {
                    const chunkText = chunks[index];
                    const audioData = await generateSpeech(chunkText);

                    if (audioData && audioRef.current && playbackIdRef.current === currentPlaybackId) {
                        const wavUrl = pcmToWav(audioData, 24000);
                        audioRef.current.src = wavUrl;
                        audioRef.current.playbackRate = voiceSpeed;

                        await audioRef.current.play();

                        audioRef.current.onended = () => {
                            URL.revokeObjectURL(wavUrl);
                            playNextChunk(index + 1);
                        };
                        audioRef.current.onerror = () => {
                            URL.revokeObjectURL(wavUrl);
                            playNextChunk(index + 1);
                        }
                    } else {
                        playNextChunk(index + 1);
                    }
                } catch (error) {
                    console.error("TTS Chunk Error:", error);
                    playNextChunk(index + 1);
                }
            };

            playNextChunk(0);

        } catch (error) {
            console.error("TTS Setup Error:", error);
            setIsPlaying(false);
        }
    }, [stop, voiceSpeed]);

    const handleSmartAudio = useCallback((text: string, type: 'auto' | 'system' | 'vocab' = 'auto', id: string | null = null) => {
        if (type === 'system') { playGemini(text); return; }
        const isShort = text.length < 30;
        if (type === 'vocab' || (type === 'auto' && isShort)) { 
            playBrowser(text, id || text); 
        } else { 
            playGemini(text); 
        }
    }, [playBrowser, playGemini]);

    return {
        isPlaying,
        playingBrowserId,
        stop,
        playBrowser,
        playGemini,
        handleSmartAudio
    };
};