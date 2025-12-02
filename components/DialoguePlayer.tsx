import React, { useState } from 'react';
import { DialogueLine } from '../types';
import { PlayCircle, Eye, EyeOff, Mic } from 'lucide-react';

interface DialoguePlayerProps {
  dialogue: DialogueLine[];
  onPlayAudio: (text: string, id: string) => void;
  playingId: string | null;
}

const DialoguePlayer: React.FC<DialoguePlayerProps> = ({ dialogue, onPlayAudio, playingId }) => {
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealedLines);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedLines(newRevealed);
  };

  const isStudent = (speaker: string) => {
    const s = speaker.toLowerCase();
    return s === 'me' || s === 'tôi' || s.includes('student') || s.includes('học sinh');
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm text-2xl">💡</div>
        <div>
          <h3 className="font-bold text-blue-800 text-sm mb-1">練習模式 (Chế độ luyện tập)</h3>
          <p className="text-blue-600 text-sm">試著先不要看翻譯，聽聽看再按「顯示」確認你的理解。</p>
        </div>
      </div>

      <div className="space-y-4">
        {dialogue.map((line, idx) => {
          const isUser = isStudent(line.speaker);
          const isRevealed = revealedLines.has(idx);
          const isPlaying = playingId === `d-${idx}`;

          return (
            <div 
              key={idx} 
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border-2 border-white flex-shrink-0
                ${isUser ? 'bg-viet-red text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {line.speaker}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative group transition-all duration-300
                ${isUser 
                  ? 'bg-red-50 text-gray-800 rounded-tr-none border border-red-100' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}
              >
                {/* Vietnamese Text */}
                <p className={`text-lg font-medium leading-relaxed mb-2 transition-all ${isUser && !isRevealed ? 'blur-sm select-none opacity-50' : ''}`}>
                  {line.vietnamese}
                </p>

                {/* Mandarin Translation (Hidden by default for user lines) */}
                <div className={`overflow-hidden transition-all duration-300 ${isUser && !isRevealed ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
                  <p className="text-gray-500 text-sm border-t border-gray-200/50 pt-2 mt-1">
                    {line.mandarin}
                  </p>
                </div>

                {/* Controls */}
                <div className={`flex items-center gap-2 mt-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <button
                    onClick={() => onPlayAudio(line.vietnamese, `d-${idx}`)}
                    className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium
                      ${isPlaying 
                        ? 'bg-viet-yellow text-red-700 ring-2 ring-viet-yellow ring-offset-1' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <PlayCircle className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {isPlaying ? '播放中...' : '聽發音'}
                  </button>

                  {isUser && (
                    <button
                      onClick={() => toggleReveal(idx)}
                      className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-viet-red transition-colors"
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  
                  {isUser && isRevealed && (
                     <button className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <Mic className="w-4 h-4" />
                     </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DialoguePlayer;