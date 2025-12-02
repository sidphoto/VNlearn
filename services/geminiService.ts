import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LessonContent, Language } from "../types";
import { STATIC_LESSONS } from "./staticLessons";

// Helper to get API Key safely
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API Key is missing. Please check your environment variables.");
    return '';
  }
  return key;
};

// --- Cache Helpers (LocalStorage) ---

const LESSON_STORAGE_KEY = 'vietlearn_lessons_v1';
const AUDIO_STORAGE_KEY = 'vietlearn_audio_v1';

const getFromStorage = <T>(key: string, storeName: string): T | null => {
  try {
    const store = localStorage.getItem(storeName);
    if (store) {
      const parsed = JSON.parse(store);
      return parsed[key] || null;
    }
  } catch (e) {
    console.warn(`Failed to load from storage: ${storeName}`);
  }
  return null;
};

const saveToStorage = (key: string, value: any, storeName: string) => {
  try {
    const storeStr = localStorage.getItem(storeName);
    const store = storeStr ? JSON.parse(storeStr) : {};
    store[key] = value;
    localStorage.setItem(storeName, JSON.stringify(store));
  } catch (e) {
    console.warn(`Storage quota exceeded for ${storeName}. Clearing old items might be needed.`);
    // Simple strategy: If quota exceeded, clear storage and try one last time for the current item
    try {
        localStorage.removeItem(storeName);
        const newStore = { [key]: value };
        localStorage.setItem(storeName, JSON.stringify(newStore));
    } catch (retryError) {
        console.error("Storage completely full", retryError);
    }
  }
};

// Schema definition for Structured Output
const LessonSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    introduction: { type: Type.STRING, description: "Short intro in the student's native language" },
    dialogue: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING },
          vietnamese: { type: Type.STRING, description: "Target Language Text (Vietnamese for TW students, Chinese for VN students)." },
          mandarin: { type: Type.STRING, description: "Explanation/Native Language Text." }
        }
      }
    },
    vocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The word to learn (Target Language)" },
          meaning: { type: Type.STRING, description: "Meaning in Student's Native Language" },
          pronunciation: { type: Type.STRING, description: "IPA (for Vietnamese) or Pinyin (for Chinese)" },
          han_viet: { type: Type.STRING, description: "Sino-Vietnamese equivalent (Hán Việt)" },
          type: { type: Type.STRING }
        }
      }
    },
    grammar: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Explanation in Student's Native Language" },
          exampleViet: { type: Type.STRING, description: "Example in Target Language" },
          exampleMandarin: { type: Type.STRING, description: "Meaning in Student's Native Language" }
        }
      }
    },
    practice_quiz: {
      type: Type.ARRAY,
      description: "A sentence scrambling game.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Instruction in Student's Native Language" },
          correct_sentence: { type: Type.STRING, description: "Correct sentence in Target Language" },
          scrambled_words: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of words including 1 distractor" },
          explanation: { type: Type.STRING, description: "Explanation in Student's Native Language" }
        }
      }
    }
  },
  required: ["title", "introduction", "dialogue", "vocabulary", "grammar", "practice_quiz"]
};

/**
 * Validates input text to prevent basic injection or empty requests.
 */
const validateInput = (text: string): boolean => {
  if (!text || text.trim().length === 0) return false;
  if (text.length > 2000) return false; // Basic length limit
  return true;
};

