import React, { useState, useEffect } from 'react';
import { LessonContent, Chapter, Language } from '../types';
import { generateLessonContent } from '../services/geminiService';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import Flashcard from './Flashcard';
import SentenceBuilder from './SentenceBuilder';
import DialoguePlayer from './DialoguePlayer';
import { BookOpen, MessageCircle, PlayCircle, ArrowLeft, GraduationCap, Grid, Edit3 } from 'lucide-react';

interface LessonViewProps {
  chapter: Chapter;
  onBack: () => void;
  language: Language;
}

type Tab = 'dialogue' | 'vocabulary' | 'grammar' | 'quiz';

const LessonView: React.FC<LessonViewProps> = ({ chapter, onBack, language }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dialogue');

  // Use the new custom hook for instant TTS
  const { speak, speakingId } = useTextToSpeech();

  const t = language === 'TW' ? {
    dialogue: '會話', vocab: '單字', grammar: '文法', quiz: '練習',
    loading: 'AI 老師正在備課中...', error: '無法生成課程內容，請稍後再試。'
  } : {
    dialogue: 'Hội thoại', vocab: 'Từ vựng', grammar: 'Ngữ pháp', quiz: 'Bài tập',
    loading: 'AI đang soạn bài...', error: 'Không thể tạo nội dung, vui lòng thử lại sau.'
  };

  // Determine TTS Language
  // TW User -> Learning Vietnamese -> Target 'vi-VN'
  // VN User -> Learning Chinese -> Target 'zh-TW'
  const ttsLang = language === 'TW' ? 'vi-VN' : 'zh-TW';

  useEffect(() => {
    let isMounted = true;
    const loadLesson = async () => {
      try {
        setLoading(true);
        const data = await generateLessonContent(chapter.title, language);
        if (isMounted) setContent(data);
      } catch (err) {
        console.error("Content Generation Error");
        if (isMounted) setError(t.error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadLesson();
    return () => { isMounted = false; };
  }, [chapter.title, language]);

  const handlePlayAudio = (text: string, id: string) => {
    // Clean the text slightly for browser TTS (remove parenthesis content)
    const cleanText = text.replace(/\(.*?\)/g, '').trim();
    speak(cleanText, ttsLang, id);
  };

  if (loading) return <LoadingSkeleton text={t.loading} />;
  if (error) return <div className="p-8 text-center text-red-600">{error} <button onClick={onBack} className="underline ml-2">Back</button></div>;
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-fade-in relative min-h-screen">
      
      {/* Top Bar */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm border-b border-gray-100 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:text-blue-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-gray-800 text-lg truncate flex-1 text-center">{chapter.title}</h1>
        <div className="w-8"></div>
      </div>

      {/* Intro Banner */}
      <div className="p-4">
        {/* Dynamic Image Header based on prompt style */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg mb-6 group">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80 z-10"></div>
             <img 
                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(chapter.imagePrompt || chapter.title)}?width=800&height=300&nologo=true&seed=${chapter.imageSeed}&model=flux`}
                alt="Header" 
                className="w-full h-40 object-cover absolute top-0 left-0 opacity-40 blur-[2px] scale-105 group-hover:scale-110 transition-transform duration-1000"
             />
             <div className="relative z-20 p-6 text-white">
                <h2 className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-2">Lesson Overview</h2>
                <p className="text-gray-100 leading-relaxed font-medium">{content.introduction}</p>
             </div>
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[50vh]">
          {activeTab === 'dialogue' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-100 p-2 rounded-lg text-orange-600"><MessageCircle className="w-5 h-5"/></span>
                <h2 className="text-xl font-bold text-gray-800">{t.dialogue}</h2>
              </div>
              <DialoguePlayer 
                dialogue={content.dialogue}
                onPlayAudio={handlePlayAudio}
                playingId={speakingId}
              />
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 p-2 rounded-lg text-green-600"><Grid className="w-5 h-5"/></span>
                <h2 className="text-xl font-bold text-gray-800">{t.vocab}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                {content.vocabulary.map((vocab, idx) => (
                  <Flashcard 
                    key={idx} 
                    vocab={vocab}
                    isPlaying={speakingId === `v-${idx}`}
                    onPlayAudio={() => handlePlayAudio(vocab.word, `v-${idx}`)}
                    language={language}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'grammar' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-50 p-2 rounded-lg text-blue-600"><BookOpen className="w-5 h-5"/></span>
                <h2 className="text-xl font-bold text-gray-800">{t.grammar}</h2>
              </div>
              <div className="space-y-6 pb-20">
                {content.grammar.map((point, idx) => (
                   <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-blue-600 mb-3 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2">{idx + 1}</span>
                      {point.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">{point.explanation}</p>
                    <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-400">
                      <div className="flex justify-between items-start">
                         <p className="text-gray-900 font-medium mb-1 text-lg">{point.exampleViet}</p>
                         <button 
                           onClick={() => handlePlayAudio(point.exampleViet, `g-${idx}`)}
                           className={`p-2 rounded-full ${speakingId === `g-${idx}` ? 'bg-yellow-200 text-red-700' : 'bg-white text-gray-400 hover:text-green-600'}`}
                         >
                           <PlayCircle className="w-5 h-5" />
                         </button>
                      </div>
                      <p className="text-gray-500 text-sm">{point.exampleMandarin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-50 p-2 rounded-lg text-red-600"><Edit3 className="w-5 h-5"/></span>
                <h2 className="text-xl font-bold text-gray-800">{t.quiz}</h2>
              </div>
               <div className="space-y-6 pb-20">
                {content.practice_quiz.map((quiz, idx) => (
                  <SentenceBuilder key={idx} quiz={quiz} />
                ))}
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <TabButton 
            active={activeTab === 'dialogue'} 
            onClick={() => setActiveTab('dialogue')} 
            icon={<MessageCircle className="w-6 h-6" />} 
            label={t.dialogue} 
          />
          <TabButton 
            active={activeTab === 'vocabulary'} 
            onClick={() => setActiveTab('vocabulary')} 
            icon={<Grid className="w-6 h-6" />} 
            label={t.vocab} 
          />
          <TabButton 
            active={activeTab === 'grammar'} 
            onClick={() => setActiveTab('grammar')} 
            icon={<BookOpen className="w-6 h-6" />} 
            label={t.grammar} 
          />
          <TabButton 
            active={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
            icon={<GraduationCap className="w-6 h-6" />} 
            label={t.quiz} 
          />
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all w-16
      ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold mt-1">{label}</span>
  </button>
);

const LoadingSkeleton = ({text}: {text: string}) => (
  <div className="max-w-4xl mx-auto p-4 space-y-8 animate-pulse flex flex-col items-center justify-center min-h-[50vh]">
    <div className="text-gray-400 mb-4 font-medium">{text}</div>
    <div className="h-40 bg-gray-100 rounded-3xl w-full mb-6"></div>
    <div className="space-y-4 w-full">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="space-y-3">
        {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-2xl w-full border border-gray-100"></div>)}
      </div>
    </div>
  </div>
);

export default LessonView;