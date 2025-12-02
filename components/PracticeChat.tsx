import React, { useState, useRef, useEffect } from 'react';
import { chatWithAiTutor, generateExplanation } from '../services/geminiService';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { Language } from '../types';
import { BookOpen, Languages, Volume2, Send, Bot } from 'lucide-react';

const PracticeChat: React.FC<{ language: Language }> = ({ language }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [explainingId, setExplainingId] = useState<number | null>(null);
  const [explanations, setExplanations] = useState<Record<number, string>>({}); // Store explanations by msg index
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use TTS Hook
  const { speak, speakingId } = useTextToSpeech();

  useEffect(() => {
    // Reset messages when language changes
    const initialMsg = language === 'TW' 
      ? 'Xin chào! Bạn khỏe không? (你好！你好嗎？)' 
      : '你好！你好嗎? (Xin chào! Bạn khỏe không?)';
    
    setMessages([{ role: 'model', text: initialMsg }]);
    setExplanations({});
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, explanations, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      if (input === '') {
        textareaRef.current.style.height = '24px';
      } else {
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }
  }, [input]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    setMessages(prev => [...prev, { role: 'user', text: trimmedInput }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const replyRaw = await chatWithAiTutor(history, trimmedInput, language);
      const reply = replyRaw?.replace(/\*/g, '') || ''; // Clean Markdown

      if (reply) {
         setMessages(prev => [...prev, { role: 'model', text: reply }]);
      }
    } catch (error) {
      console.error(error);
      const errMsg = language === 'TW' ? '抱歉，系統忙碌中。' : 'Xin lỗi, hệ thống đang bận.';
      setMessages(prev => [...prev, { role: 'model', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    // Determine target audio lang: TW users learn VN, VN users learn TW
    const targetLang = language === 'TW' ? 'vi-VN' : 'zh-TW';
    const cleanText = text.replace(/\(.*?\)/g, '').trim();
    speak(cleanText, targetLang, `chat-${index}`);
  };

  const handleTranslate = async (text: string, index: number) => {
    if (explainingId !== null || explanations[index]) return;
    
    setExplainingId(index);
    try {
        const result = await generateExplanation(text, language);
        setExplanations(prev => ({ ...prev, [index]: result }));
    } catch (error) {
        console.error(error);
    } finally {
        setExplainingId(null);
    }
  };

  const t = language === 'TW' ? {
    title: 'AI 越南語家教',
    placeholder: '輸入訊息...',
    translate: '翻譯與解說',
    translating: '分析中...'
  } : {
    title: 'Gia sư AI Tiếng Trung',
    placeholder: 'Nhập tin nhắn...',
    translate: 'Dịch & Giải thích',
    translating: 'Đang dịch...'
  };

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-white md:border md:border-gray-200 md:rounded-2xl md:shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${language === 'TW' ? 'bg-green-500' : 'bg-blue-600'}`}>
              <Bot className="w-6 h-6" />
           </div>
           <div>
              <h3 className="font-bold text-gray-800">{t.title}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-gray-400">Online</p>
              </div>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#f0f2f5]" 
        ref={scrollRef}
      >
        {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const showAvatar = !isUser;
            const bubbleClass = isUser 
                ? (language === 'TW' ? 'bg-[#06C755] text-white rounded-tr-none' : 'bg-[#0084FF] text-white rounded-tr-none')
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200';
            
            const isSpeaking = speakingId === `chat-${idx}`;

            return (
              <div key={idx} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                {showAvatar && (
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-white text-xs shadow-sm ${language === 'TW' ? 'bg-green-500' : 'bg-blue-600'}`}>
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex flex-col max-w-[75%]">
                  {/* The Message Bubble */}
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap break-words ${bubbleClass}`}>
                      {msg.text}
                  </div>

                  {/* AI Actions Row */}
                  {!isUser && (
                    <div className="flex items-center gap-4 mt-1 ml-1">
                        <button 
                            onClick={() => handleSpeak(msg.text, idx)}
                            disabled={isSpeaking}
                            className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${isSpeaking ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                            {isSpeaking ? 'Playing...' : 'Audio'}
                        </button>
                        
                        <button 
                            onClick={() => handleTranslate(msg.text, idx)}
                            disabled={explainingId === idx || !!explanations[idx]}
                            className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${explainingId === idx ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Languages className="w-3.5 h-3.5" />
                            {explainingId === idx ? t.translating : t.translate}
                        </button>
                    </div>
                  )}

                  {/* Explanation Block */}
                  {!isUser && explanations[idx] && (
                      <div className="mt-2 bg-white/80 backdrop-blur-sm p-3 rounded-xl border-l-4 border-blue-400 text-sm text-gray-700 shadow-sm animate-in fade-in slide-in-from-top-1">
                          <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-gray-100">
                             <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                             <span className="text-xs font-bold text-gray-500 uppercase">{language === 'TW' ? 'AI 筆記' : 'Ghi chú AI'}</span>
                          </div>
                          <div className="whitespace-pre-line leading-relaxed font-sans text-gray-800">
                              {explanations[idx]}
                          </div>
                      </div>
                  )}
                </div>
              </div>
            );
        })}

        {loading && (
            <div className="flex justify-start w-full">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-white shadow-sm ${language === 'TW' ? 'bg-green-500' : 'bg-blue-600'}`}>
                    <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                    <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 md:p-4 border-t border-gray-100">
        <div className="flex gap-2 relative items-end">
          <div className="flex-grow bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all border border-gray-200 focus-within:border-blue-200 shadow-inner">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    if (e.nativeEvent.isComposing) return;
                    e.preventDefault();
                    handleSend();
                }
              }}
              placeholder={t.placeholder}
              maxLength={500}
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-1.5 text-gray-800 placeholder-gray-500"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-full flex-shrink-0 text-white shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${language === 'TW' ? 'bg-[#06C755] hover:bg-[#05b34d]' : 'bg-[#0084FF] hover:bg-[#0073e6]'}`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
        <div className="text-right mt-1">
             <span className="text-[10px] text-gray-300">{input.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default PracticeChat;