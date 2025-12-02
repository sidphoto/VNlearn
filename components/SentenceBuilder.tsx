import React, { useState, useEffect } from 'react';
import { QuizItem } from '../types';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface SentenceBuilderProps {
  quiz: QuizItem;
}

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ quiz }) => {
  // Use index-based identification to handle duplicate words if necessary
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // We assign a unique ID to each word in the scrambled array to track movement
  const [wordMap, setWordMap] = useState<{id: number, text: string}[]>([]);

  useEffect(() => {
    // Reset when quiz changes
    setWordMap(quiz.scrambled_words.map((word, idx) => ({ id: idx, text: word })));
    setSelectedIndices([]);
    setStatus('idle');
  }, [quiz]);

  const handleWordClick = (originalIndex: number, isSelected: boolean) => {
    if (status === 'correct') return;

    if (isSelected) {
      // Deselect: Remove from selectedIndices
      setSelectedIndices(prev => prev.filter(i => i !== originalIndex));
    } else {
      // Select: Add to selectedIndices
      setSelectedIndices(prev => [...prev, originalIndex]);
    }
    setStatus('idle');
  };

  const checkAnswer = () => {
    const userAnswer = selectedIndices.map(idx => wordMap[idx].text).join(' ');
    
    // Normalize logic (remove punctuation for comparison flexibility)
    const cleanUser = userAnswer.toLowerCase().replace(/[.,?!]/g, '').trim();
    const cleanCorrect = quiz.correct_sentence.toLowerCase().replace(/[.,?!]/g, '').trim();

    if (cleanUser === cleanCorrect) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const reset = () => {
    setSelectedIndices([]);
    setStatus('idle');
  };

  // Derived state for rendering
  const selectedWords = selectedIndices.map(idx => wordMap[idx]);
  const availableWords = wordMap.filter(w => !selectedIndices.includes(w.id));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-1">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-lg">重組句子</h4>
          <p className="text-gray-500">{quiz.question}</p>
        </div>
      </div>

      {/* Answer Drop Zone */}
      <div className={`min-h-[80px] p-4 rounded-xl border-2 mb-6 flex flex-wrap gap-2 transition-all duration-300 ${
        status === 'correct' ? 'border-viet-green bg-green-50/50' : 
        status === 'incorrect' ? 'border-viet-red bg-red-50/50' : 
        'border-dashed border-gray-300 bg-gray-50'
      }`}>
        {selectedWords.length === 0 && (
          <span className="text-gray-400 text-sm self-center italic w-full text-center">
            點擊下方單字卡建立句子...
          </span>
        )}
        {selectedWords.map((item) => (
          <button
            key={`selected-${item.id}`}
            onClick={() => handleWordClick(item.id, true)}
            className="animate-in fade-in zoom-in duration-200 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm font-medium text-gray-800 hover:border-red-300 hover:text-red-500 transition-colors"
          >
            {item.text}
          </button>
        ))}
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {availableWords.map((item) => (
          <button
            key={`available-${item.id}`}
            onClick={() => handleWordClick(item.id, false)}
            className="px-4 py-2 bg-viet-yellow/10 border border-viet-yellow/40 text-gray-700 rounded-lg hover:bg-viet-yellow hover:text-viet-red hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            {item.text}
          </button>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <button 
          onClick={reset}
          className="flex items-center text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          <span className="text-sm">重置</span>
        </button>

        <button 
          onClick={checkAnswer}
          disabled={selectedWords.length === 0 || status === 'correct'}
          className={`flex items-center px-6 py-2.5 rounded-full font-bold shadow-md transition-all ${
            status === 'correct' 
              ? 'bg-viet-green text-white cursor-default'
              : status === 'incorrect'
              ? 'bg-viet-red text-white hover:bg-red-700'
              : 'bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {status === 'correct' ? '正確完美！' : status === 'incorrect' ? '再試一次' : '檢查答案'}
          {status === 'correct' && <CheckCircle2 className="ml-2 w-5 h-5" />}
          {status === 'incorrect' && <XCircle className="ml-2 w-5 h-5" />}
        </button>
      </div>

      {/* Explanation Reveal */}
      {status === 'correct' && (
        <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100 animate-in slide-in-from-top-2 duration-500">
          <div className="flex gap-2">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold text-green-800 text-sm mb-1">文法解析：</p>
              <p className="text-green-900 text-sm leading-relaxed">{quiz.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentenceBuilder;