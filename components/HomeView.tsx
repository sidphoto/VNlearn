import React from 'react';
import { Chapter, Language } from '../types';

interface HomeViewProps {
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  language: Language;
}

const HomeView: React.FC<HomeViewProps> = ({ chapters, onSelectChapter, language }) => {
  
  const t = language === 'TW' ? {
    welcome: '歡迎回來！',
    subtitle: '準備好開始今天的課程了嗎？',
    sectionTitle: '課程單元',
    start: '開始學習'
  } : {
    welcome: 'Chào mừng quay lại!',
    subtitle: 'Bạn đã sẵn sàng cho bài học hôm nay chưa?',
    sectionTitle: 'Các bài học',
    start: 'Bắt đầu học'
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-8">
            <svg width="300" height="300" viewBox="0 0 200 200" fill="currentColor">
                <path d="M40,100 Q100,20 160,100 T280,100" stroke="white" strokeWidth="20" fill="none" />
            </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-sans">{t.welcome}</h1>
        <p className="text-blue-100 text-lg">{t.subtitle}</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">{t.sectionTitle}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => {
          // Construct Pollinations Image URL for Ghibli/Anime style
          const encodedPrompt = encodeURIComponent(chapter.imagePrompt || chapter.title);
          // Use a fixed seed based on imageSeed to ensure consistent images across reloads
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=500&nologo=true&seed=${chapter.imageSeed}&model=flux`;

          return (
            <div 
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:-translate-y-1"
            >
              <div className="h-40 overflow-hidden relative bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt={chapter.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-95 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback if AI image fails
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${chapter.imageSeed}/400/200`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white font-bold text-lg drop-shadow-md">{chapter.id}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{chapter.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{chapter.description}</p>
                <div className="mt-4 flex items-center text-blue-500 text-sm font-medium">
                  <span>{t.start}</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeView;