import { useState, useCallback, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Load voices when component mounts (Chrome requires this)
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, lang: 'vi-VN' | 'zh-TW', id: string) => {
    if (!window.speechSynthesis) {
      alert("您的瀏覽器不支援語音發音功能 (Browser does not support Speech Synthesis)");
      return;
    }

    // Cancel current speech to prevent overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Adjust rate: Vietnamese tends to be fast, slow it down slightly for learners
    utterance.rate = lang === 'vi-VN' ? 0.85 : 0.9; 

    // Find best voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang === lang && (
        voice.name.includes('Google') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Mei-Jia') ||
        voice.name.includes('Microsoft')
      )
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers for UI state
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  return { speak, stop, speakingId };
};