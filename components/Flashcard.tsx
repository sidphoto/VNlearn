import React, { useState } from 'react';
import { VocabularyItem, Language } from '../types';
import { Volume2, RotateCcw } from 'lucide-react';

interface FlashcardProps {
  vocab: VocabularyItem;
  onPlayAudio: () => void;
  isPlaying: boolean;
  language: Language;
}

const Flashcard: React.FC<FlashcardProps> = ({ vocab, onPlayAudio, isPlaying, language }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayAudio();
  };

  const pronunciationLabel = language === 'TW' ? 'IPA' : 'Pinyin';

  return (
    <div 
      className="group h-64 w-full [perspective:1000px] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Front of Card */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-white shadow-md border-2 border-transparent hover:border-viet-yellow/50 p-6 flex flex-col items-center justify-center [backface-visibility:hidden]">
          <span className="absolute top-4 right-4 text-xs font-mono font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded-full uppercase">
            {vocab.type}
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-viet-red text-center mb-2">{vocab.word}</h3>
          <p className="text-gray-400 text-sm mt-4 animate-pulse">
            {language === 'TW' ? '點擊翻轉' : 'Chạm để lật'}
          </p>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-6 flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-red-100 shadow-md">
           
           {/* Header with Han Viet */}
           <div className="w-full flex justify-between items-start absolute top-4 px-4">
             <span className="text-xs text-gray-500 font-mono">{pronunciationLabel}: /{vocab.pronunciation}/</span>
             {vocab.han_viet && (
               <span className="bg-viet-red text-white text-xs px-2 py-1 rounded font-bold tracking-widest truncate max-w-[40%] text-center">
                 {vocab.han_viet}
               </span>
             )}
           </div>

           <div className="text-center mt-4 w-full">
             <p className="text-xl font-bold text-gray-800 mb-6 break-words">{vocab.meaning}</p>
             
             <button 
               onClick={handleAudioClick}
               disabled={isPlaying}
               className={`mx-auto flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                 isPlaying 
                   ? 'bg-viet-yellow text-viet-red shadow-inner ring-2 ring-red-400' 
                   : 'bg-white text-viet-green shadow-sm hover:shadow-md hover:scale-105 border border-green-100'
               }`}
             >
                {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                <span className="text-sm font-medium">
                  {language === 'TW' ? '發音' : 'Phát âm'}
                </span>
             </button>
           </div>

           <button className="absolute bottom-4 text-gray-400 hover:text-gray-600">
             <RotateCcw className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;