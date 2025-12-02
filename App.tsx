import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import LessonView from './components/LessonView';
import PracticeChat from './components/PracticeChat';
import { AppView, Chapter, Language } from './types';

// Curriculum for Taiwanese learning Vietnamese
const CHAPTERS_TW: Chapter[] = [
  { 
    id: 'Bai 1', 
    title: 'Xin Chào (打招呼)', 
    description: '學習基本的問候語、自我介紹與禮貌用語。', 
    imageSeed: 124, 
    imagePrompt: 'Anime style, Studio Ghibli style, A warm morning in Hanoi, two friendly students bowing and saying hello in a sunny street with yellow french colonial buildings' 
  },
  { 
    id: 'Bai 2', 
    title: 'Bạn Tên Là Gì? (你叫什麼名字?)', 
    description: '詢問姓名、國籍以及職業的常用句型。', 
    imageSeed: 85, 
    imagePrompt: 'Anime style, Studio Ghibli style, two people shaking hands and introducing themselves in a cozy coffee shop in Vietnam, soft lighting'
  },
  { 
    id: 'Bai 3', 
    title: 'Số Đếm (數字)', 
    description: '學習 1-100 的數字、電話號碼與年齡表達。', 
    imageSeed: 22, 
    imagePrompt: 'Anime style, Studio Ghibli style, a colorful traditional Vietnamese market scene with price tags and fruits, bright colors'
  },
  { 
    id: 'Bai 4', 
    title: 'Mua Sắm (購物)', 
    description: '詢問價格、殺價與市場購物的實用對話。', 
    imageSeed: 41, 
    imagePrompt: 'Anime style, Studio Ghibli style, a busy shopping street in Saigon, people buying clothes and souvenirs, detailed background'
  },
  { 
    id: 'Bai 5', 
    title: 'Gọi Món (點餐)', 
    description: '在餐廳閱讀菜單、點菜與用餐禮儀。', 
    imageSeed: 55, 
    imagePrompt: 'Anime style, Studio Ghibli style, delicious Vietnamese Pho noodles and spring rolls on a table, people eating happily in a restaurant'
  },
  { 
    id: 'Bai 6', 
    title: 'Hỏi Đường (問路)', 
    description: '方向指引、交通工具與距離的表達方式。', 
    imageSeed: 120, 
    imagePrompt: 'Anime style, Studio Ghibli style, a person holding a map asking for directions on a street corner with motorbikes passing by'
  },
];

// Curriculum for Vietnamese learning Chinese
const CHAPTERS_VN: Chapter[] = [
  { 
    id: 'Bài 1', 
    title: 'Xin Chào (你好)', 
    description: 'Học cách chào hỏi cơ bản và giới thiệu bản thân.', 
    imageSeed: 201, 
    imagePrompt: 'Anime style, Studio Ghibli style, A modern Taipei street scene with Taipei 101 in background, two young people waving hello'
  },
  { 
    id: 'Bài 2', 
    title: 'Bạn Tên Gì? (你叫什麼名字?)', 
    description: 'Cách hỏi tên, quốc tịch và nghề nghiệp.', 
    imageSeed: 202, 
    imagePrompt: 'Anime style, Studio Ghibli style, A university classroom setting, students introducing themselves, gentle atmosphere'
  },
  { 
    id: 'Bài 3', 
    title: 'Số Đếm (數字)', 
    description: 'Học số đếm 1-100, số điện thoại và tuổi.', 
    imageSeed: 203, 
    imagePrompt: 'Anime style, Studio Ghibli style, A night market scene in Taiwan with neon numbers and price signs, bustling atmosphere'
  },
  { 
    id: 'Bài 4', 
    title: 'Mua Sắm (購物)', 
    description: 'Hỏi giá, trả giá và mua sắm tại chợ.', 
    imageSeed: 204, 
    imagePrompt: 'Anime style, Studio Ghibli style, Inside a convenience store or bubble tea shop, exchanging money and goods'
  },
  { 
    id: 'Bài 5', 
    title: 'Ăn Uống (飲食)', 
    description: 'Cách gọi món và văn hóa ăn uống.', 
    imageSeed: 205, 
    imagePrompt: 'Anime style, Studio Ghibli style, A table full of dumplings and beef noodle soup, steam rising, warm lighting'
  },
  { 
    id: 'Bài 6', 
    title: 'Giao Thông (交通)', 
    description: 'Hỏi đường và các phương tiện đi lại.', 
    imageSeed: 206, 
    imagePrompt: 'Anime style, Studio Ghibli style, MRT station in Taipei, people waiting for the train, clean and modern lines'
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [language, setLanguage] = useState<Language>('TW');

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentView(AppView.LESSON);
  };

  const handleBackToHome = () => {
    setSelectedChapter(null);
    setCurrentView(AppView.HOME);
  };

  const renderContent = () => {
    const chapters = language === 'TW' ? CHAPTERS_TW : CHAPTERS_VN;

    switch (currentView) {
      case AppView.HOME:
        return <HomeView chapters={chapters} onSelectChapter={handleSelectChapter} language={language} />;
      case AppView.LESSON:
        if (selectedChapter) {
          return <LessonView chapter={selectedChapter} onBack={handleBackToHome} language={language} />;
        }
        return <HomeView chapters={chapters} onSelectChapter={handleSelectChapter} language={language} />;
      case AppView.PRACTICE:
        return <PracticeChat language={language} />;
      default:
        return <HomeView chapters={chapters} onSelectChapter={handleSelectChapter} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        language={language}
        setLanguage={setLanguage}
      />
      <main className="container mx-auto mt-6 pb-24 md:pb-10">
        {renderContent()}
      </main>
      
      {/* Footer Decoration (Desktop only) */}
      <footer className="fixed bottom-0 w-full z-0 hidden md:block pointer-events-none">
        <div className="flex justify-between items-end px-6 pb-2">
           <svg width="200" height="100" viewBox="0 0 200 100" className="text-gray-200 fill-current opacity-30">
              <path d="M20,100 Q40,40 80,100 T140,100 T200,100 L200,110 L0,110 Z" />
           </svg>
           <p className="text-xs text-gray-300 font-medium mb-2 mr-4">臺灣越南女婿的心血結晶</p>
        </div>
      </footer>
       {/* Mobile Footer Credit */}
       <div className="md:hidden text-center pb-24 text-xs text-gray-300">
          臺灣越南女婿的心血結晶
       </div>
    </div>
  );
};

export default App;