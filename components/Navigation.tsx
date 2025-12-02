import React from 'react';
import { AppView, Language } from '../types';
import { Globe, Languages } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, language, setLanguage }) => {
  
  const labels = {
    TW: { title: '中越文學習網', list: '課程列表', practice: 'AI 對話練習' },
    VN: { title: '中越文學習網', list: 'Danh sách bài học', practice: 'Luyện tập AI' }
  };

  const t = labels[language];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
            <div className="w-9 h-9 bg-viet-blue/10 rounded-xl flex items-center justify-center text-viet-blue">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg md:text-xl text-gray-800 tracking-tight line-clamp-1">{t.title}</span>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex space-x-1">
              <NavButton 
                active={currentView === AppView.HOME} 
                onClick={() => setView(AppView.HOME)}
                label={t.list}
              />
              <NavButton 
                active={currentView === AppView.PRACTICE} 
                onClick={() => setView(AppView.PRACTICE)}
                label={t.practice}
              />
            </div>

            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'TW' ? 'VN' : 'TW')}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              <Languages className="w-4 h-4 text-gray-500" />
              <span className={language === 'TW' ? 'text-viet-blue font-bold' : 'text-gray-400'}>TW</span>
              <span className="text-gray-300">|</span>
              <span className={language === 'VN' ? 'text-viet-red font-bold' : 'text-gray-400'}>VN</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Submenu */}
        <div className="md:hidden flex space-x-4 pb-3 text-sm">
             <button onClick={() => setView(AppView.HOME)} className={`${currentView === AppView.HOME ? 'text-viet-blue font-bold' : 'text-gray-500'}`}>{t.list}</button>
             <button onClick={() => setView(AppView.PRACTICE)} className={`${currentView === AppView.PRACTICE ? 'text-viet-blue font-bold' : 'text-gray-500'}`}>{t.practice}</button>
        </div>
      </div>
    </nav>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-viet-blue/10 text-viet-blue' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {label}
  </button>
);

export default Navigation;