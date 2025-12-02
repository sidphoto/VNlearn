export type Language = 'TW' | 'VN';

export enum AppView {
  HOME = 'HOME',
  LESSON = 'LESSON',
  PRACTICE = 'PRACTICE',
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  imageSeed: number;
  imagePrompt: string; // Prompt for AI image generation
}

export interface DialogueLine {
  speaker: string;
  vietnamese: string; // Used as "Target Language" (could be Chinese in VN mode)
  mandarin: string;   // Used as "Native/Explanation Language" (could be Vietnamese in VN mode)
}

export interface VocabularyItem {
  word: string;        // The target word (VN or CN)
  meaning: string;     // The definition (CN or VN)
  pronunciation: string; 
  han_viet: string;    // Sino-Vietnamese or Pinyin
  type: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  exampleViet: string; // Target example
  exampleMandarin: string; // Native meaning
}

export interface QuizItem {
  question: string;
  correct_sentence: string;
  scrambled_words: string[];
  explanation: string;
}

export interface LessonContent {
  title: string;
  introduction: string;
  dialogue: DialogueLine[];
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  practice_quiz: QuizItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isAudio?: boolean;
}