export const generateLessonContent = async (chapterTitle: string, userLanguage: Language): Promise<LessonContent> => {
  if (!validateInput(chapterTitle)) throw new Error("Invalid chapter title");

  const cacheKey = `${userLanguage}-${chapterTitle}`;

  // 1. Check Static Data (Tier 1 - Instant)
  if (STATIC_LESSONS[cacheKey]) {
    console.log(`[Static Hit] Lesson: ${cacheKey}`);
    return STATIC_LESSONS[cacheKey];
  }

  // 2. Check LocalStorage (Tier 2 - Persistent)
  const cachedContent = getFromStorage<LessonContent>(cacheKey, LESSON_STORAGE_KEY);
  if (cachedContent) {
    console.log(`[Storage Hit] Lesson: ${cacheKey}`);
    return cachedContent;
  }
  
  // 3. API Fallback
  console.log(`[API Call] Generating Lesson: ${cacheKey}`);
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  let systemInstruction = "";
  if (userLanguage === 'TW') {
    systemInstruction = `
      You are a professional Vietnamese language teacher for Taiwanese students.
      Create a detailed lesson plan based on the topic: "${chapterTitle}".
      
      Pedagogical Requirements:
      1. **Target Language**: Vietnamese. **Native Language**: Traditional Chinese.
      2. **Pronunciation**: Provide IPA transcription in the 'pronunciation' field (e.g., /sin tɕaːw/).
      3. **Hán Việt**: Provide Sino-Vietnamese equivalents in the 'han_viet' field (e.g., "Xin Chào" -> "漢越：欣朝" or similar).
      4. **Structure**:
         - 'vietnamese' field = PURE Vietnamese text (Target).
         - 'mandarin' field = Traditional Chinese text (Meaning).
      5. **Strict Output**: No Chinese characters in the 'vietnamese' field.
      6. **Quantity**:
         - Vocabulary: Provide **AT LEAST 20** essential words related to the topic.
         - Quiz: Provide **AT LEAST 10** sentence scrambling questions.
    `;
  } else {
    systemInstruction = `
      You are a professional Chinese (Mandarin) language teacher for Vietnamese students.
      Create a detailed lesson plan based on the topic: "${chapterTitle}".
      
      Pedagogical Requirements:
      1. **Target Language**: Traditional Chinese (Taiwan usage). **Native Language**: Vietnamese.
      2. **Pronunciation**: Provide Pinyin with tone marks in the 'pronunciation' field (e.g., nǐ hǎo).
      3. **Hán Việt**: Provide the Sino-Vietnamese sound of the Chinese characters in the 'han_viet' field (e.g., "你好" -> "Nhĩ Hảo"). This is crucial for Vietnamese learners.
      4. **Structure**:
         - 'vietnamese' field = PURE Chinese text (Target). (Note: The schema key is 'vietnamese' but you must put CHINESE here).
         - 'mandarin' field = Vietnamese text (Meaning).
      5. **Quantity**:
         - Vocabulary: Provide **AT LEAST 20** essential words related to the topic.
         - Quiz: Provide **AT LEAST 10** sentence scrambling questions.
    `;
  }

  const prompt = `
    ${systemInstruction}
    Topic: "${chapterTitle}".
    Follow the JSON schema strictly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: LessonSchema,
        thinkingConfig: { thinkingBudget: 4096 } // Increased budget for longer content generation
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    const parsedContent = JSON.parse(text) as LessonContent;
    
    // Save to Cache (Tier 2)
    saveToStorage(cacheKey, parsedContent, LESSON_STORAGE_KEY);
    
    return parsedContent;
  } catch (error) {
    console.error("Secure Log: Error generating lesson content", error);
    throw new Error("Failed to generate lesson content due to an AI service error.");
  }
};

export const generateSpeech = async (text: string, targetLang: Language = 'VN'): Promise<string | undefined> => {
  if (!validateInput(text)) return undefined;

  // Clean text based on target language to remove potential artifacts
  let cleanText = text
    .replace(/\([^)]*\)/g, '')          // Remove (text)
    .replace(/[（(].*?[)）]/g, '')      // Remove full-width
    .replace(/\s+/g, ' ')
    .trim();

  // If Target is Vietnamese (TW user learning VN), remove Chinese chars
  if (targetLang === 'VN') {
    cleanText = cleanText.replace(/[\u4e00-\u9fa5]/g, '');
  }
  // If Target is Chinese (VN user learning TW), we keep Chinese chars.

  if (!cleanText) {
    console.warn("Audio generation skipped: Text empty after cleaning.");
    return undefined;
  }

  // Check Cache (LocalStorage)
  const cacheKey = `${targetLang}-${cleanText}`;
  const cachedAudio = getFromStorage<string>(cacheKey, AUDIO_STORAGE_KEY);
  if (cachedAudio) {
    console.log(`[Storage Hit] Audio: ${cleanText.substring(0, 10)}...`);
    return cachedAudio;
  }

  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      // Save to Cache
      saveToStorage(cacheKey, base64Audio, AUDIO_STORAGE_KEY);
    }

    return base64Audio;
  } catch (error) {
    console.error("Secure Log: TTS Error", error);
    return undefined;
  }
};

export const chatWithAiTutor = async (history: {role: string, parts: {text: string}[]}[], message: string, userLanguage: Language) => {
  // No caching for Chat to maintain real-time interaction
  if (!validateInput(message)) throw new Error("Invalid input");

  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const instruction = userLanguage === 'TW' 
    ? "You are a friendly Vietnamese tutor for a Taiwanese student. Reply in Vietnamese."
    : "You are a friendly Chinese (Taiwanese Mandarin) tutor for a Vietnamese student. Reply in Chinese.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: instruction,
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Secure Log: Chat Error", error);
    throw new Error("Unable to connect to AI Tutor.");
  }
}

/**
 * Explains and translates a specific message for the user.
 * Strictly formatted for efficiency and bilingual support without English.
 */
export const generateExplanation = async (text: string, userLanguage: Language): Promise<string> => {
    if (!validateInput(text)) return "";
    
    // Optional: Cache explanations too if they are static (skipped here to allow varied explanations)

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Strict prompt to ensure concise, non-English response
    const instruction = userLanguage === 'TW'
        ? `
        請針對以下越南文句子進行解析： "${text}"
        
        嚴格規則：
        1. **絕對禁止使用英文**。
        2. 請使用**繁體中文**回答。
        3. 格式必須完全符合以下三行，確保簡潔有效率：
           【翻譯】(自然流暢的中文翻譯)
           【單字】(列出 1-2 個關鍵單字與意思)
           【文法】(用**一句話**簡潔解釋句型結構)
        `
        : `
        Vui lòng phân tích câu tiếng Trung (Đài Loan) sau: "${text}"
        
        Quy tắc nghiêm ngặt:
        1. **TUYỆT ĐỐI KHÔNG DÙNG TIẾNG ANH**.
        2. Trả lời bằng **Tiếng Việt**.
        3. Định dạng phải chính xác như sau để ngắn gọn:
           【Dịch】(Dịch nghĩa tự nhiên)
           【Từ vựng】(Liệt kê 1-2 từ khóa và nghĩa)
           【Ngữ pháp】(Giải thích cấu trúc trong **một câu** ngắn gọn)
        `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: instruction,
        });
        return response.text || "";
    } catch (error) {
        console.error("Secure Log: Explanation Error", error);
        return userLanguage === 'TW' ? "暫時無法翻譯。" : "Không thể dịch ngay bây giờ.";
    }
}